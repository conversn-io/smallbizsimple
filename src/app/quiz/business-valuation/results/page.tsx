'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ValuationResults } from '@/components/quiz/ValuationResults';
import { ValuationResult } from '@/lib/valuation-calculator';

export default function ValuationResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [personalInfo, setPersonalInfo] = useState<Record<string, string> | undefined>();

  useEffect(() => {
    const stored = sessionStorage.getItem('valuation_result');
    const storedPersonal = sessionStorage.getItem('valuation_personal_info');

    if (!stored) {
      router.replace('/quiz/business-valuation');
      return;
    }

    try {
      setResult(JSON.parse(stored));
      if (storedPersonal) setPersonalInfo(JSON.parse(storedPersonal));
    } catch {
      router.replace('/quiz/business-valuation');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <ValuationResults result={result} personalInfo={personalInfo} />
    </div>
  );
}
