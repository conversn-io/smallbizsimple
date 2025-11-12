'use client';

export default function NewsletterSignup() {
  return (
    <div className="bg-[#F5F7FA] rounded-lg p-8 my-12">
      <h3 className="text-2xl font-bold text-[#1A1F36] mb-4">
        Get Small Business Tips Delivered to Your Inbox
      </h3>
      <p className="text-gray-600 mb-6">
        Join thousands of small business owners getting actionable insights on funding, tax credits, and growth strategies.
      </p>
      <form className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]"
        />
        <button
          type="submit"
          className="bg-[#FF8C42] text-white px-6 py-3 rounded-md hover:bg-[#E67A3A] font-semibold"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

