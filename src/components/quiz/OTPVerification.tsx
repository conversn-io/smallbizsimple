"use client";

import { useState } from 'react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const OTPVerification = ({ phoneNumber, onVerificationComplete, onBack }: OTPVerificationProps) => {
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        onVerificationComplete();
      } else {
        setError(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('Unable to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setError('');
        alert('Verification code sent!');
      } else {
        setError(data.error || 'Unable to resend code. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Unable to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Phone Number</h2>
          <p className="text-gray-600">
            We sent a verification code to
          </p>
          <p className="text-lg font-semibold text-[#2B4D79] mt-1">
            {phoneNumber}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtpCode(value);
                setError('');
              }}
              placeholder="000000"
              className="quiz-input w-full px-6 py-4 text-2xl text-center tracking-widest border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#2B4D79]/20 focus:border-[#2B4D79] transition-all"
              required
              disabled={isVerifying}
              style={{ minHeight: '64px', letterSpacing: '0.5em' }}
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="quiz-button w-full bg-[#2B4D79] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#1A1F36] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={!otpCode || otpCode.length !== 6 || isVerifying}
            style={{ minHeight: '64px' }}
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-[#2B4D79] hover:text-[#1A1F36] font-semibold disabled:opacity-50"
            >
              {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
            </button>
            <div>
              <button
                type="button"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

