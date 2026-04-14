'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { OTPVerification } from './OTPVerification';
import { ProcessingState } from './ProcessingState';
import { IndustrySelector } from './IndustrySelector';
import { RangeSelector } from './RangeSelector';
import { ValuationResults } from './ValuationResults';
import { INDUSTRIES, REVENUE_RANGES, SDE_RANGES } from '../../data/industry-multiples';
import { calculateValuation, ValuationResult } from '../../lib/valuation-calculator';
import { 
  initializeTracking, 
  trackQuestionAnswer, 
  trackPageView, 
  trackQuizStart, 
  trackQuizComplete,
} from '@/lib/temp-tracking';
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, UTMParameters } from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';

const YEARS_OPTIONS = [
  { value: 'less_than_2', label: 'Less than 2 years' },
  { value: '2_to_5', label: '2-5 years' },
  { value: '5_to_10', label: '5-10 years' },
  { value: '10_to_20', label: '10-20 years' },
  { value: '20_plus', label: '20+ years' }
];

const TREND_OPTIONS = [
  { value: 'growing', label: 'Growing' },
  { value: 'stable', label: 'Stable' },
  { value: 'declining', label: 'Declining' },
  { value: 'too_new', label: 'Too new to tell' }
];

const DEPENDENCY_OPTIONS = [
  { value: 'runs_fine', label: 'It would run fine', subtitle: 'My team handles day-to-day operations' },
  { value: 'slows_down', label: 'It would slow down, but continue', subtitle: 'Most things would keep going' },
  { value: 'struggles', label: 'It would struggle significantly', subtitle: "I'm involved in most key decisions" },
  { value: 'would_stop', label: 'It would basically stop', subtitle: 'I am the business' }
];

const CONCENTRATION_OPTIONS = [
  { value: 'diversified', label: 'No — revenue is spread across many customers' },
  { value: 'concentrated', label: 'Yes — one or two customers are a big chunk' }
];

const stepsConfig = [
  { id: 'industry', title: "What type of business do you own?", subtitle: "We use industry-specific data from recent business sales to estimate your value." },
  { id: 'revenue', title: "What's your approximate annual revenue?", subtitle: "Total revenue, not profit. An estimate is fine." },
  { id: 'sde', title: "How much does the business earn you per year?", subtitle: "Include your salary, any perks the business pays for (car, phone, insurance), and the profit left over. This is your total economic benefit from owning the business." },
  { id: 'years', title: "How long has your business been operating?", subtitle: "Established businesses with longer track records typically command higher valuations." },
  { id: 'trend', title: "Over the last 2–3 years, how has your revenue trended?", subtitle: "Growth trajectory significantly impacts what buyers will pay." },
  { id: 'dependency', title: "If you took a month off, what would happen?", subtitle: "Buyers pay more for businesses that don't depend on one person." },
  { id: 'concentration', title: "Does any single customer account for more than 25% of your revenue?", subtitle: "Customer concentration is a risk factor buyers evaluate carefully." },
  { id: 'personal_info', title: "Where should we send your valuation?", subtitle: "We'll email your full report with your estimated range and comparable sales data." }
];

