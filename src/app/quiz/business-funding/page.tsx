import type { Metadata } from 'next';
import { BusinessFundingQuiz } from '@/components/quiz/BusinessFundingQuiz';

export const metadata: Metadata = {
  title: 'Business Funding Quiz - SmallBizSimple',
  description: 'Get matched with the right business funding options. Answer a few quick questions to see how much your business is eligible for.',
  openGraph: {
    title: 'Business Funding Quiz - SmallBizSimple',
    description: 'Get matched with the right business funding options. Answer a few quick questions to see how much your business is eligible for.',
    url: 'https://smallbizsimple.org/quiz/business-funding',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BusinessFundingQuizPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessFundingQuiz />
    </div>
  );
}



