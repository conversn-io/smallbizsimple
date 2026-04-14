'use client'

import { useState } from 'react';
import { formatPhoneForInput, formatPhoneForGHL, extractUSPhoneNumber } from '@/utils/phone-utils';

interface QuizQuestionProps {
  question: {
    id: string;
    title: string;
    subtitle?: string;
    type: 'text' | 'dropdown' | 'personal-info';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
  };
  onAnswer: (answer: any) => void;
  currentAnswer?: any;
  isLoading?: boolean;
}

export const QuizQuestion = ({ question, onAnswer, currentAnswer, isLoading }: QuizQuestionProps) => {
  const [textValue, setTextValue] = useState<string>(currentAnswer || '');
  const [selectedValue, setSelectedValue] = useState<string>(currentAnswer || '');
  
  // Personal info fields
  const [firstName, setFirstName] = useState(currentAnswer?.firstName || '');
  const [lastName, setLastName] = useState(currentAnswer?.lastName || '');
  const [email, setEmail] = useState(currentAnswer?.email || '');
  const [phone, setPhone] = useState(currentAnswer?.phone || '');
  const [consentChecked, setConsentChecked] = useState(currentAnswer?.consent || false);
  const [phoneError, setPhoneError] = useState('');

  const handleTextChange = (value: string) => {
    setTextValue(value);
    // Auto-submit for text inputs (like business name, zip)
    if (question.id === 'business_name' || question.id === 'zip_code') {
      onAnswer(value);
    }
  };

  const handleDropdownChange = (value: string) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && email && phone && consentChecked) {
      // Extract 10 digits from phone input
      const digits = extractUSPhoneNumber(phone);
      
      // Validate we have 10 digits
      if (digits.length !== 10) {
        setPhoneError('Please enter a valid 10-digit US phone number.');
        return;
      }
      
      // Format phone with +1 for storage/submission
      const formattedPhoneNumber = formatPhoneForGHL(digits);
      
      onAnswer({
        firstName,
        lastName,
        email,
        phone: formattedPhoneNumber,
        consent: consentChecked
      });
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <input
              type={question.id === 'email' ? 'email' : question.id === 'phone' ? 'tel' : 'text'}
              value={textValue}
              onChange={(e) => {
                const value = e.target.value;
                let processedValue = value;
                if (question.id === 'phone') {
                  // Format phone input
                  const digits = value.replace(/\D/g, '').slice(0, 10);
                  setTextValue(formatPhoneForInput(digits));
                  processedValue = digits;
                } else if (question.id === 'zip_code') {
                  // Only allow digits, max 5
                  const digits = value.replace(/\D/g, '').slice(0, 5);
                  setTextValue(digits);
                  processedValue = digits;
                } else {
                  setTextValue(value);
                }
                handleTextChange(processedValue);
              }}
              placeholder={question.placeholder}
              className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
              required={question.required}
              disabled={isLoading}
              style={{ minHeight: '56px' }}
            />
            {question.helpText && (
              <p className="text-sm text-gray-600">{question.helpText}</p>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-4">
            <select
              value={selectedValue}
              onChange={(e) => handleDropdownChange(e.target.value)}
              className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all bg-white"
              required={question.required}
              disabled={isLoading}
              style={{ minHeight: '56px' }}
            >
              {question.options?.map((option, index) => (
                <option key={index} value={option.value} disabled={option.value === ''}>
                  {option.label}
                </option>
              ))}
            </select>
            {question.helpText && (
              <p className="text-sm text-gray-600">{question.helpText}</p>
            )}
          </div>
        );

      case 'personal-info':
        return (
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
              {question.helpText && (
                <p className="text-sm text-gray-600 mt-2">{question.helpText}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <span className="text-gray-500 text-lg font-medium">+1</span>
                </div>
                <input
                  type="tel"
                  value={formatPhoneForInput(phone)}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const digits = inputValue.replace(/\D/g, '').slice(0, 10);
                    setPhone(digits);
                  }}
                  className="quiz-input w-full pr-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
                  placeholder="(555) 123-4567"
                  required
                  disabled={isLoading}
                  autoComplete="tel-national"
                  style={{ 
                    minHeight: '56px',
                    paddingLeft: '100px'
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send a verification code to this number
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-2 w-6 h-6 text-[#2B4D79] border-2 border-gray-300 rounded focus:ring-4 focus:ring-[#2B4D79]/20"
                disabled={isLoading}
              />
              <label htmlFor="consent" className="text-lg text-gray-600 leading-relaxed">
                I consent to receive SMS messages and phone calls from SmallBizSimple and its partners regarding my business funding inquiry. Message and data rates may apply. Reply STOP to opt out.
              </label>
            </div>

            {phoneError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{phoneError}</p>
              </div>
            )}

            <button
              type="submit"
              className="quiz-button w-full bg-[#2B4D79] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#1A1F36] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={!firstName || !lastName || !email || !phone || !consentChecked || isLoading}
              style={{ minHeight: '64px' }}
            >
              Continue
            </button>
          </form>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="space-y-8 pt-6">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{question.title}</h2>
        {question.subtitle && (
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">{question.subtitle}</p>
        )}
      </div>
      
      {renderQuestion()}
    </div>
  );
};