export const ValuationQuiz = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showOTP, setShowOTP] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());

  useEffect(() => {
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    setQuizStartTime(Date.now());
    
    initializeTracking();
    trackPageView('SmallBizSimple Business Valuation Quiz', '/quiz/business-valuation');
    trackQuizStart('business_valuation', sessionId);
    
    const extractAndTrackUTM = async () => {
      const utmTracked = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utm_tracked') : null;
      if (utmTracked === 'true') {
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) setUtmParams(storedUtm);
        return;
      }
      const utmData = extractUTMParameters();
      if (hasUTMParameters(utmData)) {
        setUtmParams(utmData);
        storeUTMParameters(utmData);
        const trackingSuccess = await trackUTMParameters(sessionId, utmData);
        if (trackingSuccess && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('utm_tracked', 'true');
        }
      } else {
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) setUtmParams(storedUtm);
      }
    };
    extractAndTrackUTM();
  }, []);

  const handleContinue = () => {
    const stepConfig = stepsConfig[currentStep];
    trackQuestionAnswer(stepConfig.id, answers[stepConfig.id], currentStep + 1, stepsConfig.length, quizSessionId || 'unknown', 'business_valuation');
    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleIndustrySelect = (code: string) => {
    setAnswers(prev => ({ ...prev, industry: code }));
    trackQuestionAnswer('industry', code, 1, stepsConfig.length, quizSessionId || 'unknown', 'business_valuation');
    setTimeout(() => {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  };

  const finishQuiz = async (personalInfo: any) => {
    setShowProcessing(true);
    try {
      const result = calculateValuation({
        industryCode: answers.industry,
        revenueRange: answers.revenue,
        sdeRange: answers.sde,
        yearsInBusiness: answers.years,
        revenueTrend: answers.trend,
        ownerDependency: answers.dependency,
        customerConcentration: answers.concentration
      });
      setValuationResult(result);
      
      const capturePayload = {
        email: personalInfo.email,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phoneNumber: personalInfo.phone,
        quizAnswers: answers,
        calculatedResults: result,
        sessionId: quizSessionId,
        utmParams: utmParams
      };

      fetch('/api/leads/capture-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capturePayload)
      }).catch(console.error);

      const completionTime = Math.round((Date.now() - quizStartTime) / 1000);
      trackQuizComplete('business_valuation', quizSessionId || 'unknown', 'business_valuation', completionTime);
      
      setShowProcessing(false);
      setShowResults(true);
    } catch (e) {
      console.error(e);
      setShowProcessing(false);
      alert("Failed to calculate. A broker will contact you to provide an estimate.");
    }
  };

  const handlePersonalInfoSubmit = async (answer: any) => {
    setAnswers(prev => ({ ...prev, personal_info: answer }));
    trackQuestionAnswer('personal_info', answer, stepsConfig.length, stepsConfig.length, quizSessionId || 'unknown', 'business_valuation');
    if (answer.phone) {
        setShowOTP(true);
    } else {
        await finishQuiz(answer);
    }
  };

  const handleOTPComplete = async () => {
    setShowOTP(false);
    await finishQuiz(answers.personal_info);
  };

  if (showProcessing) {
    return <ProcessingState message="Calculating your valuation..." isComplete={false} />;
  }

  if (showOTP) {
    return (
      <OTPVerification
        phoneNumber={answers.personal_info?.phone || ''}
        onVerificationComplete={handleOTPComplete}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  if (showResults && valuationResult) {
    return <ValuationResults result={valuationResult} />;
  }

  const stepInfo = stepsConfig[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="mb-6 flex items-center">
         {currentStep > 0 && (
            <button 
               onClick={() => setCurrentStep(prev => prev - 1)} 
               className="text-gray-500 hover:text-gray-800 font-medium whitespace-nowrap"
            >
               ← Back
            </button>
         )}
         <div className="flex-1 ml-4 overflow-hidden">
             <QuizProgress currentStep={currentStep} totalSteps={stepsConfig.length} />
         </div>
      </div>
      
      <div className="text-center mb-8 px-2">
         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{stepInfo.title}</h1>
         <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{stepInfo.subtitle}</p>
      </div>

      <div className="transition-all ease-in-out duration-300">
        {currentStep === 0 && <IndustrySelector industries={INDUSTRIES} selectedCode={answers.industry || null} onSelect={handleIndustrySelect} />}
        
        {currentStep > 0 && currentStep < 7 && (
          <div className="flex flex-col space-y-6">
             <RangeSelector 
                options={
                  currentStep === 1 ? REVENUE_RANGES :
                  currentStep === 2 ? SDE_RANGES :
                  currentStep === 3 ? YEARS_OPTIONS :
                  currentStep === 4 ? TREND_OPTIONS :
                  currentStep === 5 ? DEPENDENCY_OPTIONS :
                  currentStep === 6 ? CONCENTRATION_OPTIONS : []
                } 
                selectedValue={answers[stepInfo.id] || null} 
                onSelect={(val) => setAnswers(prev => ({ ...prev, [stepInfo.id]: val }))} 
             />
             <button 
               className="w-full py-4 text-lg bg-[#2B4D79] text-white rounded-xl font-bold disabled:opacity-50 hover:bg-[#1f3b5e] transition-colors shadow-md"
               disabled={!answers[stepInfo.id]}
               onClick={handleContinue}
             >
                Continue
             </button>
          </div>
        )}

        {currentStep === 7 && (
          <QuizQuestion
             question={{
               id: 'personal_info',
               title: '', subtitle: '', 
               type: 'personal-info',
               required: true,
             }}
             onAnswer={handlePersonalInfoSubmit}
             currentAnswer={answers.personal_info}
          />
        )}
      </div>

      {currentStep < 7 && (
         <div className="mt-8 pt-6 flex items-center justify-center text-xs text-gray-400 border-t border-gray-100">
            🔒 Your information is secure and never shared without your permission.
         </div>
      )}
    </div>
  );
};
