import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You - SmallBizSimple',
  description: 'Thank you for your interest in business funding. We\'ll be in touch soon.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600">
            We've received your information and are matching you with the best lenders.
          </p>
        </div>

        <div className="space-y-4 mb-8 text-left">
          <div className="bg-blue-50 border-l-4 border-[#2B4D79] p-4 rounded">
            <h2 className="font-semibold text-[#2B4D79] mb-2">What Happens Next?</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>We'll review your application and match you with lenders who fit your needs</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>A lender will contact you within 24 hours to discuss your options</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>You'll receive loan offers tailored to your business profile</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              <strong>Need help sooner?</strong> Call us at <a href="tel:+1-800-XXX-XXXX" className="text-[#2B4D79] hover:underline">1-800-XXX-XXXX</a> or email us at <a href="mailto:support@smallbizsimple.org" className="text-[#2B4D79] hover:underline">support@smallbizsimple.org</a>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#2B4D79] text-white rounded-xl font-semibold hover:bg-[#1A1F36] transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/quiz/business-funding"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Start Over
          </Link>
        </div>
      </div>
    </div>
  );
}



