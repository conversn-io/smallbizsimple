import { Metadata } from 'next';
import { ValuationQuiz } from '@/components/quiz/ValuationQuiz';

export const metadata: Metadata = {
  title: "What's Your Business Worth? Free Valuation Estimate - SmallBizSimple",
  description: 'Get a free estimate of your business value in 2 minutes. Based on real industry sales data from 9,500+ transactions.',
  openGraph: {
    title: "What's Your Business Worth? - SmallBizSimple",
    description: 'Free business valuation estimate based on real industry data. Takes 2 minutes.',
    url: 'https://smallbizsimple.org/quiz/business-valuation',
  },
  robots: { index: true, follow: true },
};

export default function BusinessValuationPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <ValuationQuiz />
    </div>
  );
}
