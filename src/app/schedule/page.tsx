'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { getStoredUTMParameters } from '@/utils/utm-utils';

const BOOKING_WIDGET_ID = process.env.NEXT_PUBLIC_BOOKING_WIDGET_ID || 'nK7kpk64nFEpXfZ56Lms';
const BOOKING_WIDGET_BASE_URL = `https://link.conversn.io/widget/booking/${BOOKING_WIDGET_ID}`;

function SchedulePageContent() {
  const searchParams = useSearchParams();
  const [calendarUrl, setCalendarUrl] = useState(BOOKING_WIDGET_BASE_URL);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const email = searchParams?.get('email') || '';
    const firstName = searchParams?.get('firstName') || '';
    const lastName = searchParams?.get('lastName') || '';
    const phone = searchParams?.get('phone') || '';

    const urlParams = new URLSearchParams();

    if (email) urlParams.append('email', email);
    if (firstName) urlParams.append('first_name', firstName);
    if (lastName) urlParams.append('last_name', lastName);
    if (phone) urlParams.append('phone', phone);

    // Add UTM parameters for attribution
    const utmParams = getStoredUTMParameters();
    if (utmParams) {
      if (utmParams.utm_source) urlParams.append('utm_source', utmParams.utm_source);
      if (utmParams.utm_medium) urlParams.append('utm_medium', utmParams.utm_medium);
      if (utmParams.utm_campaign) urlParams.append('utm_campaign', utmParams.utm_campaign);
      if (utmParams.utm_term) urlParams.append('utm_term', utmParams.utm_term);
      if (utmParams.utm_content) urlParams.append('utm_content', utmParams.utm_content);
    }

    const finalUrl = urlParams.toString()
      ? `${BOOKING_WIDGET_BASE_URL}?${urlParams.toString()}`
      : BOOKING_WIDGET_BASE_URL;

    setCalendarUrl(finalUrl);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1F36] mb-4 leading-tight">
            Schedule Your Free Valuation Call
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Speak with a business valuation specialist who can give you a detailed,
            market-specific estimate of what your business is worth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center text-gray-700 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Duration:</span> ~20 minutes
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">Cost:</span> $0
            </div>
          </div>

          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            Pick a time that works for you. No obligation, no pressure.
          </p>
        </div>

        {/* Calendar Embed */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
          {!isLoaded && (
            <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B4D79] mx-auto mb-3"></div>
                <p className="text-gray-500">Loading calendar...</p>
              </div>
            </div>
          )}
          <iframe
            src={calendarUrl}
            style={{
              width: '100%',
              height: '700px',
              border: 'none',
              display: isLoaded ? 'block' : 'none',
            }}
            scrolling="no"
            title="Schedule a Free Business Valuation Call"
            allow="autoplay; fullscreen; picture-in-picture"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        <div className="text-center text-xs text-gray-400 max-w-xl mx-auto">
          By scheduling a call you agree to be contacted by a SmallBizSimple partner.
          Your information is kept private and never sold.
        </div>
      </section>

      <Script
        src="https://link.conversn.io/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B4D79] mx-auto mb-3"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <SchedulePageContent />
    </Suspense>
  );
}
