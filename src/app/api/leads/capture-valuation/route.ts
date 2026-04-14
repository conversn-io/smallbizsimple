import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';
import { formatE164 } from '@/utils/phone-utils';
import * as crypto from 'crypto';

export async function OPTIONS() {
  return handleCorsOptions();
}

function phoneHash(phone: string | null): string | null {
  if (!phone) return null;
  return crypto.createHash('sha256').update(phone).digest('hex');
}

async function upsertContact(email: string, firstName: string | null, lastName: string | null, phone: string | null = null) {
  const emailLower = email?.toLowerCase();
  const normalizedPhone = phone ? formatE164(phone) : null;
  
  const { data: existingByEmail } = await callreadyQuizDb
    .from('contacts')
    .select('*')
    .eq('email', emailLower)
    .maybeSingle();
  
  let existingByPhone = null;
  if (normalizedPhone) {
    const phoneHashVal = phoneHash(normalizedPhone);
    const { data: phoneMatch } = await callreadyQuizDb
      .from('contacts')
      .select('*')
      .eq('phone_hash', phoneHashVal)
      .maybeSingle();
    existingByPhone = phoneMatch;
  }
  
  const existing = existingByEmail || existingByPhone;
  
  if (existing?.id) {
    const updateData: any = {};
    if (firstName && !existing.first_name) updateData.first_name = firstName;
    if (lastName && !existing.last_name) updateData.last_name = lastName;
    if (normalizedPhone && !existing.phone) {
      updateData.phone = normalizedPhone;
      updateData.phone_hash = phoneHash(normalizedPhone);
    }
    if (emailLower && !existing.email) updateData.email = emailLower;
    
    if (Object.keys(updateData).length > 0) {
      const { data: updated } = await callreadyQuizDb
        .from('contacts')
        .update(updateData)
        .eq('id', existing.id)
        .select('*')
        .single();
      return updated || existing;
    }
    return existing;
  }
  
  const contactData: any = {
    email: emailLower,
    first_name: firstName,
    last_name: lastName,
    source: 'smallbizsimple_valuation_quiz',
  };
  
  if (normalizedPhone) {
    contactData.phone = normalizedPhone;
    contactData.phone_hash = phoneHash(normalizedPhone);
  }
  
  const { data: newContact, error } = await callreadyQuizDb
    .from('contacts')
    .insert(contactData)
    .select('*')
    .single();
  
  if (error) {
    if (error.message?.includes('phone_hash') || error.message?.includes('source')) {
      const fallbackData: any = {
        email: emailLower,
        first_name: firstName,
        last_name: lastName,
      };
      if (normalizedPhone) fallbackData.phone = normalizedPhone;
      
      const { data: fallbackContact } = await callreadyQuizDb
        .from('contacts')
        .insert(fallbackData)
        .select('*')
        .single();
      
      if (fallbackContact) return fallbackContact;
    }
    throw error;
  }
  
  return newContact;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName,
      phoneNumber,
      quizAnswers, 
      calculatedResults,
      sessionId, 
      utmParams 
    } = body;

    if (!email) {
      return createCorsResponse({ error: 'Email is required' }, 400);
    }

    const contact = await upsertContact(email, firstName, lastName, phoneNumber || null);
    const contactId = contact.id || contact;

    let existingLead = null;
    if (sessionId) {
      const { data: existing } = await callreadyQuizDb
        .from('leads')
        .select('*')
        .eq('contact_id', contactId)
        .eq('session_id', sessionId)
        .maybeSingle();
      existingLead = existing;
    }

    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;
    const landingPage = request.headers.get('x-forwarded-url') || request.url || referrer || null;
    
    let userId = email; 
    if (sessionId) {
      const { data: sessionEvent } = await callreadyQuizDb
        .from('analytics_events')
        .select('user_id')
        .eq('session_id', sessionId)
        .not('user_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      userId = sessionEvent?.user_id || email;
    }
    
    const contactData = {
      email,
      phone: phoneNumber || null,
      first_name: firstName,
      last_name: lastName
    };

    const leadData: any = {
      contact_id: contactId,
      session_id: sessionId,
      site_key: 'smallbizsimple.org',
      funnel_type: 'business_valuation',
      status: 'valuation_calculated',
      is_verified: !!phoneNumber,
      referrer,
      landing_page: landingPage,
      user_id: userId,
      contact: contactData,
      quiz_answers: {
        ...quizAnswers,
        calculated_results: calculatedResults,
        utm_parameters: utmParams || {},
      },
      utm_source: utmParams?.utm_source || null,
      utm_medium: utmParams?.utm_medium || null,
      utm_campaign: utmParams?.utm_campaign || null,
    };

    let lead;
    if (existingLead?.id) {
      const { data: updated, error: updateError } = await callreadyQuizDb
        .from('leads')
        .update({ ...leadData, id: existingLead.id })
        .eq('id', existingLead.id)
        .select('*')
        .single();
        
      if (updateError) {
        const isColumnErr = updateError.code === 'PGRST204' || updateError.message?.includes('column');
        if (isColumnErr) {
          delete leadData.form_type;
          delete leadData.attributed_ad_account;
          delete leadData.profit_center;
          const { data: fallbackUpdated, error: fallbackError } = await callreadyQuizDb
            .from('leads')
            .update(leadData)
            .eq('id', existingLead.id)
            .select('*')
            .single();
          if (fallbackUpdated) lead = fallbackUpdated;
          else throw fallbackError;
        } else {
          throw updateError;
        }
      } else {
        lead = updated || existingLead;
      }
    } else {
      const { data: newLead, error: leadError } = await callreadyQuizDb
        .from('leads')
        .insert(leadData)
        .select('*')
        .single();
        
      if (leadError) {
        const isColumnErr = leadError.code === 'PGRST204' || leadError.message?.includes('column');
        if (isColumnErr) {
          delete leadData.form_type;
          delete leadData.attributed_ad_account;
          delete leadData.profit_center;
          const { data: fallbackLead, error: fallbackError } = await callreadyQuizDb
            .from('leads')
            .insert(leadData)
            .select('*')
            .single();
          if (fallbackLead) lead = fallbackLead;
          else throw fallbackError;
        } else {
          throw leadError;
        }
      } else {
        lead = newLead;
      }
    }

    // Analytics event
    const { data: event, error: eventError } = await callreadyQuizDb
      .from('analytics_events')
      .insert({
        event_name: 'valuation_lead_captured',
        event_category: 'lead_generation',
        event_label: 'smallbizsimple_valuation_quiz',
        user_id: email,
        session_id: sessionId,
        page_url: referrer,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        properties: {
          site_key: 'smallbizsimple.org',
          email,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber || null,
          quiz_answers: quizAnswers,
          calculated_results: calculatedResults,
          funnel_type: 'business_valuation',
          utm_parameters: utmParams
        }
      })
      .select()
      .single();

    // Fire GHL Webhook if phone was provided
    if (phoneNumber) {
      const webhookUrl = process.env.SMALLBIZSIMPLE_GHL_WEBHOOK;
      if (webhookUrl) {
        const payload = {
          email,
          phone: formatE164(phoneNumber),
          firstName,
          lastName,
          customField: {
            industry: quizAnswers?.industry,
            revenue_range: quizAnswers?.revenueRange,
            sde_range: quizAnswers?.sdeRange,
            sde_estimate: calculatedResults?.sdeEstimate,
            years_in_business: quizAnswers?.yearsInBusiness,
            revenue_trend: quizAnswers?.revenueTrend,
            owner_dependency: quizAnswers?.ownerDependency,
            customer_concentration: quizAnswers?.customerConcentration,
            valuation_low: calculatedResults?.valuationLow,
            valuation_high: calculatedResults?.valuationHigh,
            total_adjustment: calculatedResults?.totalAdjustment,
            edge_case: calculatedResults?.edgeCase,
            source: "smallbizsimple_valuation_quiz",
            quiz_completed_at: new Date().toISOString()
          },
          tags: ["valuation_quiz", "smallbizsimple"],
          source: "SmallBizSimple Valuation Quiz"
        };
        
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (webhookErr) {
          console.error('Failed to send to GHL webhook');
        }
      }
    }

    return createCorsResponse({ 
      success: true, 
      eventId: event?.id,
      contactId,
      leadId: lead?.id,
      isVerified: !!phoneNumber
    });

  } catch (error: any) {
    console.error('Valuation Capture Exception:', error);
    return createCorsResponse({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error' 
    }, 500);
  }
}
