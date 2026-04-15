'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { OTPVerification } from './OTPVerification';
import { ProcessingState } from './ProcessingState';
import { 
  initializeTracking, 
  trackQuestionAnswer, 
  trackLeadFormSubmit, 
  trackPageView, 
  trackQuizStart, 
  trackQuizComplete,
  LeadData
} from '@/lib/temp-tracking';
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, UTMParameters } from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';

interface QuizAnswer {
  [key: string]: any;
}

// Business Funding Quiz Questions (from Lendio docket)
const BUSINESS_FUNDING_QUESTIONS = [
  {
    id: 'business_name',
    title: 'What is your business name?',
    subtitle: 'Enter the legal name of your business',
    type: 'text' as const,
    placeholder: 'Enter your business name',
    required: true,
  },
  {
    id: 'business_type',
    title: 'What type of business do you own?',
    subtitle: 'Select the legal structure of your business',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Business Type --' },
      { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
      { value: 'llc', label: 'LLC' },
      { value: 's_corp', label: 'S-Corporation' },
      { value: 'c_corp', label: 'C-Corporation' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'nonprofit', label: 'Nonprofit' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  {
    id: 'time_in_business',
    title: 'How long have you been in business?',
    subtitle: 'This helps us match you with the right lenders',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select --' },
      { value: 'less_than_6_months', label: 'Less than 6 months' },
      { value: '6_to_12_months', label: '6-12 months' },
      { value: '1_to_2_years', label: '1-2 years' },
      { value: '2_to_5_years', label: '2-5 years' },
      { value: '5_to_10_years', label: '5-10 years' },
      { value: '10_plus_years', label: '10+ years' },
    ],
    required: true,
  },
  {
    id: 'annual_revenue',
    title: 'What is your annual business revenue?',
    subtitle: 'Your total annual business income',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Annual Revenue --' },
      { value: '0_to_50k', label: '$0 - $50,000' },
      { value: '50k_to_100k', label: '$50,000 - $100,000' },
      { value: '100k_to_250k', label: '$100,000 - $250,000' },
      { value: '250k_to_500k', label: '$250,000 - $500,000' },
      { value: '500k_to_1m', label: '$500,000 - $1,000,000' },
      { value: '1m_to_5m', label: '$1,000,000 - $5,000,000' },
      { value: '5m_plus', label: '$5,000,000+' },
    ],
    required: true,
  },
  {
    id: 'funding_amount',
    title: 'How much funding are you looking for?',
    subtitle: 'Select the amount that best matches your needs',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Funding Amount --' },
      { value: '5k_to_25k', label: '$5,000 - $25,000' },
      { value: '25k_to_50k', label: '$25,000 - $50,000' },
      { value: '50k_to_100k', label: '$50,000 - $100,000' },
      { value: '100k_to_250k', label: '$100,000 - $250,000' },
      { value: '250k_to_500k', label: '$250,000 - $500,000' },
      { value: '500k_to_1m', label: '$500,000 - $1,000,000' },
      { value: '1m_plus', label: '$1,000,000+' },
    ],
    required: true,
  },
  {
    id: 'funding_purpose',
    title: 'What will you use the funding for?',
    subtitle: 'Select the primary use for your funding',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Purpose --' },
      { value: 'working_capital', label: 'Working Capital' },
      { value: 'equipment_purchase', label: 'Equipment Purchase' },
      { value: 'inventory', label: 'Inventory' },
      { value: 'expansion', label: 'Business Expansion' },
      { value: 'debt_consolidation', label: 'Debt Consolidation' },
      { value: 'marketing', label: 'Marketing & Advertising' },
      { value: 'payroll', label: 'Payroll' },
      { value: 'real_estate', label: 'Real Estate Purchase' },
      { value: 'refinancing', label: 'Refinancing Existing Debt' },
      { value: 'other', label: 'Other' },
    ],
    required: true,
  },
  {
    id: 'credit_score',
    title: 'What is your credit score?',
    subtitle: 'We use this to match you with the best lenders',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Credit Score Range --' },
      { value: 'excellent', label: 'Excellent (750+)' },
      { value: 'good', label: 'Good (700-749)' },
      { value: 'fair', label: 'Fair (650-699)' },
      { value: 'poor', label: 'Poor (600-649)' },
      { value: 'very_poor', label: 'Very Poor (Below 600)' },
      { value: 'unknown', label: "I don't know" },
    ],
    required: true,
    helpText: 'We use this to match you with the best lenders',
  },
  {
    id: 'zip_code',
    title: 'Business ZIP Code',
    subtitle: 'Used to find local lenders',
    type: 'text' as const,
    placeholder: '12345',
    required: true,
    helpText: 'Used to find local lenders',
  },
  {
    id: 'personal_info',
    title: "Let's get your contact information",
    subtitle: "We'll use this to send you personalized recommendations",
    type: 'personal-info' as const,
    required: true,
    helpText: "We'll send your loan matches here",
  },
];

