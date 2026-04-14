'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RangeOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface RangeSelectorProps {
  options: RangeOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export function RangeSelector({ options, selectedValue, onSelect }: RangeSelectorProps) {
  return (
    <div className="w-full flex flex-col space-y-3">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex flex-row items-center justify-between min-h-[56px] w-full px-5 py-3 rounded-xl border text-left transition-all duration-200",
              isSelected 
                ? "border-[#2B4D79] border-2 bg-[#EBF4FF]" 
                : "border-[#E5E7EB] bg-white hover:bg-[#F5F7FA] hover:border-gray-300"
            )}
          >
            <div className="flex flex-col pr-4">
              <span className={cn("text-base font-medium", isSelected ? "text-[#2B4D79]" : "text-gray-800")}>
                {option.label}
              </span>
              {option.subtitle && (
                <span className={cn("text-sm mt-0.5", isSelected ? "text-[#3b6090]" : "text-gray-500")}>
                  {option.subtitle}
                </span>
              )}
            </div>
            
            <div className="shrink-0 group flex items-center justify-center">
              {isSelected ? (
                <div className="flex items-center justify-center bg-[#2B4D79] rounded-full shadow-sm h-6 w-6">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-gray-200" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
