'use client';

import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { IndustryData } from '../../data/industry-multiples';
import { Search, ChevronLeft } from 'lucide-react';

interface IndustrySelectorProps {
  industries: IndustryData[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Services': 'Wrench',
  'Professional': 'Briefcase',
  'Food & Hospitality': 'UtensilsCrossed',
  'Retail & E-Commerce': 'ShoppingCart',
  'Specialty': 'Sparkles',
  'Other': 'Building',
};

const CATEGORY_ORDER = ['Services', 'Professional', 'Food & Hospitality', 'Retail & E-Commerce', 'Specialty', 'Other'];

export function IndustrySelector({ industries, selectedCode, onSelect }: IndustrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedIndustries = useMemo(() => {
    const groups: Record<string, IndustryData[]> = {};
    industries.forEach(ind => {
      if (!groups[ind.category]) groups[ind.category] = [];
      groups[ind.category].push(ind);
    });
    return groups;
  }, [industries]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return industries.filter(ind => ind.label.toLowerCase().includes(query));
  }, [industries, searchQuery]);

  const renderIcon = (iconName: string, size = 24) => {
    const Icon = (LucideIcons as any)[iconName];
    if (!Icon) return <LucideIcons.Building size={size} />;
    return <Icon size={size} />;
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  // If searching, show flat filtered results
  if (searchResults && searchResults.length > 0) {
    return (
      <div className="w-full flex flex-col space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search industries..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2B4D79] focus:ring-1 focus:ring-[#2B4D79] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
          {searchResults.map(industry => {
            const isSelected = selectedCode === industry.code;
            return (
              <button
                key={industry.code}
                onClick={() => onSelect(industry.code)}
                className={`
                  flex flex-col items-center justify-center p-4 text-center rounded-xl border transition-all duration-200 min-h-[100px]
                  ${isSelected
                    ? 'border-[#2B4D79] bg-[#EBF4FF] shadow-sm transform scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-[#2B4D79] hover:shadow-sm hover:-translate-y-1'
                  }
                `}
              >
                <div className={`mb-3 ${isSelected ? 'text-[#2B4D79]' : 'text-gray-500'}`}>
                  {renderIcon(industry.icon)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-[#2B4D79]' : 'text-gray-700'}`}>
                  {industry.label}
                </span>
                <span className="text-xs text-gray-400 mt-1">{industry.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Search with no results
  if (searchResults && searchResults.length === 0) {
    return (
      <div className="w-full flex flex-col space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search industries..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2B4D79] focus:ring-1 focus:ring-[#2B4D79] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-center py-8 text-gray-500">
          No industries matched your search.
        </div>
      </div>
    );
  }

  // Step 2: Show industries within selected category
  if (selectedCategory) {
    const categoryIndustries = groupedIndustries[selectedCategory] || [];
    return (
      <div className="w-full flex flex-col space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors self-start"
        >
          <ChevronLeft size={18} />
          All categories
        </button>

        <h3 className="text-lg font-semibold text-gray-800">{selectedCategory}</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
          {categoryIndustries.map(industry => {
            const isSelected = selectedCode === industry.code;
            return (
              <button
                key={industry.code}
                onClick={() => onSelect(industry.code)}
                className={`
                  flex flex-col items-center justify-center p-4 text-center rounded-xl border transition-all duration-200 min-h-[100px]
                  ${isSelected
                    ? 'border-[#2B4D79] bg-[#EBF4FF] shadow-sm transform scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-[#2B4D79] hover:shadow-sm hover:-translate-y-1'
                  }
                `}
              >
                <div className={`mb-3 ${isSelected ? 'text-[#2B4D79]' : 'text-gray-500'}`}>
                  {renderIcon(industry.icon)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-[#2B4D79]' : 'text-gray-700'}`}>
                  {industry.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 1: Show category cards
  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search industries..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2B4D79] focus:ring-1 focus:ring-[#2B4D79] transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
        {CATEGORY_ORDER.map(category => {
          const count = groupedIndustries[category]?.length || 0;
          if (count === 0) return null;
          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-gray-200 bg-white hover:border-[#2B4D79] hover:shadow-md hover:-translate-y-1 transition-all duration-200 min-h-[130px]"
            >
              <div className="mb-3 text-[#2B4D79]">
                {renderIcon(CATEGORY_ICONS[category] || 'Building', 32)}
              </div>
              <span className="text-base font-semibold text-gray-800">{category}</span>
              <span className="text-xs text-gray-400 mt-1">{count} types</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
