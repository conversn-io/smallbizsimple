import type { Metadata } from "next";
import { Inter, Open_Sans, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import ConditionalHeader from '../components/navigation/ConditionalHeader';
import ConditionalFooter from '../components/ConditionalFooter';
import { LayoutProvider } from '../contexts/FooterContext';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "SmallBizSimple - Simple tools. Real growth.",
    template: "%s | SmallBizSimple"
  },
  description: "Empower your small business with direct, easy-to-use tools for funding, tax credits, marketing, and lead generation. Built for practical, time-starved business owners who want clear, actionable support.",
  keywords: ["small business funding", "business loans", "tax credits", "ERC tax credits", "small business marketing", "lead generation", "business growth", "small business tools", "business financing", "small business resources"],
  authors: [{ name: "SmallBizSimple Team" }],
  creator: "SmallBizSimple",
  publisher: "SmallBizSimple",
  icons: {
    icon: [
      { url: '/images/logos/smallbizsimple-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: '/images/logos/smallbizsimple-favicon.png',
    apple: '/images/logos/smallbizsimple-favicon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smallbizsimple.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://smallbizsimple.org',
    siteName: 'SmallBizSimple',
    title: 'SmallBizSimple - Simple tools. Real growth.',
    description: 'Empower your small business with direct, easy-to-use tools for funding, tax credits, marketing, and lead generation.',
    images: [
      {
        url: '/images/webp/hero/small-business-growth.webp',
        width: 1200,
        height: 630,
        alt: 'Small business owners growing their businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SmallBizSimple',
    creator: '@SmallBizSimple',
    title: 'SmallBizSimple - Simple tools. Real growth.',
    description: 'Empower your small business with direct, easy-to-use tools for funding, tax credits, marketing, and lead generation.',
    images: ['/images/webp/hero/small-business-growth.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon links for better browser compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logos/smallbizsimple-favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/smallbizsimple-favicon.png" />
        
        {/* ✅ DIRECT TRACKING: GA4 Base Code (Synchronous Loading) */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_SMALLBIZSIMPLE && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_SMALLBIZSIMPLE}');
                `
              }}
            />
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_SMALLBIZSIMPLE}`}
            />
          </>
        )}
        
        {/* ✅ DIRECT TRACKING: Meta Pixel Base Code (with bot detection) */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID_SMALLBIZSIMPLE && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  
                  // Bot detection - only track if not a bot
                  (function() {
                    var isBot = false;
                    if (typeof navigator !== 'undefined') {
                      var ua = navigator.userAgent || '';
                      isBot = /bot|crawler|spider|crawling|facebookexternalhit|Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver/i.test(ua);
                    }
                    
                    if (!isBot) {
                      fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID_SMALLBIZSIMPLE}');
                      fbq('track', 'PageView');
                    } else {
                      // Still initialize but don't track PageView for bots
                      fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID_SMALLBIZSIMPLE}');
                    }
                  })();
                `
              }}
            />
            <noscript>
              <img height="1" width="1" style={{display:'none'}} 
                   src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID_SMALLBIZSIMPLE}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${openSans.variable} ${ibmPlexSans.variable} antialiased`}
      >
        <LayoutProvider>
          <ConditionalHeader />
          <main>{children}</main>
          <ConditionalFooter />
        </LayoutProvider>
      </body>
    </html>
  );
}

