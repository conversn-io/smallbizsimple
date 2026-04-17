import { Metadata } from 'next';
import { ExitReadinessLanding } from '@/components/landing/ExitReadinessLanding';

export const metadata: Metadata = {
  title: 'Exit Readiness Score™ | Business Valuation & Exit Quiz',
  description:
    'Find out what your business may be worth, how exit-ready it is, and what factors could increase your sale price. Take the 3-minute Exit Readiness Score™ quiz.',
  openGraph: {
    title: 'Exit Readiness Score™ | What Is Your Business Worth to a Buyer?',
    description:
      'Free business valuation estimate based on real industry data. Takes 3 minutes.',
    url: 'https://smallbizsimple.org/quiz/business-valuation',
  },
  robots: { index: true, follow: true },
};

export default function BusinessValuationPage() {
  return <ExitReadinessLanding />;
}
