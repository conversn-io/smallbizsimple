'use client';

import React from 'react';
import { ValuationResult } from '../../lib/valuation-calculator';
import { Check, X, Minus } from 'lucide-react';
import Link from 'next/link';

interface ValuationResultsProps {
  result: ValuationResult;
}

export function ValuationResults({ result }: ValuationResultsProps) {
  const formatCurrency = (val: number) => '$' + val.toLocaleString('en-US');

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-[#1A1F36] rounded-2xl p-8 mb-8 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 space-y-4">
           <div className="text-sm font-semibold tracking-widest text-[#FF8C42] uppercase">Your Estimated Business Value</div>
           <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
             {formatCurrency(result.valuationLow)} – {formatCurrency(result.valuationHigh)}
           </div>
           <div className="text-gray-300 text-sm max-w-lg mx-auto">
             Based on {result.industryLabel} businesses that recently sold at similar scale.
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
         <h2 className="text-xl font-bold text-gray-900 mb-4">How We Calculated This</h2>
         <div className="space-y-4 mb-6 text-gray-700">
           <div className="flex justify-between border-b pb-2">
             <span>Method:</span>
             <span className="font-semibold">SDE × Industry Multiple</span>
           </div>
           <div className="flex justify-between border-b pb-2">
             <span>Your Estimated SDE:</span>
             <span className="font-semibold">{formatCurrency(result.sdeEstimate)}</span>
           </div>
           <div className="flex justify-between pb-2">
             <span>Industry Multiple Range:</span>
             <span className="font-semibold">{result.adjustedLowMultiple.toFixed(2)}x – {result.adjustedHighMultiple.toFixed(2)}x</span>
           </div>
         </div>
         
         <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-gray-800">Adjustments Applied:</h3>
            {result.adjustments.map((adj, idx) => (
               <div key={idx} className="flex items-start space-x-3 text-sm">
                 <div className="mt-0.5 flex-shrink-0">
                    {adj.direction === 'positive' && <Check className="text-green-500" size={16} />}
                    {adj.direction === 'negative' && <X className="text-red-500" size={16} />}
                    {adj.direction === 'neutral' && <Minus className="text-gray-400" size={16} />}
                 </div>
                 <div className="text-gray-700">
                   {adj.factor} <span className={adj.direction === 'positive' ? 'text-green-600' : adj.direction === 'negative' ? 'text-red-600' : 'text-gray-500 font-medium'}>
                     ({adj.value > 0 ? '+' : ''}{(adj.value * 100).toFixed(0)}%)
                   </span>
                 </div>
               </div>
            ))}
         </div>
      </div>

      {result.improvements.length > 0 && (
         <div className="bg-[#FFF7ED] rounded-2xl p-6 border border-orange-100 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Could Increase Your Value</h2>
            <div className="space-y-4">
              {result.improvements.map((imp, idx) => (
                <div key={idx} className="flex space-x-3 text-sm text-gray-800">
                  <div className="text-[#FF8C42] mt-0.5">•</div>
                  <div>{imp.suggestion}</div>
                </div>
              ))}
            </div>
         </div>
      )}

      {result.edgeCase === 'very_small' && (
         <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6">
           Businesses with an SDE under $100K are often harder to sell traditionally and may rely heavily on seller financing or direct buyer networks.
         </div>
      )}
      {result.edgeCase === 'large' && (
         <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6">
           At your scale, Private Equity and strategic buyers may show interest, potentially valuing your business on EBITDA rather than SDE.
         </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center mb-6">
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Want a Professional Valuation?</h2>
         <p className="text-gray-600 mb-6">This estimate uses industry averages. A business broker can value your specific business using comparable sales in your true market.</p>
         
         <button className="w-full bg-[#FF8C42] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-md">
            Get a Free Professional Valuation
         </button>
         <div className="text-xs text-gray-400 mt-3">No cost. No obligation.</div>
      </div>

      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 mb-10">
         <button className="flex-1 border-2 border-[#2B4D79] text-[#2B4D79] font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Email My Results
         </button>
         <Link href="/sell/exit-planning" className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
            Read: How to Prepare
         </Link>
      </div>

      <div className="text-xs text-gray-400 leading-relaxed text-center px-4">
         This estimate is for informational purposes only and does not constitute a professional business appraisal. Actual business values vary based on financial documentation, lease terms, market conditions, and buyer demand. Consult a qualified business broker or M&A advisor for a valuation specific to your business.
      </div>
    </div>
  );
}
