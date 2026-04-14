export interface IndustryData {
  code: string;
  label: string;
  category: string;
  icon: string;
  lowMultiple: number;
  highMultiple: number;
  sdeMarginPct: number;
}

export const INDUSTRIES: IndustryData[] = [
  // Services
  { code: 'hvac', label: 'HVAC / Heating & Cooling', category: 'Services', icon: 'Thermometer', lowMultiple: 2.5, highMultiple: 3.5, sdeMarginPct: 0.27 },
  { code: 'plumbing', label: 'Plumbing', category: 'Services', icon: 'Wrench', lowMultiple: 2.0, highMultiple: 3.0, sdeMarginPct: 0.30 },
  { code: 'electrical', label: 'Electrical', category: 'Services', icon: 'Zap', lowMultiple: 2.2, highMultiple: 3.2, sdeMarginPct: 0.28 },
  { code: 'landscaping', label: 'Landscaping / Lawn Care', category: 'Services', icon: 'Trees', lowMultiple: 2.5, highMultiple: 4.0, sdeMarginPct: 0.22 },
  { code: 'cleaning', label: 'Cleaning Services', category: 'Services', icon: 'Sparkles', lowMultiple: 1.5, highMultiple: 2.5, sdeMarginPct: 0.25 },
  { code: 'auto_repair', label: 'Auto Repair / Automotive', category: 'Services', icon: 'Car', lowMultiple: 2.2, highMultiple: 3.8, sdeMarginPct: 0.23 },
  { code: 'contracting', label: 'General Contracting', category: 'Services', icon: 'HardHat', lowMultiple: 2.0, highMultiple: 3.2, sdeMarginPct: 0.12 },

  // Professional
  { code: 'accounting', label: 'Accounting / Tax Services', category: 'Professional', icon: 'Calculator', lowMultiple: 2.5, highMultiple: 4.2, sdeMarginPct: 0.35 },
  { code: 'marketing_agency', label: 'Marketing / Advertising Agency', category: 'Professional', icon: 'Megaphone', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.20 },
  { code: 'it_services', label: 'IT Services / Managed IT', category: 'Professional', icon: 'Monitor', lowMultiple: 3.0, highMultiple: 5.0, sdeMarginPct: 0.38 },
  { code: 'consulting', label: 'Consulting', category: 'Professional', icon: 'Briefcase', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.35 },
  { code: 'medical_dental', label: 'Medical / Dental Practice', category: 'Professional', icon: 'Stethoscope', lowMultiple: 1.5, highMultiple: 2.5, sdeMarginPct: 0.38 },
  { code: 'veterinary', label: 'Veterinary', category: 'Professional', icon: 'Heart', lowMultiple: 2.2, highMultiple: 3.0, sdeMarginPct: 0.32 },

  // Food & Hospitality
  { code: 'restaurant_full', label: 'Restaurant (Full-Service)', category: 'Food & Hospitality', icon: 'UtensilsCrossed', lowMultiple: 1.5, highMultiple: 2.5, sdeMarginPct: 0.13 },
  { code: 'restaurant_qsr', label: 'Restaurant (Quick-Service)', category: 'Food & Hospitality', icon: 'Sandwich', lowMultiple: 1.8, highMultiple: 2.8, sdeMarginPct: 0.15 },
  { code: 'coffee_shop', label: 'Coffee Shop / Cafe', category: 'Food & Hospitality', icon: 'Coffee', lowMultiple: 2.0, highMultiple: 2.5, sdeMarginPct: 0.18 },
  { code: 'bar_brewery', label: 'Bar / Brewery', category: 'Food & Hospitality', icon: 'Beer', lowMultiple: 2.0, highMultiple: 3.0, sdeMarginPct: 0.18 },

  // Retail & E-Commerce
  { code: 'retail', label: 'Retail Store (Brick & Mortar)', category: 'Retail & E-Commerce', icon: 'Store', lowMultiple: 1.5, highMultiple: 2.5, sdeMarginPct: 0.17 },
  { code: 'ecommerce', label: 'E-Commerce / Online Store', category: 'Retail & E-Commerce', icon: 'ShoppingCart', lowMultiple: 2.5, highMultiple: 4.0, sdeMarginPct: 0.25 },

  // Specialty
  { code: 'laundromat', label: 'Laundromat / Dry Cleaning', category: 'Specialty', icon: 'Shirt', lowMultiple: 3.5, highMultiple: 4.2, sdeMarginPct: 0.34 },
  { code: 'car_wash', label: 'Car Wash', category: 'Specialty', icon: 'Droplets', lowMultiple: 4.0, highMultiple: 5.0, sdeMarginPct: 0.32 },
  { code: 'pet_services', label: 'Pet Services', category: 'Specialty', icon: 'Dog', lowMultiple: 3.5, highMultiple: 4.2, sdeMarginPct: 0.32 },
  { code: 'salon_spa', label: 'Salon / Spa / Beauty', category: 'Specialty', icon: 'Scissors', lowMultiple: 2.0, highMultiple: 3.0, sdeMarginPct: 0.25 },
  { code: 'fitness', label: 'Fitness / Gym', category: 'Specialty', icon: 'Dumbbell', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.22 },

  // Other
  { code: 'manufacturing', label: 'Manufacturing', category: 'Other', icon: 'Factory', lowMultiple: 2.5, highMultiple: 4.0, sdeMarginPct: 0.20 },
  { code: 'distribution', label: 'Distribution / Wholesale', category: 'Other', icon: 'Truck', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.15 },
  { code: 'saas', label: 'SaaS / Software', category: 'Other', icon: 'Cloud', lowMultiple: 3.0, highMultiple: 5.0, sdeMarginPct: 0.48 },
  { code: 'franchise', label: 'Franchise', category: 'Other', icon: 'Building2', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.22 },
  { code: 'other', label: 'Other', category: 'Other', icon: 'Building', lowMultiple: 2.0, highMultiple: 3.5, sdeMarginPct: 0.22 },
];

export const REVENUE_RANGES = [
  { value: 'under_250k', label: 'Under $250K', midpoint: 175000 },
  { value: '250k_500k', label: '$250K – $500K', midpoint: 375000 },
  { value: '500k_1m', label: '$500K – $1M', midpoint: 750000 },
  { value: '1m_2m', label: '$1M – $2M', midpoint: 1500000 },
  { value: '2m_5m', label: '$2M – $5M', midpoint: 3500000 },
  { value: '5m_plus', label: '$5M+', midpoint: 6000000 },
];

export const SDE_RANGES = [
  { value: 'under_75k', label: 'Under $75K', midpoint: 50000 },
  { value: '75k_150k', label: '$75K – $150K', midpoint: 112500 },
  { value: '150k_300k', label: '$150K – $300K', midpoint: 225000 },
  { value: '300k_500k', label: '$300K – $500K', midpoint: 400000 },
  { value: '500k_1m', label: '$500K – $1M', midpoint: 750000 },
  { value: '1m_plus', label: '$1M+', midpoint: 1250000 },
  { value: 'not_sure', label: "I'm not sure", midpoint: 0 },
];
