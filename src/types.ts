export type ProductCategory =
  | 'Artisanal Breads'
  | 'Pastries & Biscuits'
  | 'Industrial Milling'
  | 'Semolina & Specialty'
  | 'Organic Whole Grain';

export interface ProductSpecs {
  protein: string;
  ash: string;
  moisture: string;
  absorption: string;
  alveographW?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  longDescription?: string;
  specs: ProductSpecs;
  applications: string[];
  packaging: string[];
  imageUrl: string;
  status: 'available' | 'low-stock' | 'discontinued';
  price?: string; // B2B quote guidance
}

export type NewsCategory = 'Press Release' | 'Market Report' | 'Technical Article' | 'Seasonal Update';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  category: NewsCategory;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // maps to a Lucide icon string
  details: string[];
  capacity?: string;
}

export type InquiryType =
  | 'General'
  | 'Bulk Orders'
  | 'Custom Blending'
  | 'Distributor Application'
  | 'Technical Advisory';

export type InquiryStatus = 'New' | 'Contacted' | 'Completed' | 'Archived';

export interface ContactInquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  inquiryType: InquiryType;
  message: string;
  status: InquiryStatus;
  date: string;
  notes?: string;
}

export interface FactoryStats {
  foundedYear: string;
  dailyCapacity: string;
  activeDistributors: string;
  countriesExported: string;
  labCertifications: string[];
}
