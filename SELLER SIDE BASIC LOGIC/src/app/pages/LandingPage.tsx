import { useRef, useState, type VideoHTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  ChevronRight,
  Languages,
  Mic,
  MicOff,
  PackageCheck,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';
import LandingNavbar from '../components/LandingNavbar';
import DashboardPreview from '../components/DashboardPreview';
import { speechLocales } from '../../i18n';

const VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4';
const POSTER =
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=60';
const VOICE_ONBOARDING_KEY = 'scm_voice_onboarding_brief';

const features = [
  {
    title: 'Voice-first product listing',
    desc: 'Artisans can speak in English, Hindi, or Kannada and turn a rough craft description into a sellable listing.',
    icon: Mic,
  },
  {
    title: 'Digital storefronts',
    desc: 'Each product gets pricing, storytelling, verification cues, and a buyer-ready marketplace card.',
    icon: Store,
  },
  {
    title: 'Fair pricing assistant',
    desc: 'AI estimates labor, material, and suggested price so artisans are not forced into middleman rates.',
    icon: BadgeIndianRupee,
  },
  {
    title: 'Order visibility',
    desc: 'Seller and buyer flows share one order pipeline from pending to delivered.',
    icon: PackageCheck,
  },
  {
    title: 'Local-language access',
    desc: 'Language switching and speech locales lower the barrier for first-time digital sellers.',
    icon: Languages,
  },
  {
    title: 'Authenticity layer',
    desc: 'QR-style verification and artisan metadata help buyers trust who made the product.',
    icon: ShieldCheck,
  },
];

const problemGaps = [
  ['Market access', 'Buyer marketplace plus seller storefront'],
  ['Catalogue creation', 'Image upload, voice description, AI copy'],
  ['Branding help', 'Captions, hashtags, product storytelling'],
  ['Order management', 'Seller and buyer order tracking'],
  ['Low-literacy access', 'Voice onboarding and local language UI'],
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [voiceBrief, setVoiceBrief] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startVoiceOnboarding = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      toast.error('Voice onboarding needs Chrome or Edge speech support.');
      return;
    }

    const recognition = new SR();
    recognition.lang = speechLocales[i18n.language] ?? 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      recognitionRef.current = null;
      toast.error(event.error === 'not-allowed' ? 'Microphone permission was blocked.' : 'Voice capture stopped.');
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      setVoiceBrief((prev) => `${prev ? `${prev} ` : ''}${transcript}`.trim());
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const continueWithVoiceBrief = () => {
    const brief = voiceBrief.trim();
    if (brief) {
      localStorage.setItem(VOICE_ONBOARDING_KEY, brief);
    }
    navigate('/seller/upload');
  };

  return (
    <div className="scm-page-frame bg-[#f7f7f4]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <section className="relative w-full min-h-[86vh] overflow-hidden bg-[#f3f0ea] rounded-2xl sm:rounded-3xl border border-black/[0.04]">
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
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white/80 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <LandingNavbar />
          <div className="flex flex-col items-center px-4 pt-6 sm:pt-10 pb-3 text-center flex-shrink-0">
            <span className="inline-flex items-center gap-2 bg-white/95 rounded-full px-4 py-1.5 shadow-sm text-[13px] border border-black/[0.04]">
              <span className="w-2 h-2 rounded-full bg-[#ef4d23]" />
              She Can Market
            </span>
            <h1
              className="mt-5 sm:mt-6 max-w-4xl text-neutral-900"
              style={{
                fontSize: 'clamp(36px, 8vw, 72px)',
                lineHeight: 1.05,
                fontWeight: 500,
                letterSpacing: 0,
              }}
            >
              Direct markets for
              <br />
              women <span className="scm-headline-serif">Artisans</span>
            </h1>
            <p
              className="mt-4 sm:mt-6 text-neutral-700 px-2 max-w-2xl leading-7"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}
            >
              A minimalist commerce assistant that helps rural artisans speak, list, price, sell, and track orders without depending on middlemen.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/seller')}
                className="scm-btn-dark inline-flex items-center gap-3 pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[14px]"
              >
                Open seller portal
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
              <a
                href="#voice-onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-[14px] font-medium text-neutral-900 border border-black/[0.06] shadow-sm"
              >
                Try voice onboarding
                <Mic className="w-4 h-4 text-[#ef4d23]" />
              </a>
            </div>
          </div>
          <div className="flex-1 overflow-hidden pt-3 sm:pt-6">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <main className="bg-white rounded-2xl sm:rounded-3xl mt-3 sm:mt-4 border border-black/[0.04] overflow-hidden">
        <section id="features" className="px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <p className="text-[12px] uppercase text-[#ef4d23] font-semibold mb-3">Features</p>
                <h2 className="text-3xl sm:text-5xl font-semibold text-neutral-950 leading-tight">
                  Built for first-time digital sellers.
                </h2>
              </div>
              <p className="max-w-xl text-neutral-600 leading-7">
                The product now maps directly to the problem statement: catalogue creation, direct customer access, order visibility, branding, fair pricing, and local language support.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="bg-white p-6 min-h-[220px] flex flex-col justify-between">
                    <div className="w-11 h-11 rounded-xl bg-neutral-950 text-white flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-950">{feature.title}</h3>
                      <p className="text-sm leading-6 text-neutral-600 mt-2">{feature.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="voice-onboarding" className="px-5 sm:px-8 lg:px-12 py-12 sm:py-16 bg-[#fbfaf7] border-y border-neutral-200">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-[12px] uppercase text-[#ef4d23] font-semibold mb-3">Voice Onboarding</p>
              <h2 className="text-3xl sm:text-5xl font-semibold text-neutral-950 leading-tight">
                Start with speech, not forms.
              </h2>
              <p className="text-neutral-600 leading-7 mt-5">
                Low-digital-literacy users can describe their craft aloud. The spoken brief is saved and carried into AI Product Upload as the starting description.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-7">
                {['Craft type', 'Material and time', 'Local story'].map((item) => (
                  <div key={item} className="border border-neutral-200 rounded-xl px-4 py-3 text-sm bg-white text-neutral-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">Tell us about your product</p>
                  <p className="text-xs text-neutral-500 mt-1">Example: "I make bamboo baskets, it takes 2 days, price around 900 rupees."</p>
                </div>
                <button
                  type="button"
                  onClick={startVoiceOnboarding}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${isListening ? 'bg-red-500' : 'bg-neutral-950'}`}
                  aria-label={isListening ? 'Stop voice onboarding' : 'Start voice onboarding'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
              <textarea
                value={voiceBrief}
                onChange={(event) => setVoiceBrief(event.target.value)}
                placeholder="Your spoken onboarding brief will appear here..."
                className="w-full min-h-36 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 outline-none focus:border-neutral-950"
              />
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={continueWithVoiceBrief}
                  className="scm-btn-dark inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  Continue to AI upload
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceBrief('Handwoven bamboo basket made by women artisans, two days of work, natural finish, useful for home storage and gifting.')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-800"
                >
                  Use sample brief
                  <Sparkles className="w-4 h-4 text-[#ef4d23]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            <div>
              <p className="text-[12px] uppercase text-[#ef4d23] font-semibold mb-3">About</p>
              <h2 className="text-3xl sm:text-5xl font-semibold text-neutral-950 leading-tight">
                A commerce layer for artisan districts.
              </h2>
              <p className="text-neutral-600 leading-7 mt-5">
                She Can Market is designed around the exact exclusion pattern in the brief: rural craft talent exists, but direct customers, catalogues, logistics clarity, branding, and fair prices are missing.
              </p>
              <button
                type="button"
                onClick={() => navigate('/buyer')}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ef4d23] text-white px-5 py-3 text-sm font-medium"
              >
                View buyer marketplace
                <Store className="w-4 h-4" />
              </button>
            </div>

            <div className="grid gap-px bg-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden">
              {problemGaps.map(([gap, solution]) => (
                <div key={gap} className="bg-white p-5 sm:p-6 grid sm:grid-cols-[0.7fr_1fr] gap-2 sm:gap-6">
                  <p className="font-semibold text-neutral-950">{gap}</p>
                  <p className="text-sm leading-6 text-neutral-600">{solution}</p>
                </div>
              ))}
              <div className="bg-neutral-950 text-white p-5 sm:p-6 grid sm:grid-cols-[0.7fr_1fr] gap-2 sm:gap-6">
                <p className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" /> Next gap</p>
                <p className="text-sm leading-6 text-white/75">
                  Logistics partner integration and district-level impact dashboards would make the solution stronger for real deployment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <div className="max-w-6xl mx-auto rounded-2xl bg-neutral-950 text-white px-6 sm:px-8 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-white/55 text-sm mb-2">Ready demo path</p>
              <h2 className="text-2xl sm:text-3xl font-semibold">Speak a product, publish it, and track the first order.</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/seller/upload')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-neutral-950 px-5 py-3 text-sm font-semibold"
            >
              Start upload
              <Route className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
