'use client';

import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { IndustryData } from '../../data/industry-multiples';
import { Search } from 'lucide-react';

interface IndustrySelectorProps {
  industries: IndustryData[];
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

export function IndustrySelector({ industries, selectedCode, onSelect }: IndustrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const groupedIndustries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = industries.filter(ind => ind.label.toLowerCase().includes(query));
    
    const groups: Record<string, IndustryData[]> = {};
    filtered.forEach(ind => {
      if (!groups[ind.category]) {
        groups[ind.category] = [];
      }
      groups[ind.category].push(ind);
    });
    return groups;
  }, [industries, searchQuery]);

  const renderIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    if (!Icon) return <LucideIcons.Building size={24} />;
    return <Icon size={24} />;
  };

  const categories = ["Services", "Professional", "Food & Hospitality", "Retail & E-Commerce", "Specialty", "Other"];

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

      <div className="space-y-8 pb-8">
        {categories.map(category => {
          const categoryIndustries = groupedIndustries[category];
          if (!categoryIndustries || categoryIndustries.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
        })}
        {Object.keys(groupedIndustries).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No industries matched your search.
          </div>
        )}
      </div>
    </div>
  );
}
