import NewsletterSignup from '../components/NewsletterSignup';

export default function Home() {
  return (
    <>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#F5F7FA] to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[#1A1F36] mb-6">
                Simple tools. Real growth.
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Built for business owners who do it all — and need results now. 
                Get direct access to funding, tax credits, marketing tools, and lead generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/quiz"
                  className="bg-[#FF8C42] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#E67A3A] transition-colors"
                >
                  Get Started Free
                </a>
                <a
                  href="/guides"
                  className="bg-white text-[#1A1F36] px-8 py-4 rounded-md text-lg font-semibold border-2 border-[#1A1F36] hover:bg-[#F5F7FA] transition-colors"
                >
                  Explore Resources
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-[#1A1F36] mb-12">
              Everything You Need to Grow Your Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-[#F5F7FA] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1F36] mb-3">Business Funding</h3>
                <p className="text-gray-600">
                  Access funding options tailored to your business needs. No jargon, just clear paths to capital.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-[#F5F7FA] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1F36] mb-3">Tax Credits</h3>
                <p className="text-gray-600">
                  Unlock tax credits like ERC. Get $26K back in tax credits with our straightforward process.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-[#F5F7FA] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1F36] mb-3">Lead Generation</h3>
                <p className="text-gray-600">
                  Find your next 10 customers. Tools and strategies to generate quality leads for your business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#2B4D79] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of small business owners who are using SmallBizSimple to unlock funding, maximize tax credits, and generate more leads.
            </p>
            <a
              href="/quiz"
              className="inline-block bg-[#FF8C42] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#E67A3A] transition-colors"
            >
              Get Started Now
            </a>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSignup />
          </div>
        </section>
    </>
  );
}