export const BusinessFundingQuiz = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showOTP, setShowOTP] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());

  const questions = BUSINESS_FUNDING_QUESTIONS;
  const totalSteps = questions.length;

  useEffect(() => {
    // Generate unique session ID for tracking
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    setQuizStartTime(Date.now());
    
    // Initialize comprehensive tracking
    initializeTracking();
    
    // Track page view
    trackPageView('SmallBizSimple Business Funding Quiz', '/quiz/business-funding');
    
    // Track quiz start
    trackQuizStart('business_funding', sessionId);
    
    console.log('🚀 Quiz Session Started:', { 
      sessionId,
      totalSteps,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    });

    // UTM Tracking - Extract and track UTM parameters
    const extractAndTrackUTM = async () => {
      const utmTracked = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utm_tracked') : null;
      if (utmTracked === 'true') {
        console.log('📊 UTM Already Tracked for This Session');
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
        }
        return;
      }

      const utmData = extractUTMParameters();
      
      if (hasUTMParameters(utmData)) {
        console.log('📊 UTM Parameters Found:', utmData);
        setUtmParams(utmData);
        storeUTMParameters(utmData);
        
        const trackingSuccess = await trackUTMParameters(sessionId, utmData);
        
        if (trackingSuccess && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('utm_tracked', 'true');
          console.log('✅ UTM Parameters Tracked Successfully');
        } else {
          console.error('❌ UTM Tracking Failed');
        }
      } else {
        console.log('📊 No UTM Parameters Found in URL');
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
          console.log('📊 Using Stored UTM Parameters:', storedUtm);
        }
      }
    };

    extractAndTrackUTM();
  }, [totalSteps]);

  // Calculate lead score based on answers
  const calculateLeadScore = (): number => {
    let score = 50; // Base score

    // Time in business scoring
    const timeInBusiness = answers.time_in_business;
    if (timeInBusiness === '10_plus_years') score += 20;
    else if (timeInBusiness === '5_to_10_years') score += 15;
    else if (timeInBusiness === '2_to_5_years') score += 10;
    else if (timeInBusiness === '1_to_2_years') score += 5;
    else if (timeInBusiness === 'less_than_6_months' || timeInBusiness === '6_to_12_months') score += 0;

    // Annual revenue scoring
    const revenue = answers.annual_revenue;
    if (revenue === '5m_plus') score += 25;
    else if (revenue === '1m_to_5m') score += 20;
    else if (revenue === '500k_to_1m') score += 15;
    else if (revenue === '250k_to_500k') score += 10;
    else if (revenue === '100k_to_250k') score += 5;
    else if (revenue === '0_to_50k' || revenue === '50k_to_100k') score += 0;

    // Credit score scoring
    const creditScore = answers.credit_score;
    if (creditScore === 'excellent') score += 25;
    else if (creditScore === 'good') score += 20;
    else if (creditScore === 'fair') score += 15;
    else if (creditScore === 'poor') score += 10;
    else if (creditScore === 'very_poor') score += 5;
    else if (creditScore === 'unknown') score += 0;

    // Funding amount vs revenue match
    const fundingAmount = answers.funding_amount;
    if (revenue === '5m_plus' && fundingAmount === '1m_plus') score += 10;
    else if (revenue === '1m_to_5m' && (fundingAmount === '500k_to_1m' || fundingAmount === '1m_plus')) score += 10;
    else if (revenue === '500k_to_1m' && (fundingAmount === '250k_to_500k' || fundingAmount === '500k_to_1m')) score += 10;
    else if (revenue === '250k_to_500k' && (fundingAmount === '100k_to_250k' || fundingAmount === '250k_to_500k')) score += 10;
    else if (revenue === '100k_to_250k' && (fundingAmount === '50k_to_100k' || fundingAmount === '100k_to_250k')) score += 10;
    else if (fundingAmount && revenue) {
      // If funding amount is significantly higher than revenue, reduce score
      const fundingOrder = ['5k_to_25k', '25k_to_50k', '50k_to_100k', '100k_to_250k', '250k_to_500k', '500k_to_1m', '1m_plus'];
      const revenueOrder = ['0_to_50k', '50k_to_100k', '100k_to_250k', '250k_to_500k', '500k_to_1m', '1m_to_5m', '5m_plus'];
      const fundingIndex = fundingOrder.indexOf(fundingAmount);
      const revenueIndex = revenueOrder.indexOf(revenue);
      if (fundingIndex > revenueIndex + 1) score -= 5;
    }

    // Cap at 100
    return Math.min(100, Math.max(0, score));
  };

  const handleAnswer = async (answer: any) => {
    const currentQuestion = questions[currentStep];
    
    // Track question answer
    try {
      trackQuestionAnswer(currentQuestion.id, answer, currentStep + 1, questions.length, quizSessionId || 'unknown', 'business_funding');
    } catch (err) {
      console.error('Tracking error:', err);
    }
    
    console.log('📝 Quiz Answer Received:', {
      sessionId: quizSessionId,
      step: currentStep + 1,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      answer: answer,
      timestamp: new Date().toISOString()
    });
    
    // Store answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    // Handle personal info submission - save email for retargeting
    if (currentQuestion.id === 'personal_info') {
      console.log('📧 Personal Info Submitted - Capturing Email for Retargeting');
      
      const leadScore = calculateLeadScore();
      
      const emailCaptureData = {
        email: answer.email,
        firstName: answer.firstName,
        lastName: answer.lastName,
        phoneNumber: answer.phone,
        quizAnswers: updatedAnswers,
        sessionId: quizSessionId || 'unknown',
        funnelType: 'business_funding',
        zipCode: updatedAnswers.zip_code,
        state: null, // Will be populated from zip if we add zip validation
        stateName: null,
        licensingInfo: null,
        utmParams: utmParams,
        leadScore: leadScore
      };

      try {
        const response = await fetch('/api/leads/capture-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailCaptureData)
        });

        let result: any = {};
        try {
          const text = await response.text();
          if (text) {
            try {
              result = JSON.parse(text);
            } catch {
              result = { raw: text, success: false, error: 'Invalid JSON response' };
            }
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse email capture response:', parseError);
          result = { success: false, error: 'Failed to parse response' };
        }

        if (response.ok && result.success) {
          console.log('✅ Email Captured for Retargeting:', { eventId: result.eventId, email: answer.email });
          
          // Track lead form submit
          const leadData: LeadData = {
            firstName: answer.firstName,
            lastName: answer.lastName,
            email: answer.email,
            phoneNumber: answer.phone,
            zipCode: updatedAnswers.zip_code || '',
            state: '',
            stateName: '',
            quizAnswers: updatedAnswers,
            sessionId: quizSessionId || 'unknown',
            funnelType: 'business_funding',
            businessType: updatedAnswers.business_type,
            revenue: updatedAnswers.annual_revenue,
            leadScore: leadScore
          };
          trackLeadFormSubmit(leadData);
        } else {
          console.error('❌ Email Capture Failed:', result);
        }
      } catch (error: any) {
        console.error('💥 Email Capture Exception:', error);
      }
      
      // Show OTP verification
      console.log('📱 Personal Info Complete - Initiating OTP Flow:', {
        sessionId: quizSessionId || 'unknown',
        phoneNumber: answer.phone,
        timestamp: new Date().toISOString()
      });
      
      setShowOTP(true);
      return;
    }

    // Auto-advance for text inputs (business name, zip)
    if (currentQuestion.type === 'text' && currentQuestion.id !== 'personal_info') {
      // Small delay for better UX
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 300);
      return;
    }

    // Auto-advance for dropdowns
    if (currentQuestion.type === 'dropdown' && answer) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 300);
      return;
    }
  };

  const handleOTPVerification = async () => {
    console.log('🔐 OTP Verification Complete - Sending to GHL:', {
      sessionId: quizSessionId || 'unknown',
      timestamp: new Date().toISOString()
    });

    setShowProcessing(true);

    const leadScore = calculateLeadScore();
    const personalInfo = answers.personal_info;

    try {
      const response = await fetch('/api/leads/verify-otp-and-send-to-ghl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: personalInfo.phone,
          email: personalInfo.email,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          quizAnswers: answers,
          sessionId: quizSessionId || 'unknown',
          funnelType: 'business_funding',
          zipCode: answers.zip_code,
          state: null,
          stateName: null,
          licensingInfo: null,
          calculatedResults: {
            leadScore: leadScore,
            recommendedProducts: []
          },
          utmParams: utmParams
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Lead Processed and Sent to GHL Successfully:', {
          leadId: data.leadId,
          leadScore: leadScore,
          sessionId: quizSessionId || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Subscribe to Publishare newsletter
        try {
          await fetch(
            'https://vpysqshhafthuxvokwqj.supabase.co/functions/v1/subscribe',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: personalInfo.email,
                site_id: 'smallbizsimple',
                first_name: personalInfo.firstName ?? null,
                last_name: personalInfo.lastName ?? null,
                zip_code: answers.zip_code ?? null,
                source: 'quiz',
                source_detail: 'business-funding-quiz',
                quiz_context: answers,
                tags: ['quiz_completed'],
              }),
            }
          );
        } catch (_) {
          // silent fail — never block the user flow
        }

        // Track quiz completion
        const completionTime = Math.round((Date.now() - quizStartTime) / 1000);
        trackQuizComplete('business_funding', quizSessionId || 'unknown', 'business_funding', completionTime);

        // Redirect to thank you page
        setTimeout(() => {
          router.push('/quiz/business-funding/thank-you');
        }, 2000);
      } else {
        console.error('❌ Lead Processing Failed:', data);
        setShowProcessing(false);
        alert('There was an error processing your request. Please try again.');
      }
    } catch (error: any) {
      console.error('💥 Lead Processing Exception:', error);
      setShowProcessing(false);
      alert('There was an error processing your request. Please try again.');
    }
  };

  if (showProcessing) {
    return (
      <ProcessingState 
        message="We're processing your information and matching you with lenders..." 
        isComplete={false}
      />
    );
  }

  if (showOTP) {
    return (
      <OTPVerification
        phoneNumber={answers.personal_info?.phone || ''}
        onVerificationComplete={handleOTPVerification}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-gray-50">
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8">
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </div>
    </div>
  );
};



