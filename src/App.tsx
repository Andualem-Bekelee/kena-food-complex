import React, { useState, useEffect, useMemo } from 'react';
import {
  Wheat,
  MapPin,
  Phone,
  Mail,
  Shield,
  Award,
  Activity,
  ArrowRight,
  Lock,
  ExternalLink,
  CheckCircle,
  Check,
  Truck,
  ChefHat,
  Package,
  Menu,
  X,
  Search,
  Filter,
  Sparkles,
  Users,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types & Data
import { Product, NewsArticle, ContactInquiry, FactoryStats, ProductCategory, InquiryType } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_NEWS,
  INITIAL_SERVICES,
  INITIAL_STATS,
  INITIAL_INQUIRIES
} from './utils/initialData';

// Components
import AIAdvisor from './components/AIAdvisor';
import ProductModal from './components/ProductModal';
import AdminPortal from './components/AdminPortal';

export default function App() {
  // Central application state (synchronized with localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [stats, setStats] = useState<FactoryStats>(INITIAL_STATS);

  // Loaded state
  useEffect(() => {
    // Products initialization
    const storedProds = localStorage.getItem('kena_food_products');
    if (storedProds) {
      setProducts(JSON.parse(storedProds));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('kena_food_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // News initialization
    const storedNews = localStorage.getItem('kena_food_news');
    if (storedNews) {
      setNews(JSON.parse(storedNews));
    } else {
      setNews(INITIAL_NEWS);
      localStorage.setItem('kena_food_news', JSON.stringify(INITIAL_NEWS));
    }

    // Inquiries initialization
    const storedInqs = localStorage.getItem('kena_food_inquiries');
    if (storedInqs) {
      setInquiries(JSON.parse(storedInqs));
    } else {
      setInquiries(INITIAL_INQUIRIES);
      localStorage.setItem('kena_food_inquiries', JSON.stringify(INITIAL_INQUIRIES));
    }

    // Stats initialization
    const storedStats = localStorage.getItem('kena_food_stats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      setStats(INITIAL_STATS);
      localStorage.setItem('kena_food_stats', JSON.stringify(INITIAL_STATS));
    }
  }, []);

  // UI Control States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Selected news article to display in-depth
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: 'General' as InquiryType,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Active gallery selected photo for enlargement modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Filter categories list
  const categories: string[] = ['All', 'Artisanal Breads', 'Pastries & Biscuits', 'Industrial Milling', 'Semolina & Specialty', 'Organic Whole Grain'];

  // Filtered Products Computing
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [products, activeCategory, searchQuery]);

  // Handle Contact Inquiry submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback(null);

    setTimeout(() => {
      const newInq: ContactInquiry = {
        id: `inq-${Date.now()}`,
        name: contactForm.name,
        company: contactForm.company,
        email: contactForm.email,
        phone: contactForm.phone,
        inquiryType: contactForm.inquiryType,
        message: contactForm.message,
        status: 'New',
        date: new Date().toISOString(),
        notes: ''
      };

      const updated = [newInq, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('kena_food_inquiries', JSON.stringify(updated));

      // Reset form
      setContactForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        inquiryType: 'General',
        message: ''
      });
      setIsSubmitting(false);
      setSubmitFeedback('✨ Inquiry submitted successfully! Our B2B Sales & Rheological Advisory Team has queued your submission and will contact you within 12 business hours.');
    }, 850);
  };

  // Fixed coordinates map representation
  const MAP_HUBS = [
    { name: 'Kena HQ & Swiss Bühler-Line Plant', type: 'Flour Mill & Lab', coords: 'Arsi Eteya, Oromia, Ethiopia', desc: '1,200 metric tons daily capacity.' },
    { name: 'Eteya Grain Sourcing & Co-op Silo', type: 'Aggregator Silo', coords: 'Eteya Logistics Zone', desc: 'Capacity: 150,050 metric tons storage.' },
    { name: 'Addis Ababa Distribution Terminal', type: 'Regional Hub', coords: 'Kality Warehousing District, Sector B', desc: 'Direct railway and route dispatch.' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 scroll-smooth flex flex-col font-sans" id="applet-viewport">
      
      {/* 0. Top Sliding Announcement Marquee Bar */}
      <div className="bg-amber-950 text-[#fffdfa] py-2 overflow-hidden border-b border-amber-900/50 relative z-40 text-[11px] font-mono select-none" id="top-marquee-banner">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee-slow flex items-center gap-12">
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> SOURCED FROM THE HIGHLANDS OF ARSI ETEYA • UNCOMPROMISED FLOUR PURITY</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> KENA SUPERIOR WHEAT FLOUR (GRADE 1) • 13.5% ROBUST PROTEIN INDEX</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> KENA PREMIUM STONEGROUND WHITE TEFF • 100% ORGANIC COLD-MILLED FOR PERFECT SPONGY INJERA WITH HIGH AYEN</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> SWISS BÜHLER TECHNOLOGY INTEGRATED • DAILY OUTPUT OF 1,200 METRIC TONS</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> KENA AMBER SEMOLINA • OUTSTANDING DOUBLE ELASTICITY DOUGH INDEX</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> B2B SPECS CERIFICATION: ESA COMPLIANT & ISO 22000:2018 AUDITED STATUS</span>
            <span className="text-amber-500 shrink-0">•</span>
          </div>
          <div className="animate-marquee-slow flex items-center gap-12" aria-hidden="true">
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> SOURCED FROM THE HIGHLANDS OF ARSI ETEYA • UNCOMPROMISED FLOUR PURITY</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> KENA SUPERIOR WHEAT FLOUR (GRADE 1) • 13.5% ROBUST PROTEIN INDEX</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> KENA PREMIUM STONEGROUND WHITE TEFF • 100% ORGANIC COLD-MILLED FOR PERFECT SPONGY INJERA WITH HIGH AYEN</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-amber-400 shrink-0" /> SWISS BÜHLER TECHNOLOGY INTEGRATED • DAILY OUTPUT OF 1,200 METRIC TONS</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> KENA AMBER SEMOLINA • OUTSTANDING DOUBLE ELASTICITY DOUGH INDEX</span>
            <span className="text-amber-500 shrink-0">•</span>
            <span className="flex items-center gap-2 shrink-0"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> B2B SPECS CERIFICATION: ESA COMPLIANT & ISO 22000:2018 AUDITED STATUS</span>
            <span className="text-amber-500 shrink-0">•</span>
          </div>
        </div>
      </div>

      {/* 1. Header (Sticky navigation glass) */}
      <header className="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-stone-200" id="header-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-700/10 text-amber-700 p-2 rounded-xl border border-amber-600/20">
                <Wheat className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-wider uppercase font-mono text-stone-900 block leading-tight">Kena Food Complex</span>
                <span className="text-[10px] text-stone-500 tracking-widest uppercase block -mt-0.5 font-mono">Arsi Eteya · Ethiopia</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <a href="#about" className="hover:text-amber-800 transition-colors">About Us</a>
              <a href="#catalog" className="hover:text-amber-800 transition-colors">Products</a>
              <a href="#services" className="hover:text-amber-800 transition-colors">B2B Services</a>
              <a href="#news" className="hover:text-amber-800 transition-colors">Announcements</a>
              <a href="#gallery" className="hover:text-amber-800 transition-colors">Gallery</a>
              <a href="#contact" className="hover:text-amber-800 transition-colors">Contact Hub</a>
            </nav>

            {/* Admin Trigger Link and Mobile Menu Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-stone-200 rounded-xl hover:bg-stone-850 transition-all border border-stone-800 cursor-pointer shadow-xs"
                id="admin-dashboard-trigger"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Admin CONTROL
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-500 hover:text-stone-900 md:hidden rounded-lg hover:bg-stone-100 transition-all focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                <Menu className="w-5.5 h-5.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-200 bg-[#fcfbf9] px-4 py-4 space-y-2 text-sm font-semibold text-stone-600 block"
            >
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">About Us</a>
              <a href="#catalog" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">Flour Catalog</a>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">B2B Services</a>
              <a href="#news" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">Announcements</a>
              <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">Factory Gallery</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-amber-800">Contact Desk</a>
              
              <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsAdminOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-stone-200 font-mono text-[10px] font-bold rounded-lg uppercase w-full justify-center cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  Milling Admin Entrance
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section (Uncompressed rich photography backdrop + B2B Value overlay) */}
      <section className="relative bg-stone-900 text-white overflow-hidden py-24 md:py-32" id="hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1920"
            alt="Golden Flour Heap"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/20 text-amber-400 border border-amber-600/35 rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Milling Excellence Since {stats.foundedYear}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Honest Flour.<br />
              <span className="text-amber-500">Milled with Rheological Precision.</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
Kenna Food Complex daakuu qulqulluu, nyaata qabaataa fi faayidaa olaanaa qabu, akkaataa tasgabbaa’aa ta’een warshaalee daabboo aadaa olaanoo, sarara oomisha daabboo industrii fi omishtoota buskitaa manneen keessa jiran naannoo Afrikaa Bahaa guutuu keessatti dhiyeessa. Midhaan kun lafa qonnaa maatii Arsi Itayaa irraa argame kan badhaadhaa ta’e irraa argama, akkasumas qulqullina midhaanii olaanaa mirkaneessuuf maashina ammayyaa Swiss Bühler fayyadamuun hojii irra oola.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href="#catalog"
                className="px-6 py-3.5 bg-amber-700 hover:bg-amber-800 active:bg-amber-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer shadow-md"
              >
                Browse Flour Catalog
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer"
              >
                Request Custom Sample Blends
              </a>
            </div>
          </div>

          {/* Quick AI Advisor Assistant Hero integration */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-amber-500" />
              Factory Rheological Metrics
            </h3>
            <p className="text-xs text-stone-300 leading-normal mb-2">
              All deliveries are verified against Chopin Alveograph indices to guarantee constant structural water absorption values.
            </p>

            <div className="divide-y divide-white/10 font-mono text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400">Daily Mill Throughput:</span>
                <span className="font-semibold text-white">{stats.dailyCapacity}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400">Global B2B Wholesalers:</span>
                <span className="font-semibold text-white">{stats.activeDistributors}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400">Sovereign Export Countries:</span>
                <span className="font-semibold text-white">{stats.countriesExported}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-stone-400">Laboratory Standard Rating:</span>
                <span className="font-semibold text-green-400">ISO 22000 Grade A+</span>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/25 p-3 rounded-xl flex gap-2">
              <Shield className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-stone-300 leading-normal">
                <strong>Gluten-Assay Guarantee:</strong> If any shipment yields water absorption variance outside the specified +/- 1.5% range of your profile target, we perform instant replacement or on-site adjustment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Us / Quality Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* About graphic narrative */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600"
              alt="Wheat Field"
              referrerPolicy="no-referrer"
              className="rounded-2xl h-48 w-full object-cover shadow-xs border border-stone-200"
            />
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
              alt="Quality Lab Specialist"
              referrerPolicy="no-referrer"
              className="rounded-2xl h-48 w-full object-cover mt-6 shadow-xs border border-stone-200"
            />
            <div className="bg-stone-100 rounded-2xl p-4 flex flex-col justify-between border border-stone-200 text-left h-48">
              <Award className="w-8 h-8 text-amber-700" />
              <div>
                <strong className="text-xl font-mono text-stone-900 block leading-none">100%</strong>
                <span className="text-[10px] text-stone-500 font-bold tracking-wider uppercase">Unbleached & Pure Grain</span>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600"
              alt="Cargo Packaging silos"
              referrerPolicy="no-referrer"
              className="rounded-2xl h-48 w-full object-cover shadow-xs border border-stone-200"
            />
          </div>

          {/* About core profile copy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block">Company Profile & Standards</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Traditional Mill Heritage Powered by Swiss Processing Technology
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Founded in {stats.foundedYear}, Kena Food Complex bridges the profound traditional textures of regional stoneground teff and grain milling with Swiss computerized particle screening efficiency. Located in the fertile wheat-growing hub of Arsi Eteya, Ethiopia, our plants process local wheat and teff under rigorous hygiene standards, maintaining highly stable moisture configurations and exact mineral ash parameters.
            </p>

            <blockquote className="border-l-4 border-amber-600 pl-4 py-1 my-3 bg-stone-50 rounded-r-lg p-3">
              <p className="text-xs italic text-stone-700 leading-normal">
                "Our flour chemistry matches your dough strategy. We treat structural baking parameters like an exact engineering protocol, eliminating water absorption variations completely."
              </p>
              <cite className="text-[10px] text-stone-500 font-bold uppercase block mt-1.5">— Andualem Bekele, Managing Director</cite>
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-5">
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-stone-900 block">SGS Certified Purity Rating A+</strong>
                  <p className="text-[11px] text-stone-500 leading-normal">Our computerized optical cleaning sifts out cracked hulls and trace foreign materials instantly.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-bold text-stone-900 block">Cold Stoneground Preservation</strong>
                  <p className="text-[11px] text-stone-500 leading-normal">Organic Whole Wheat line was slow milled on volcanic stones to fully isolate germ vitamins and healthy fiber.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products section (Dynamic filterable catalog) */}
      <section className="py-20 bg-stone-50/50 border-b border-stone-200" id="catalog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">Product Showcase</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Our Professional Flour Catalog</h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Review and select specific grain specifications optimized for varying proofing constraints. Select any flour to launch laboratory specs sheets and bakers percentage tool.
            </p>
          </div>

          {/* Search bar & filter pill segments */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-stone-200 pb-6 flex-wrap">
            <div className="flex gap-1.5 flex-wrap justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border outline-none cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-700 text-white border-amber-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-xs shrink-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specs, bread uses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 text-xs rounded-lg outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between"
                id={`product-card-${p.id}`}
              >
                <div>
                  {/* Photo ratio */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm md:text-base tracking-tight leading-tight">{p.name}</h4>
                    <p className="text-stone-500 text-xs leading-normal">
                      {p.description}
                    </p>

                    {/* Labs Mini-grid specs */}
                    <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-250 font-mono text-[10px]">
                      <div>
                        <span className="text-stone-400 block font-sans">Min. Protein:</span>
                        <strong className="text-stone-800 text-xs font-bold block">{p.specs.protein}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-sans">Moisture Absorb:</span>
                        <strong className="text-stone-800 text-xs font-bold block">{p.specs.absorption}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action trigger */}
                <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-stone-100 mt-2">
                  <span className="text-[10px] font-semibold font-mono text-stone-400">{p.price || 'Quotes on request'}</span>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-all cursor-pointer focus:outline-none"
                  >
                    View Rheology & Formula
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-stone-200 rounded-xl space-y-2">
                <Wheat className="w-10 h-10 text-stone-300 mx-auto" />
                <h5 className="font-bold text-stone-800 text-sm">No flours matched your search criteria.</h5>
                <p className="text-xs text-stone-500">Try modifying your query or selecting another flour filter class.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Custom B2B Services (Bespoke blending, Private labeling, logistics) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200" id="services">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Services introduction text */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block">Global Tailored Services</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">
              B2B Solutions & Private Label Operations
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              We operate beyond standard deliveries. Kena Food Complex provides bespoke flour formulation, custom weight white teff flour supply, private commercial labeling, high-capacity bulk sifting pipelines, and formal cereal lab analysis for domestic and regional wholesale operations.
            </p>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-2.5 mt-5">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-900 leading-normal">
                <strong>Lab Diagnostics:</strong> Need a precise falling number or water resistance target? Our rheology officers will guide your formulation from start to finish.
              </p>
            </div>
          </div>

          {/* Services list cards mapping */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {INITIAL_SERVICES.map((srv) => (
              <div key={srv.id} className="bg-white border border-stone-200 hover:border-stone-300 p-5 rounded-xl shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-50 border border-amber-100 text-amber-700 p-2 rounded-lg">
                      {srv.iconName === 'ChefHat' && <ChefHat className="w-4 h-4" />}
                      {srv.iconName === 'Package' && <Package className="w-4 h-4" />}
                      {srv.iconName === 'Truck' && <Truck className="w-4 h-4" />}
                      {srv.iconName === 'Activity' && <Activity className="w-4 h-4" />}
                    </div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{srv.title}</h4>
                  </div>
                  
                  <p className="text-stone-500 text-[11px] leading-relaxed mb-3">{srv.description}</p>
                  
                  <ul className="space-y-1 text-[10px] text-stone-600">
                    {srv.details.map((dt) => (
                      <li key={dt} className="flex gap-1.5 items-center">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{dt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-stone-100 pt-2 flex justify-between items-center text-[10px] text-stone-400">
                  <span className="font-semibold uppercase tracking-wider font-mono">B2B Capacity</span>
                  <span className="text-stone-800 font-bold font-mono">{srv.capacity || 'Contract Dependent'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Photo Gallery Section */}
      <section className="py-20 bg-stone-50/50 border-b border-stone-200" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">Interactive Gallery</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Our Farm, Mills & Laboratories</h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Step inside our advanced packaging facilities, laboratory-controlled quality test vaults, and pesticide-free grains farms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
                title: 'Arsi Crop Sourcing & Farms'
              },
              {
                url: 'https://images.unsplash.com/photo-1627483262112-039e9a0a0f16?auto=format&fit=crop&q=80&w=800',
                title: 'High-Density White Teff Grain'
              },
              {
                url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
                title: 'Unbleached Organic Flour Powder'
              },
              {
                url: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800',
                title: 'Scoring Traditional Sourdough Boule'
              },
              {
                url: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=800',
                title: 'Golden Hearth Dabo & Ambasha Loaves'
              },
              {
                url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
                title: 'Confectioneries & Crispy Pastries'
              },
              {
                url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
                title: 'Rheological Quality Testing Lab'
              },
              {
                url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
                title: 'B2B Silt & Bulk Railroad Depot'
              }
            ].map((pic, idx) => (
              <div
                key={idx}
                className="group relative h-48 md:h-64 rounded-xl overflow-hidden border border-stone-200 shadow-xs cursor-pointer"
                onClick={() => setSelectedPhoto(pic.url)}
              >
                <img
                  src={pic.url}
                  alt={pic.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white" />
                <div className="absolute bottom-3 left-3 right-3 text-white z-10 text-left bg-stone-950/60 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold block uppercase tracking-wider">{pic.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. News & Announcements Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200" id="news">
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">Milling Pressroom</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Announcements & Market Reports</h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Follow wheat market shifts, carbon reductions indices, and facilities machinery upgrades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-amber-700 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
                      <span>{item.date}</span>
                      <span className="font-semibold">{item.author.split(' ')[0]}</span>
                    </div>
                    <h4 className="font-bold text-stone-950 text-sm md:text-base leading-snug tracking-tight hover:text-amber-800 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-stone-500 text-xs leading-normal">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedNewsArticle(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 focus:outline-none cursor-pointer"
                  >
                    Read full article
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Hub & Live Location Map */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Inquiry form */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">Submit Commercial Inquiry</h2>
              <p className="text-xs text-stone-500 leading-normal">
                Interested in bulk flour pricing, custom laboratory blending, or acting as regional transport agent? Please submit details and our rheological division will handle your request.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Corporate Contact Name:</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Pierre LeBlanc"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Company / Boulangerie Name:</label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    placeholder="e.g. Custom Artisanal Dough"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Corporate Email Address:</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. pierre@doughco.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Contact Phone (Opt):</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Inquiry Category Tag:</label>
                <select
                  value={contactForm.inquiryType}
                  onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value as InquiryType })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="General">🔵 General Corporate Information</option>
                  <option value="Bulk Orders">📦 B2B Bulk Order Quote</option>
                  <option value="Custom Blending">🧬 Custom Milling / Enzyme Blending</option>
                  <option value="Distributor Application">🚛 Logistics / Port Wholesaler Agent</option>
                  <option value="Technical Advisory">🥖 Laboratory Analysis & Rheology audit</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Corporate message / specs demand:</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Detail daily capacity demands, targeted protein percentages, bulk storage silo blowout constraints..."
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-400"
                />
              </div>

              {submitFeedback && (
                <div className="p-3.5 bg-amber-50 text-amber-900 text-xs font-semibold rounded-xl border border-amber-200">
                  {submitFeedback}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                id="submit-contact-form"
              >
                {isSubmitting ? 'Registering Lead...' : 'Submit Commercial Lead'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Vectors Map Coordinate representer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <MapPin className="text-amber-700 w-5 h-5" />
                Milling Coordinate Locations
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Connect directly with our physical processing centers located at primary ocean ports and trans-railways points.
              </p>

              {/* Graphical Map visualization container */}
              <div className="border border-stone-250 bg-stone-150 rounded-xl h-52 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-stone-200 bg-[size:16px_16px] bg-[radial-gradient(#e5e5e5_1px,transparent_1px)]" />
                
                {/* Visual vectors representing map pins */}
                <div className="absolute top-[25%] left-[30%] text-center animate-bounce">
                  <span className="w-3.5 h-3.5 bg-amber-700 border-2 border-white rounded-full block mx-auto"></span>
                  <span className="bg-stone-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded block -mt-1 font-mono uppercase">Mill HQ</span>
                </div>
                <div className="absolute top-[60%] left-[80%] text-center animate-bounce animation-delay-200">
                  <span className="w-3.5 h-3.5 bg-stone-700 border-2 border-white rounded-full block mx-auto"></span>
                  <span className="bg-stone-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded block -mt-1 font-mono uppercase">Cargo Hub</span>
                </div>
                <div className="absolute top-[50%] left-[15%] text-center animate-bounce animation-delay-300">
                  <span className="w-3.5 h-3.5 bg-amber-600 border-2 border-white rounded-full block mx-auto"></span>
                  <span className="bg-stone-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded block -mt-1 font-mono uppercase">Grain Silo</span>
                </div>

                {/* SVG connection lines overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="30%" y1="25%" x2="80%" y2="60%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="15%" y1="50%" x2="30%" y2="25%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-lg border border-stone-200 text-[10px] text-stone-500 font-mono">
                  Operational state: <strong className="text-green-600">ONLINE</strong>
                </div>
              </div>

              {/* Address details list */}
              <div className="space-y-3 pt-2">
                {MAP_HUBS.map((hub) => (
                  <div key={hub.name} className="flex gap-2.5 items-start text-xs border-b border-stone-150 pb-2.5 last:border-0 last:pb-0">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 block font-bold">{hub.name}</strong>
                      <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">{hub.type} — {hub.coords}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{hub.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct email/phone anchors */}
              <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-700">
                <a href="mailto:info@kenafoodcomplex.com" className="flex items-center gap-1.5 hover:text-amber-700 break-all">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  info@kenafoodcomplex.com
                </a>
                <a href="tel:+251222380000" className="flex items-center gap-1.5 hover:text-amber-700">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  +251 22 238 0000
                </a>
              </div>

              {/* Social Channels in Contact card */}
              <div className="pt-4 border-t border-stone-150">
                <span className="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase block mb-2.5 font-mono">Official Social Media Portals</span>
                <div className="flex gap-2">
                  <a href="https://facebook.com/KenaFoodComplex" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 rounded-md border border-stone-200 hover:border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200">
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook
                  </a>
                  <a href="https://linkedin.com/company/kenafoodcomplex" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 rounded-md border border-stone-200 hover:border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200">
                    <Linkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                  <a href="https://instagram.com/KenaFood" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 rounded-md border border-stone-200 hover:border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200">
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. Footer (Corporate copyright, cert indicators) */}
      <footer className="mt-auto bg-stone-900 text-white min-h-[300px] border-t-2 border-amber-600 py-16" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Wheat className="w-6 h-6 text-amber-500 animate-pulse" />
              <div>
                <span className="text-sm font-bold tracking-wider uppercase font-mono block">Kena Food Complex</span>
                <span className="text-[9px] text-stone-400 tracking-widest uppercase block -mt-1 font-mono">Arsi Eteya · Ethiopia</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Serving industrial bakers, artisanal chefs, commercial partners, and family households across East Africa with uncompromised, clean cereals and flour blends. Sourced with circular green standards since 2008.
            </p>
            
            {/* Social media footer channels */}
            <div className="pt-2">
              <span className="text-[9px] font-bold tracking-widest text-[#cfc9be]/50 uppercase block mb-2 font-mono">Follow Our Harvest Journey</span>
              <div className="flex gap-2.5">
                <a href="https://facebook.com/KenaFoodComplex" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-300 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/kenafoodcomplex" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-300 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/KenaFood" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-300 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/KenaFood" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-300 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://youtube.com/@KenaFoodComplex" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-300 hover:text-amber-400 rounded-lg border border-white/5 hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-amber-400">Anchor points</h4>
            <div className="flex flex-col space-y-2 text-stone-400">
              <a href="#about" className="hover:text-white transition-opacity">About Heritage</a>
              <a href="#catalog" className="hover:text-white transition-opacity">Flour Grades</a>
              <a href="#services" className="hover:text-white transition-opacity">B2B Custom milling</a>
              <a href="#news" className="hover:text-white transition-opacity">Technical releases</a>
              <a href="#contact" className="hover:text-white transition-opacity">Sales desk Hub</a>
            </div>
          </div>

          {/* Lab certifications list */}
          <div className="space-y-4 text-xs md:col-span-2">
            <h4 className="font-bold uppercase tracking-wider text-amber-400">Audited Laboratory Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {stats.labCertifications.map((cert) => (
                <span key={cert} className="px-2.5 py-1 bg-white/5 border border-white/10 text-stone-300 rounded font-mono text-[9px] font-semibold tracking-wide">
                  🛡️ {cert}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-stone-500 leading-normal">
              Kena Food Complex operates as a registered enterprise in Arsi Eteya, Ethiopia. ESA standards, ISO 22000, and SGS flour sanitation inspection reports are compiled and audited annually.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-8 mt-12 flex justify-between items-center text-[10px] text-stone-500 font-mono flex-wrap gap-4">
          <span>© 2008 - {new Date().getFullYear()} Kena Food Complex. All rights reserved. Located in Arsi Eteya, Ethiopia.</span>
          <div className="flex gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Sitemap</span>
            <span className="hover:text-stone-300 cursor-pointer">Export Regulation Act</span>
            <span className="hover:text-stone-300 cursor-pointer">Privacy & Cookie Agreement</span>
          </div>
        </div>
      </footer>

      {/* 10. Floating Interactive Overlays / Modals */}
      
      {/* Product specs details and calculator popover */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Real-time CMS admin CRM controller sheet */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        setProducts={setProducts}
        news={news}
        setNews={setNews}
        inquiries={inquiries}
        setInquiries={setInquiries}
        stats={stats}
        setStats={setStats}
      />

      {/* Fully expanded news dialog popover */}
      <AnimatePresence>
        {selectedNewsArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setSelectedNewsArticle(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border text-left border-stone-200 rounded-2xl max-w-2xl w-full relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <img
                  src={selectedNewsArticle.imageUrl}
                  alt={selectedNewsArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/60 flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[9px] font-bold uppercase bg-amber-700 px-1.5 py-0.5 rounded mb-2.5 inline-block">{selectedNewsArticle.category}</span>
                    <h3 className="text-md sm:text-lg font-bold leading-normal">{selectedNewsArticle.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNewsArticle(null)}
                  className="absolute top-3 right-3 bg-stone-900/60 p-1.5 rounded-full text-white hover:bg-stone-950 transition-colors focus:outline-none"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-4">
                <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono border-b pb-2">
                  <span>Author: <strong>{selectedNewsArticle.author}</strong></span>
                  <span>Date: <strong>{selectedNewsArticle.date}</strong></span>
                </div>
                <p className="text-xs font-bold text-stone-700 leading-relaxed italic bg-stone-50 p-3 rounded-lg border-l-4 border-amber-600">
                  {selectedNewsArticle.summary}
                </p>
                <div className="text-xs text-stone-600 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                  {selectedNewsArticle.content}
                </div>
              </div>

              <div className="bg-stone-50 px-6 py-3 border-t text-right shrink-0">
                <button
                  onClick={() => setSelectedNewsArticle(null)}
                  className="text-xs font-semibold px-4 py-2 border rounded-xl hover:bg-stone-100 transition-colors focus:outline-none cursor-pointer"
                >
                  Close Press Release
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo enlargement modal preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/80 cursor-pointer"
              onClick={() => setSelectedPhoto(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl w-full"
            >
              <img
                src={selectedPhoto}
                alt="Enlarged grain mill photography asset"
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl border-2 border-stone-800"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-stone-950/60 p-2 rounded-full text-white hover:bg-stone-950 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Server side Gemini proxy baked flour expert AI chats advisor bot */}
      <AIAdvisor />

    </div>
  );
}
