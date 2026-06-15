import { Product, NewsArticle, ServiceItem, ContactInquiry, FactoryStats } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-kena-superior',
    name: "Kena Superior Wheat Flour (Grade 1)",
    category: 'Artisanal Breads',
    description: 'High-protein wheat flour milled from the fertile Arsi highlands, optimized for robust industrial and artisanal loaves and traditional Ethiopian dabo.',
    longDescription: 'Kena Superior Wheat Flour (Grade 1) is our premier offering. Milled from selected premium hard spring wheat grown in the highlands of Arsi, Ethiopia, it delivers exceptional gluten strength and moisture absorption. Highly recommended for commercial bread production, traditional dabo (loaves), and ambasha bread, this flour ensures superior loaf volume and a uniform, resilient crumb structure under intensive mechanical kneading.',
    specs: {
      protein: '13.5%',
      ash: '0.52%',
      moisture: '13.8%',
      absorption: '64% - 66%',
      alveographW: '280 - 310 (P/L: 0.7)'
    },
    applications: ['Premium sandwich breads', 'Traditional Dabo & Ambasha', 'High-volume mechanized bakeries', 'High-hydration rustic buns'],
    packaging: ['5kg Pack', '10kg Sack', '25kg Bakery Bag', '50kg Bulk Sack'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: 'ETB 3,400 / 100kg (Ex-Factory)'
  },
  {
    id: 'prod-kena-teff',
    name: 'Kena Premium Stoneground White Teff',
    category: 'Organic Whole Grain',
    description: '100% pure white teff, meticulously stoneground at low temperature to preserve the complete mineral profile and native wild yeasts for perfect, spongy injera.',
    longDescription: 'Sourced from cooperative smallholder farms across Eteya and the fertile plains of Arsi. Milled on slow-turning volcanic stone disks, we completely avoid high temperature degrade, preserving the high iron, calcium, fiber, and native agricultural microflora. This premium flour has high liquid holding capacity, accelerating the natural 3-to-4 day fermentation cycle to produce perfectly spongy injera with pristine eyes ("ayen") and a beautifully balance tangy aroma.',
    specs: {
      protein: '11.4%',
      ash: '1.65%',
      moisture: '11.0%',
      absorption: '115% - 130% (High hydration injera batter)',
      alveographW: 'N/A (Gluten-free traditional flour)'
    },
    applications: ['Traditional Ethiopian Injera', 'Nutritious gluten-free baking', 'Traditional porridge (Genfo / Muk)', 'Premium gluten-free pastries'],
    packaging: ['5kg Family Bag', '25kg Kitchen Sack', '50kg Wholesaler Sack'],
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: 'ETB 6,200 / 100kg (Ex-Factory)'
  },
  {
    id: 'prod-kena-semolina',
    name: 'Kena High-Density Amber Semolina',
    category: 'Semolina & Specialty',
    description: 'Durum semolina milled from superior regional amber durum wheat, holding excellent gluten elasticity for premium pasta and macaroni manufacturing.',
    longDescription: 'Kena High-Density Amber Semolina is designed specifically for paste and pasta extrusion. Sourced from durum wheat varieties cultivated in the high rain-abundance soil of Arsi Zone. Featuring a vibrant yellow carotenoid pigmentation and premium coarse glassiness, it preserves direct starch bonds during high temperature industrial cooking, ensuring local Ethiopian macaroni and spaghetti products retain a firm, al-dente texture without breakage.',
    specs: {
      protein: '14.2%',
      ash: '0.75%',
      moisture: '13.0%',
      absorption: '57% - 60%',
      alveographW: '210 - 240 (P/L: 1.1)'
    },
    applications: ['Industrial Spaghetti & Macaroni', 'Artisanal fresh pasta rolling', 'Traditional semolina biscuits', 'Couscous and porridge'],
    packaging: ['25kg Double-Layered Poly Bag', '50kg Moisture-Resistant Sack'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c83151?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: 'ETB 4,100 / 100kg (Ex-Factory)'
  },
  {
    id: 'prod-kena-soft',
    name: 'Kena Biscuit & Pastry Special',
    category: 'Pastries & Biscuits',
    description: 'Extra-fine soft wheat flour with low dough tenacity, engineered for crisp industrial biscuits, tender crackers, and sweet local pastries.',
    longDescription: 'Specially engineered for automated confectionery and biscuit lines across East Africa. Milled from low-protein, thin-husk soft wheat varieties, the flour guarantees minimal gluten elasticity during kneading. This stops biscuits from shrinking or shifting shape under rapid conveyor ovens, resulting in beautifully uniform crispness, snap-feel, and uniform golden-brown browning.',
    specs: {
      protein: '9.4%',
      ash: '0.45%',
      moisture: '13.5%',
      absorption: '51% - 53%',
      alveographW: '90 - 110 (P/L: 0.35)'
    },
    applications: ['Confectionery crispy biscuits', 'Automated cracker production', 'Fine local cakes and muffins', 'Crisp samosa shells (sambusa)'],
    packaging: ['25kg Bakery Pack', '50kg Commercial Sack'],
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: 'ETB 3,100 / 100kg (Ex-Factory)'
  },
  {
    id: 'prod-kena-bran',
    name: 'Kena Whole Grain Wheat Bran (B2B Animal Feed)',
    category: 'Industrial Milling',
    description: 'High-fiber, high-protein organic wheat milling by-products, supplied in heavy volumes directly to regional livestock and dairy farms.',
    longDescription: 'Produced as an organic, nutrient-dense by-product of our primary state-of-the-art wheat cleaning and outer hull separation process. Packed with fiber, iron, and key B-vitamins, it provides safe, clean, and digestion-boosting energy inputs for commercial dairy cattle, sheep, and poultry producers in Arsi and surrounding agricultural hubs.',
    specs: {
      protein: '15.5%',
      ash: '4.80%',
      moisture: '12.5%',
      absorption: 'N/A',
      alveographW: 'N/A'
    },
    applications: ['Dairy cattle feed formulation', 'Commercial livestock grain mixes', 'Poultry dietary fibers supplement'],
    packaging: ['40kg Air-Permeable Feed Sacks', 'Open-bed truck bulk loadout'],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: 'ETB 1,600 / 100kg (B2B Bulk)'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Kena Food Complex Completes Integration of Swiss Bühler Milling Tech',
    summary: 'Our primary Eteya facilities finalize installation of automated sifting and cleaning lines, raising peak daily output potential to 1,200 metric tons.',
    content: 'We are delighted to announce the absolute integration of our brand new, computer-guided milling system, designed and installed in collaboration with Bühler Group AG (Switzerland). By incorporating multi-stage optical grain sorters, the new plant eliminates weed seeds, damaged wheat, and non-grain particles with a sifting accuracy of 99.9%. This grand expansion boosts Eteya’s local milling capability to 1,200 metric tons per day, establishing Kena Food Complex as a prominent champion for food security and modern grain processing across the Oromia region and international horn of Africa markets.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    date: 'June 10, 2026',
    author: 'Andualem Bekele (Managing Director)',
    category: 'Press Release'
  },
  {
    id: 'news-2',
    title: 'Rheology Spotlight: Empowering Host Farmers of Arsi Eteya',
    summary: 'How Kena Labs partners with local wheat growers to cultivate high-gluten durum varieties with optimal protein characteristics.',
    content: 'Cultivated in the mineral-rich highlands of Arsi, the durum and hard wheat of Ethiopia has phenomenal baking properties. To bridge the gap between farm yields and elite industrial baking stability, Kena Food Complex has launched the Farmer Crop Advisory Project. Our laboratory team is actively visiting Eteya agricultural cooperatives, distributing certified high-yield seed varieties and testing soil organic levels. By evaluating gluten parameters right at the farm gate using our Chopin Alveograph testing vans, we guarantee higher, predictable market prices for farmers while maintaining our premium status as the most robust high-gluten flour factory in the region.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1200',
    date: 'May 24, 2026',
    author: 'Dr. Martha Jenkins (Senior Cereal Technologist)',
    category: 'Technical Article'
  },
  {
    id: 'news-3',
    title: 'Custom Baking Innovation: Optimizing Injera Sponginess (Ayen)',
    summary: 'Laboratory research on teff moisture absorption curves delivers groundbreaking fermentation indices for baking partners.',
    content: 'Developing a consistent, beautifully patterned injera at commercial scale requires exact control over wild teff starch reactions. This seasonal technical bulletin outlines how Kena Cereal Research Scientists implemented a new low-temperature stone-mill protocol at our Arsi Eteya station. By controlling moisture levels index down to exactly 11.0% with cold grinding, the starch particles remain fully undamaged. This allows natural lactic acid bacteria to double fermentation efficiency, ensuring bakeries get a uniform, spongy injera batter with fantastic structural air eyes (ayen) on the baking griddle.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
    date: 'April 15, 2026',
    author: 'Bekele Shiferaw (Lead Chemical Scientist)',
    category: 'Seasonal Update'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-blending',
    title: 'Bespoke Cereal & Enzyme Formulation',
    description: 'Work directly with Kena Food Complex lab technicians to design specific protein ratings, starch capacities, and flour blends optimized for specialized recipes.',
    iconName: 'ChefHat',
    details: [
      'Tailored gluten strength indices for soft or hard baking',
      'Calculated Falling Number adjustment for optimal proofing',
      'Specialized mixing of durum and soft wheat fractions',
      'Test bakers proofing validation inside our Eteya testing kitchen'
    ],
    capacity: 'Min. Special Blend Order: 10 Metric Tons'
  },
  {
    id: 'srv-private',
    title: 'Private Labeling & Pack Customization',
    description: 'We process, sift, pack, and print your custom brand on clean, air-permeable poly bags and kraft packs.',
    iconName: 'Package',
    details: [
      'Heavy-duty double-layered woven poly packaging sacks',
      'Custom bilingual packaging design (Amharic, Afaan Oromoo, English)',
      'Accurate weights: 5kg, 10kg, 25kg, and 50kg wholesale sizes',
      'Pre-certified for regional export clearance and barcode registration'
    ],
    capacity: 'Packaging speed: Up to 50,000 sacks per day'
  },
  {
    id: 'srv-silo',
    title: 'Pneumatic Tanker & Heavy Rail Logistics',
    description: 'Advanced logistical pipelines delivering dry bulk grains via bulk railway cars and specialized pneumatic pressure discharging trailers.',
    iconName: 'Truck',
    details: [
      'Clean dry bulk trailers avoiding dust or moisture contact',
      'Coordinated transport from Arsi Eteya along the main rail route',
      'Real-time GPS security tracking and cargo condition monitors',
      'Scheduled priority discharge directly into commercial factory silos'
    ],
    capacity: 'Fleet dispatch potential: Up to 500 Metric Tons daily'
  },
  {
    id: 'srv-lab',
    title: 'Independent Crop Testing & Rheology',
    description: 'Our high-standard grain testing center performs accurate gluten, moisture, ash, and starch damage audits.',
    iconName: 'Activity',
    details: [
      'Official Farinograph and Alveograph dough stretching graphs',
      'Rapid falling number analysis for sprout damage assessment',
      'Authorized technical certification for safe export clearance',
      'Detailed grain protein and density reports'
    ],
    capacity: 'Standard sample diagnostic turn: 48 hours'
  }
];

