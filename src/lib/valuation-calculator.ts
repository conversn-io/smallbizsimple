import { INDUSTRIES, REVENUE_RANGES, SDE_RANGES } from '../data/industry-multiples';

export interface ValuationInput {
  industryCode: string;
  revenueRange: string;
  sdeRange: string;
  yearsInBusiness: string;
  revenueTrend: string;
  ownerDependency: string;
  customerConcentration: string;
}

export interface ValuationAdjustment {
  factor: string;
  value: number;
  direction: 'positive' | 'negative' | 'neutral';
  suggestion?: string;
}

export interface ValuationResult {
  valuationLow: number;
  valuationHigh: number;
  sdeEstimate: number;
  sdeSource: 'direct' | 'estimated';
  baseLowMultiple: number;
  baseHighMultiple: number;
  adjustedLowMultiple: number;
  adjustedHighMultiple: number;
  totalAdjustment: number;
  adjustments: ValuationAdjustment[];
  improvements: ValuationAdjustment[];
  industryLabel: string;
  edgeCase: 'normal' | 'very_small' | 'large' | 'franchise';
}

const YEARS_ADJUSTMENTS: Record<string, { factor: string, value: number }> = {
  'less_than_2': { factor: 'Less than 2 years in business', value: -0.15 },
  '2_to_5': { factor: '2-5 years in business', value: -0.05 },
  '5_to_10': { factor: '5-10 years in business', value: 0.00 },
  '10_to_20': { factor: '10-20 years in business', value: 0.05 },
  '20_plus': { factor: '20+ years in business', value: 0.10 }
};

const TREND_ADJUSTMENTS: Record<string, { factor: string, value: number }> = {
  'growing': { factor: 'Growing revenue trend', value: 0.15 },
  'stable': { factor: 'Stable revenue trend', value: 0.00 },
  'declining': { factor: 'Declining revenue trend', value: -0.20 },
  'too_new': { factor: 'Business too new', value: -0.05 }
};

const DEPENDENCY_ADJUSTMENTS: Record<string, { factor: string, value: number, suggestion?: string }> = {
  'runs_fine': { factor: 'Low owner dependency', value: 0.10 },
  'slows_down': { factor: 'Moderate owner dependency', value: 0.00 },
  'struggles': { 
    factor: 'High owner dependency', 
    value: -0.15, 
    suggestion: "Reducing owner dependency could add ${lowDelta}–${highDelta} to your sale price. Start by documenting your key processes and cross-training your team." 
  },
  'would_stop': { 
    factor: 'Critical owner dependency', 
    value: -0.25, 
    suggestion: "Your business is heavily owner-dependent — this is the single biggest factor reducing your valuation. Building a management layer and documented SOPs could increase your sale price by 25% or more." 
  }
};

const CONCENTRATION_ADJUSTMENTS: Record<string, { factor: string, value: number, suggestion?: string }> = {
  'diversified': { factor: 'Diversified customer base', value: 0.00 },
  'concentrated': { 
    factor: 'High customer concentration', 
    value: -0.15, 
    suggestion: "Diversifying your customer base reduces buyer risk. Aim to have no single customer above 15% of revenue before listing." 
  }
};

