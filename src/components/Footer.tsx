'use client';

export default function Footer() {
  return (
    <footer className="bg-[#1A1F36] text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">SmallBizSimple</h3>
            <p className="text-gray-300 mb-4">
              Simple tools. Real growth.
            </p>
            <p className="text-sm text-gray-400">
              Empowering small business owners with direct, easy-to-use tools for funding, tax credits, marketing, and lead generation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/guides" className="hover:text-[#FF8C42]">Guides</a></li>
              <li><a href="/calculators" className="hover:text-[#FF8C42]">Calculators</a></li>
              <li><a href="/articles" className="hover:text-[#FF8C42]">Articles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/privacy-policy" className="hover:text-[#FF8C42]">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-[#FF8C42]">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-[#FF8C42]">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SmallBizSimple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

