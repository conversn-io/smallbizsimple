'use client';

import { useHeader } from '../../contexts/FooterContext';

export default function ConditionalHeader() {
  const { headerType } = useHeader();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-[#1A1F36]">
              SmallBizSimple
            </a>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/guides" className="text-gray-700 hover:text-[#FF8C42]">Guides</a>
            <a href="/calculators" className="text-gray-700 hover:text-[#FF8C42]">Calculators</a>
            <a href="/articles" className="text-gray-700 hover:text-[#FF8C42]">Articles</a>
            <a href="/quiz" className="bg-[#FF8C42] text-white px-4 py-2 rounded-md hover:bg-[#E67A3A]">
              Get Started
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

