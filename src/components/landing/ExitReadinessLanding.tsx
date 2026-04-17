'use client';

import { useState } from 'react';
import {
  DollarSign,
  Gauge,
  TrendingUp,
  CheckCircle,
  Shield,
  Clock,
  ChevronDown,
  ArrowRight,
  Lock,
  Users,
  BarChart3,
  Target,
} from 'lucide-react';
import { ValuationQuiz } from '@/components/quiz/ValuationQuiz';

/* ─── Color tokens from spec ─── */
const C = {
  primary: '#0F172A',
  secondary: '#2563EB',
  accent: '#14B8A6',
  bg: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  lightBg: '#F8FAFC',
  border: '#E5E7EB',
};

/* ─── FAQ Accordion Item ─── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-[#111827] text-base sm:text-lg pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-5 text-gray-600 leading-relaxed">{answer}</p>}
    </div>
  );
}

/* ─── Main Landing Page ─── */
export function ExitReadinessLanding() {
  const [showQuiz, setShowQuiz] = useState(false);

  const scrollToQuiz = () => {
    setShowQuiz(true);
    setTimeout(() => {
      document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ═══ HERO — hidden when quiz is active ═══ */}
      {!showQuiz && (
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#14B8A6] uppercase mb-4">
                Confidential Business Exit Assessment
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                What Is Your Business Worth to a Buyer?
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
                Take this 3-minute assessment to estimate your potential exit value,
                understand your sellability, and see which factors may increase your price.
              </p>

              {/* Bullet list */}
              <ul className="space-y-3 mb-8">
                {['Estimated valuation range', 'Exit readiness score', 'Key value drivers', 'Action steps to improve value'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-[#14B8A6] shrink-0" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={scrollToQuiz}
                  className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/20"
                >
                  Get My Exit Score <ArrowRight size={18} />
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center gap-2 border border-gray-500 text-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:border-gray-300 hover:text-white transition-colors"
                >
                  See How It Works
                </button>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><Lock size={14} /> 100% confidential</span>
                <span className="flex items-center gap-2"><Shield size={14} /> No obligation</span>
                <span className="flex items-center gap-2"><Users size={14} /> Built for owners, not browsers</span>
              </div>
            </div>

            {/* Right: Score Preview Card */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                <p className="text-xs font-bold tracking-widest text-[#14B8A6] uppercase mb-6">Sample Results</p>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Estimated Valuation Range</p>
                    <p className="text-3xl font-bold text-white">$1.4M – $1.9M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Potential Buyer Multiple</p>
                    <p className="text-2xl font-bold text-white">3.8x – 4.7x</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Exit Readiness Score</p>
                    <div className="flex items-end gap-3">
                      <p className="text-4xl font-bold text-[#14B8A6]">74</p>
                      <p className="text-lg text-gray-400 pb-1">/ 100</p>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div className="bg-[#14B8A6] h-2 rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Highlights</p>
                    {['Strong margins', 'Moderate owner dependence', 'Recurring revenue opportunity'].map((h) => (
                      <div key={h} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-gray-600 mt-6">Illustrative only. Actual results based on your inputs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ═══ QUIZ EMBED ═══ */}
      <section id="quiz-section" className="py-12 sm:py-16 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {!showQuiz ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">
                Start Your Exit Readiness Score™
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Answer a few questions about your business to get a personalized estimate.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['Industry', 'Annual revenue', 'Profit / EBITDA', 'Owner involvement', 'Exit timeline'].map((f) => (
                  <span key={f} className="bg-[#F1F5F9] text-gray-600 px-4 py-2 rounded-full text-sm">
                    {f}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/20"
              >
                Start the Assessment <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <ValuationQuiz />
          )}
        </div>
      </section>

      {/* ═══ Below sections hidden when quiz is active ═══ */}
      {!showQuiz && (<>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Answer a Few Questions', desc: 'Tell us about your revenue, profitability, owner involvement, and timeline.', icon: BarChart3 },
              { step: '2', title: 'See Your Estimated Value', desc: 'Get a projected valuation range based on common buyer logic and business quality factors.', icon: DollarSign },
              { step: '3', title: 'Discover What Drives Price', desc: 'See what may increase or decrease your value in the eyes of a buyer.', icon: TrendingUp },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-5">
                  <s.icon size={24} className="text-[#2563EB]" />
                </div>
                <div className="text-xs font-bold text-[#2563EB] tracking-widest uppercase mb-2">Step {s.step}</div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-14">
            What You'll Learn
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { title: 'Estimated Exit Value', desc: 'Get a projected valuation range based on your business profile.', Icon: DollarSign },
              { title: 'Exit Readiness Score', desc: 'Understand how attractive your business may be to a buyer today.', Icon: Gauge },
              { title: 'Value Drivers', desc: 'See which factors are helping or hurting your multiple.', Icon: TrendingUp },
              { title: 'Clear Next Steps', desc: 'Learn practical ways to improve your sellability before going to market.', Icon: CheckCircle },
            ].map((b) => (
              <div key={b.title} className="flex gap-5 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <b.Icon size={22} className="text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg mb-1">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-10">
            This Assessment Is Best For
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              'Owners doing $500k+ in annual revenue',
              'Businesses with 1+ years of operating history',
              'Owners considering a sale in the next 12–60 months',
              'Founders who want to increase value before exiting',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-[#F8FAFC] rounded-lg p-4">
                <CheckCircle size={18} className="text-[#14B8A6] mt-0.5 shrink-0" />
                <span className="text-[#111827]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUALIFICATION STRIP ═══ */}
      <section className="bg-[#0F172A] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Thinking about selling now or later?
          </h2>
          <p className="text-gray-400 mb-6">
            This assessment helps you understand where you stand before talking to buyers, brokers, or advisors.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Sell in 12 months', 'Sell in 1–3 years', 'Just exploring', 'Planning ahead'].map((chip) => (
              <span key={chip} className="bg-white/10 border border-white/20 text-sm text-gray-200 px-5 py-2 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULTS PREVIEW ═══ */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-12">
            What Your Results May Include
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Estimated Valuation Range', value: '$850,000 – $1,150,000' },
              { label: 'Potential Buyer Multiple', value: '3.2x – 4.1x' },
              { label: 'Exit Readiness Score', value: '68 / 100' },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">{card.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#0F172A]">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>Illustrative only</span>
            <span>·</span>
            <span>Actual buyer offers depend on diligence, structure, and market conditions</span>
          </div>
        </div>
      </section>

      {/* ═══ CREDIBILITY ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-10">
            Why Owners Use This
          </h2>
          <div className="space-y-4">
            {[
              'Helps frame realistic expectations before a sale conversation',
              'Highlights the factors sophisticated buyers actually care about',
              'Useful whether you want to sell now or improve value first',
            ].map((b) => (
              <div key={b} className="flex items-start gap-4 bg-[#F8FAFC] rounded-lg p-5">
                <Target size={20} className="text-[#2563EB] mt-0.5 shrink-0" />
                <span className="text-[#111827] leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MID-PAGE CTA ═══ */}
      <section className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            See What Your Business May Be Worth
          </h2>
          <p className="text-blue-100 text-lg mb-8">It takes about 3 minutes.</p>
          <button
            onClick={scrollToQuiz}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#2563EB] px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start the Free Assessment <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ═══ FRICTION REDUCERS / BEFORE YOU START ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-10">
            Before You Start
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Is this confidential?', a: 'Yes. Your responses are kept private and used only to generate your assessment.' },
              { q: 'Do I need exact numbers?', a: 'No. Best estimates are enough to get a useful result.' },
              { q: 'Will I be pressured to sell?', a: 'No. This is designed to help you understand your options.' },
            ].map((item) => (
              <div key={item.q} className="bg-[#F8FAFC] rounded-xl p-6">
                <p className="font-bold text-[#0F172A] mb-2">{item.q}</p>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F172A] mb-10">
            Frequently Asked Questions
          </h2>
          <div>
            <FaqItem
              question="Is this a formal valuation?"
              answer="No. This is an educational estimate based on the information you provide and common valuation logic. A formal valuation requires deeper review."
            />
            <FaqItem
              question="Who is this for?"
              answer="Business owners who want to understand sellability, estimated value, and how to improve it."
            />
            <FaqItem
              question="Do I need to be ready to sell now?"
              answer="No. Many owners use this years before a sale to identify what to improve."
            />
            <FaqItem
              question="What affects my value most?"
              answer="Usually profitability, owner dependence, recurring revenue, growth trends, customer concentration, and how transferable the business is."
            />
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="bg-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get Your Exit Readiness Score™
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Find out what your business may be worth and what could increase your price.
          </p>
          <button
            onClick={scrollToQuiz}
            className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-500/20"
          >
            Take the Quiz <ArrowRight size={18} />
          </button>
        </div>
      </section>

      </>)}
    </div>
  );
}
