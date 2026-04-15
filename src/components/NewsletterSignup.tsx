'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      await fetch(
        'https://vpysqshhafthuxvokwqj.supabase.co/functions/v1/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            site_id: 'smallbizsimple',
            source: 'form',
            source_detail: 'footer-signup',
          }),
        }
      );
      setStatus('success');
      setEmail('');
    } catch (_) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#F5F7FA] rounded-lg p-8 my-12">
      <h3 className="text-2xl font-bold text-[#1A1F36] mb-4">
        Get Small Business Tips Delivered to Your Inbox
      </h3>
      <p className="text-gray-600 mb-6">
        Join thousands of small business owners getting actionable insights on funding, tax credits, and growth strategies.
      </p>

      {status === 'success' ? (
        <p className="text-green-700 font-semibold py-3">You're subscribed! Check your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#FF8C42] text-white px-6 py-3 rounded-md hover:bg-[#E67A3A] font-semibold disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