export function calculateValuation(input: ValuationInput): ValuationResult {
  const industry = INDUSTRIES.find(i => i.code === input.industryCode) || INDUSTRIES.find(i => i.code === 'other')!;
  
  const revenueObj = REVENUE_RANGES.find(r => r.value === input.revenueRange);
  const revenueMidpoint = revenueObj ? revenueObj.midpoint : 0;
  
  const sdeObj = SDE_RANGES.find(r => r.value === input.sdeRange);
  
  let sdeEstimate = 0;
  let sdeSource: 'direct' | 'estimated' = 'estimated';
  
  if (sdeObj && sdeObj.value !== 'not_sure') {
    sdeEstimate = sdeObj.midpoint;
    sdeSource = 'direct';
  } else {
    sdeEstimate = revenueMidpoint * industry.sdeMarginPct;
    sdeSource = 'estimated';
  }
  
  const baseLowMultiple = industry.lowMultiple;
  const baseHighMultiple = industry.highMultiple;
  
  const adjustments: ValuationAdjustment[] = [];
  
  const addAdjustment = (factor: string, value: number, suggestion?: string) => {
    let direction: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (value > 0) direction = 'positive';
    else if (value < 0) direction = 'negative';
    
    adjustments.push({ factor, value, direction, suggestion });
  };

  const yearsAdj = YEARS_ADJUSTMENTS[input.yearsInBusiness];
  if (yearsAdj) addAdjustment(yearsAdj.factor, yearsAdj.value);
  
  const trendAdj = TREND_ADJUSTMENTS[input.revenueTrend];
  if (trendAdj) addAdjustment(trendAdj.factor, trendAdj.value);
  
  const depAdj = DEPENDENCY_ADJUSTMENTS[input.ownerDependency];
  if (depAdj) addAdjustment(depAdj.factor, depAdj.value, depAdj.suggestion);
  
  const concAdj = CONCENTRATION_ADJUSTMENTS[input.customerConcentration];
  if (concAdj) addAdjustment(concAdj.factor, concAdj.value, concAdj.suggestion);
  
  let sdeSizeAdjustment = 0;
  let sdeSizeFactor = 'SDE Scale Adjustment';
  if (sdeEstimate < 75000) { sdeSizeAdjustment = -0.10; sdeSizeFactor = 'SDE Under $75K'; }
  else if (sdeEstimate < 150000) { sdeSizeAdjustment = 0.00; sdeSizeFactor = 'SDE $75K–$150K'; }
  else if (sdeEstimate < 300000) { sdeSizeAdjustment = 0.05; sdeSizeFactor = 'SDE $150K–$300K'; }
  else if (sdeEstimate < 500000) { sdeSizeAdjustment = 0.10; sdeSizeFactor = 'SDE $300K–$500K'; }
  else if (sdeEstimate < 1000000) { sdeSizeAdjustment = 0.15; sdeSizeFactor = 'SDE $500K–$1M'; }
  else { sdeSizeAdjustment = 0.20; sdeSizeFactor = 'SDE Over $1M'; }
  
  addAdjustment(sdeSizeFactor, sdeSizeAdjustment);

  let totalAdjustment = adjustments.reduce((sum, a) => sum + a.value, 0);
  totalAdjustment = Math.max(-0.50, Math.min(totalAdjustment, 0.35));
  
  const adjustedLowMultiple = baseLowMultiple * (1 + totalAdjustment);
  const adjustedHighMultiple = baseHighMultiple * (1 + totalAdjustment);
  
  let rawValuationLow = sdeEstimate * adjustedLowMultiple;
  let rawValuationHigh = sdeEstimate * adjustedHighMultiple;
  
  // Apply listing-to-close discount: low × 0.85, high × 0.95
  rawValuationLow = rawValuationLow * 0.85;
  rawValuationHigh = rawValuationHigh * 0.95;
  
  const round5k = (val: number) => Math.round(val / 5000) * 5000;
  const valuationLow = Math.max(25000, round5k(rawValuationLow));
  const valuationHigh = Math.max(25000, Math.max(valuationLow, round5k(rawValuationHigh)));
  
  let edgeCase: 'normal' | 'very_small' | 'large' | 'franchise' = 'normal';
  if (sdeEstimate < 50000) edgeCase = 'very_small';
  else if (sdeEstimate > 1000000) edgeCase = 'large';
  else if (input.industryCode === 'franchise') edgeCase = 'franchise';
  
  const formatCurrency = (val: number) => '$' + val.toLocaleString('en-US');
  
  const improvements = adjustments
    .filter(a => a.direction === 'negative' && a.suggestion)
    .sort((a, b) => a.value - b.value)
    .slice(0, 2)
    .map(a => {
      // Calculate dollar improvement for each: sde × 0.15 × adjustedLowMultiple... 
      // Using exactly what's specified, substituting with dynamic values based on the penalty value.
      const improvementPrc = Math.abs(a.value);
      const lowDelta = Math.max(5000, round5k(sdeEstimate * improvementPrc * baseLowMultiple * 0.85));
      const highDelta = Math.max(5000, round5k(sdeEstimate * improvementPrc * baseHighMultiple * 0.95));
      
      return {
        ...a,
        suggestion: a.suggestion!
          .replace('${lowDelta}', formatCurrency(lowDelta))
          .replace('${highDelta}', formatCurrency(highDelta))
      };
    });

  return {
    valuationLow,
    valuationHigh,
    sdeEstimate,
    sdeSource,
    baseLowMultiple,
    baseHighMultiple,
    adjustedLowMultiple,
    adjustedHighMultiple,
    totalAdjustment,
    adjustments,
    improvements,
    industryLabel: industry.label,
    edgeCase
  };
}
