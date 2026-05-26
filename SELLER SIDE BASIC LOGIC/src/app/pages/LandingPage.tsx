import type { VideoHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import DashboardPreview from '../components/DashboardPreview';

const VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4';
const POSTER =
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="scm-page-frame" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="relative w-full h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          poster={POSTER}
          {...({ 'webkit-playsinline': 'true', 'x5-playsinline': 'true' } as VideoHTMLAttributes<HTMLVideoElement>)}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <LandingNavbar />
          <div className="flex flex-col items-center px-4 pt-6 sm:pt-10 pb-4 text-center flex-shrink-0">
            <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-[13px]">
              <span className="w-2 h-2 rounded-full bg-[#ef4d23]" />
              She Can Market
            </span>
            <h1
              className="mt-5 sm:mt-6 max-w-4xl text-neutral-900"
              style={{
                fontSize: 'clamp(36px, 8vw, 72px)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              Shaping <span className="scm-headline-serif">Artisans</span>
              <br />
              of tomorrow
            </h1>
            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2 max-w-2xl"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
            >
              The all-in-one platform powering women artisans and conscious buyers
            </p>
            <button
              type="button"
              onClick={() => navigate('/seller')}
              className="mt-6 sm:mt-8 scm-btn-dark inline-flex items-center gap-3 pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[14px]"
            >
              Get Started
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-end overflow-hidden">
            <DashboardPreview />
          </div>
          <div id="about" className="sr-only">
            About
          </div>
        </div>
      </div>
    </div>
  );
}