export const INITIAL_STATS: FactoryStats = {
  foundedYear: '2008',
  dailyCapacity: '1,200 Metric Tons',
  activeDistributors: '450+ Licensed Wholesalers',
  countriesExported: 'East African Region (Djibouti, Kenya, Somalia, Sudan)',
  labCertifications: [
    'Ethiopian Standards Agency (ESA) Compliant',
    'ISO 22000:2018 Food Safety Certified',
    'HACCP Food Safety System Registered',
    'Oromia Agricultural Bureau Audited Quality',
    'SGS Mill Quality & Sanitation Rating: Grade A+'
  ]
};

export const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Yonas Gebremedhin',
    company: 'Sibable Commercial Bread Factory',
    email: 'yonas@sibablebread.com.et',
    phone: '+251 911 254 896',
    inquiryType: 'Bulk Orders',
    message: 'Greetings. We operate high-speed automated sandwich loaf lines in Adama. We require a steady weekly delivery of 40 metric tons of your Kena Superior Wheat Flour (Grade 1). Please send us the detailed ex-factory price sheets for Arsi Eteya and clarify transit shipping rates to our Adama depots.',
    status: 'New',
    date: '2026-06-14T09:30:00-07:00',
    notes: 'Assign sales manager to formulate Adama delivery schedule quoting current transport fee.'
  },
  {
    id: 'inq-2',
    name: 'Fatuma Mohammed',
    company: 'Fatuma Traditional Injera Enterprise',
    email: 'fatuma.mohammed@injerahub.com',
    phone: '+251 902 443 211',
    inquiryType: 'Technical Advisory',
    message: 'We prepare over 15,000 sourdough injeras daily for wholesale supply in Addis Ababa. We are eager to transition our entire flour procurement to your Premium Stoneground White Teff Flour because we need consistent wild yeast responses. Can we schedule a lab consultation to evaluate the moisture ratio for optimized auto-pouring machines?',
    status: 'Contacted',
    date: '2026-06-12T11:15:00-07:00',
    notes: 'Dr. Martha Jenkins called fatuma to arrange sample test. High-hydration test results sent to Addis Ababa office.'
  },
  {
    id: 'inq-3',
    name: 'Director of Procurement',
    company: 'East African Foods & Macaroni S.C.',
    email: 'procurement@eastafricanfoods.com',
    phone: '+251 912 888 777',
    inquiryType: 'Custom Blending',
    message: 'Looking for a premium durum wheat semolina supplier for our pasta lines in Mojo. We can order 300 Metric Tons monthly under contract if you can secure an Alveograph W strength index of 220 holding continuously. Please send us your laboratory quality parameters certificate.',
    status: 'Completed',
    date: '2026-06-05T08:00:00-07:00',
    notes: 'Mojo pasta lines verified first semolina batch. Standard contract signed. Logistics scheduled.'
  }
];
