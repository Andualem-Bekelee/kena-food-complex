import React, { useState } from 'react';
import { Product, NewsArticle, ContactInquiry, FactoryStats, ProductCategory, NewsCategory, InquiryStatus } from '../types';
import { X, Lock, Key, Check, Users, ShoppingCart, Plus, Trash2, Edit, Save, Globe, Award, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  news: NewsArticle[];
  setNews: (n: NewsArticle[]) => void;
  inquiries: ContactInquiry[];
  setInquiries: (i: ContactInquiry[]) => void;
  stats: FactoryStats;
  setStats: (s: FactoryStats) => void;
}

export default function AdminPortal({
  isOpen,
  onClose,
  products,
  setProducts,
  news,
  setNews,
  inquiries,
  setInquiries,
  stats,
  setStats,
}: AdminPortalProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'inquiries' | 'products' | 'news' | 'stats'>('inquiries');

  // CMS Form States - Product
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'Artisanal Breads',
    description: '',
    longDescription: '',
    specs: { protein: '12%', ash: '0.50%', moisture: '14.0%', absorption: '60%' },
    applications: [],
    packaging: ['25kg Bakery Sack'],
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200',
    status: 'available',
    price: '$600 / Ton'
  });

  // CMS Form States - News
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Omit<NewsArticle, 'id' | 'date'>>({
    title: '',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    author: 'Kena Press Feed',
    category: 'Press Release'
  });

  // Inquiry selected view
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'factory2026') {
      setIsAuthorized(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect administrative credentials. Access Denied.');
    }
  };

  // Inquiry handlers
  const handleInquiryStatusChange = (id: string, nextStatus: InquiryStatus) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: nextStatus } : inq));
    setInquiries(updated);
    localStorage.setItem('kena_food_inquiries', JSON.stringify(updated));
  };

  const handleInquiryNoteChange = (id: string, notes: string) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, notes } : inq));
    setInquiries(updated);
    localStorage.setItem('kena_food_inquiries', JSON.stringify(updated));
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this contact lead inquiry?')) {
      const filtered = inquiries.filter((inq) => inq.id !== id);
      setInquiries(filtered);
      localStorage.setItem('kena_food_inquiries', JSON.stringify(filtered));
      if (selectedInquiryId === id) setSelectedInquiryId(null);
    }
  };

  // Product CRUD
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      // Edit mode
      const updated = products.map((p) =>
        p.id === editingProductId ? { ...p, ...prodForm, specs: { ...prodForm.specs } } : p
      );
      setProducts(updated);
      localStorage.setItem('kena_food_products', JSON.stringify(updated));
      setEditingProductId(null);
    } else {
      // Create mode
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...prodForm,
        specs: { ...prodForm.specs }
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem('kena_food_products', JSON.stringify(updated));
      setIsAddingProduct(false);
    }
    resetProductForm();
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      category: p.category,
      description: p.description,
      longDescription: p.longDescription || '',
      specs: { ...p.specs },
      applications: [...p.applications],
      packaging: [...p.packaging],
      imageUrl: p.imageUrl,
      status: p.status,
      price: p.price || ''
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to permanently remove this product from the catalog?')) {
      const filtered = products.filter((p) => p.id !== id);
      setProducts(filtered);
      localStorage.setItem('kena_food_products', JSON.stringify(filtered));
    }
  };

  const resetProductForm = () => {
    setProdForm({
      name: '',
      category: 'Artisanal Breads',
      description: '',
      longDescription: '',
      specs: { protein: '12%', ash: '0.50%', moisture: '14.0%', absorption: '62%' },
      applications: [],
      packaging: ['25kg Bakery Sack'],
      imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1200',
      status: 'available',
      price: '$600 / Ton'
    });
  };

  // News CRUD
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const newArticle: NewsArticle = {
      id: `news-${Date.now()}`,
      ...newsForm,
      date: formattedDate
    };
    const updated = [newArticle, ...news];
    setNews(updated);
    localStorage.setItem('kena_food_news', JSON.stringify(updated));
    setIsAddingNews(false);
    setNewsForm({
      title: '',
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      author: 'Kena Press Feed',
      category: 'Press Release'
    });
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Are you sure you want to delete this news article?')) {
      const filtered = news.filter((n) => n.id !== id);
      setNews(filtered);
      localStorage.setItem('kena_food_news', JSON.stringify(filtered));
    }
  };

  // Stats save
  const handleUpdateStats = (field: keyof FactoryStats, val: any) => {
    const updated = { ...stats, [field]: val };
    setStats(updated);
    localStorage.setItem('kena_food_stats', JSON.stringify(updated));
  };

  const handleUpdateCertification = (idx: number, text: string) => {
    const nextCert = [...stats.labCertifications];
    nextCert[idx] = text;
    handleUpdateStats('labCertifications', nextCert);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Black backdrop overlay */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6 md:p-10">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-5xl border border-stone-200 h-[85vh] flex flex-col">
          
          {/* Header */}
          <div className="bg-stone-900 p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono">Kena Food Mill Controls Panel</h3>
                <span className="text-[10px] text-stone-400">Restricted secure administrator database access</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all focus:outline-none"
              id="close-admin-panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Secure Authorization Screen if not authorized */}
          {!isAuthorized ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-50 text-center">
              <div className="bg-white border border-stone-200 p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
                  <Key className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-base mb-1.5">Enter Admin Password</h4>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Provide credentials config target. The standard demo credentials password is: <code className="bg-stone-100 text-amber-800 px-1 font-mono rounded">factory2026</code>
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-3 border border-stone-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none placeholder-stone-400"
                      autoFocus
                    />
                  </div>
                  {errorMsg && <p className="text-[10px] bg-red-50 text-red-700 font-semibold p-2.5 rounded-lg border border-red-100">{errorMsg}</p>}
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    id="submit-admin-password"
                  >
                    Authenticate Access
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Authorized Panel View */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left tab sidebar */}
              <div className="bg-stone-50 border-r border-stone-200 md:w-56 shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`flex-1 md:flex-none py-3 px-4 text-left text-xs font-semibold tracking-wider flex items-center gap-2 border-b md:border-b-0 md:border-l-4 transition-all whitespace-nowrap focus:outline-none ${
                    activeTab === 'inquiries'
                      ? 'bg-white border-b-2 md:border-b-0 border-amber-600 md:border-l-amber-600 text-amber-800'
                      : 'border-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  CRM leads ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex-1 md:flex-none py-3 px-4 text-left text-xs font-semibold tracking-wider flex items-center gap-2 border-b md:border-b-0 md:border-l-4 transition-all whitespace-nowrap focus:outline-none ${
                    activeTab === 'products'
                      ? 'bg-white border-b-2 md:border-b-0 border-amber-600 md:border-l-amber-600 text-amber-800'
                      : 'border-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Product CMS ({products.length})
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`flex-1 md:flex-none py-3 px-4 text-left text-xs font-semibold tracking-wider flex items-center gap-2 border-b md:border-b-0 md:border-l-4 transition-all whitespace-nowrap focus:outline-none ${
                    activeTab === 'news'
                      ? 'bg-white border-b-2 md:border-b-0 border-amber-600 md:border-l-amber-600 text-amber-800'
                      : 'border-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  News Announcements ({news.length})
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 md:flex-none py-3 px-4 text-left text-xs font-semibold tracking-wider flex items-center gap-2 border-b md:border-b-0 md:border-l-4 transition-all whitespace-nowrap focus:outline-none ${
                    activeTab === 'stats'
                      ? 'bg-white border-b-2 md:border-b-0 border-amber-600 md:border-l-amber-600 text-amber-800'
                      : 'border-transparent text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Factory Settings
                </button>
              </div>

              {/* Main inner dynamic tab container */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                
                {/* 1. INQUIRIES TAB (CRM) */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-200 pb-4 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h4 className="text-base font-bold text-stone-900">Submitted Client Inquiries</h4>
                        <p className="text-[11px] text-stone-500">Track and respond to commercial dough factory requests and B2B orders.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                      {/* Left side inquiries registry */}
                      <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-150 bg-white">
                        {inquiries.length === 0 ? (
                          <p className="text-center py-8 text-stone-400 text-xs font-medium">No customer inquiries submitted yet.</p>
                        ) : (
                          inquiries.map((inq) => (
                            <button
                              key={inq.id}
                              onClick={() => setSelectedInquiryId(inq.id)}
                              className={`w-full p-4 text-left transition-colors flex items-start gap-3 hover:bg-stone-50 ${
                                selectedInquiryId === inq.id ? 'bg-amber-50/50' : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-stone-950 text-xs block truncate">{inq.name}</span>
                                  <span className="text-[9px] text-stone-400 font-mono tracking-wider">
                                    {new Date(inq.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <span className="text-[10px] text-stone-500 block font-sans truncate mb-2">
                                  {inq.company ? `${inq.company}` : 'Private Baker'}
                                </span>
                                
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-1.5 py-0.5 bg-stone-100 text-[9px] font-bold text-stone-600 rounded">
                                    {inq.inquiryType}
                                  </span>
                                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                    inq.status === 'New' ? 'bg-blue-600 text-white' :
                                    inq.status === 'Contacted' ? 'bg-sky-500 text-white' :
                                    inq.status === 'Completed' ? 'bg-emerald-600 text-white' :
                                    'bg-stone-500 text-white'
                                  }`}>
                                    {inq.status}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>

                      {/* Right side lead editor details card */}
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                        {selectedInquiryId ? (() => {
                          const inq = inquiries.find((i) => i.id === selectedInquiryId);
                          if (!inq) return <p className="text-xs text-stone-400">Select an inquiry to view details.</p>;
                          return (
                            <div className="space-y-4">
                              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                                <div>
                                  <h5 className="font-bold text-stone-900 text-sm">{inq.name}</h5>
                                  <p className="text-xs text-amber-700 font-semibold">{inq.company || 'Home Artisan Baker'}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="text-stone-400 hover:text-red-600 p-1 rounded-lg hover:bg-white transition-all cursor-pointer"
                                  title="Delete inquiry entry"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-stone-400 block font-semibold uppercase">Email:</span>
                                  <a href={`mailto:${inq.email}`} className="text-amber-800 break-all font-semibold font-mono underline hover:text-amber-900">
                                    {inq.email}
                                  </a>
                                </div>
                                <div>
                                  <span className="text-[10px] text-stone-400 block font-semibold uppercase">Phone:</span>
                                  <span className="text-stone-700 font-semibold font-mono">{inq.phone || 'N/A'}</span>
                                </div>
                              </div>

                              <div className="text-xs">
                                <span className="text-[10px] text-stone-400 block font-semibold uppercase mb-1">Status Action:</span>
                                <select
                                  value={inq.status}
                                  onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as InquiryStatus)}
                                  className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white font-semibold text-stone-700 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                >
                                  <option value="New">🔵 New Prospect</option>
                                  <option value="Contacted">🟡 Contacted/Rep</option>
                                  <option value="Completed">🟢 Agreement Closed</option>
                                  <option value="Archived">⚪ Archived</option>
                                </select>
                              </div>

                              <div className="bg-white border border-stone-200 p-3.5 rounded-lg">
                                <span className="text-[9px] font-bold text-stone-400 tracking-wider block uppercase mb-1">Corporate Client Message:</span>
                                <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                              </div>

                              <div>
                                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider mb-1.5">Internal Executive Notes (Auto-saved):</span>
                                <textarea
                                  value={inq.notes || ''}
                                  onChange={(e) => handleInquiryNoteChange(inq.id, e.target.value)}
                                  rows={3}
                                  placeholder="Type followup steps, milling dispatch coordinates, custom enzyme blends targets..."
                                  className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500"
                                />
                              </div>
                            </div>
                          );
                        })() : (
                          <div className="py-12 text-center">
                            <Lock className="w-8 h-8 text-stone-400 mx-auto mb-2.5" />
                            <p className="text-xs font-medium text-stone-500">Select a lead registry entry to view message context, manage status, and apply internal notes.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PRODUCTS TAB (CMS) */}
                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-base font-bold text-stone-900">Manage Product Catalog</h4>
                        <p className="text-[11px] text-stone-500">Add, edit, or delete flour lines and adjust protein and ash indices.</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingProductId(null);
                          resetProductForm();
                          setIsAddingProduct(!isAddingProduct);
                        }}
                        className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        {isAddingProduct ? 'Collapse' : 'Add New Flour'}
                      </button>
                    </div>

                    {isAddingProduct && (
                      <form onSubmit={handleSaveProduct} className="bg-stone-50 border border-amber-100 rounded-xl p-5 space-y-4">
                        <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2 text-amber-800">
                          {editingProductId ? '✏️ Edit Product Specifications' : '✨ Formulate New Flour Line'}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Product Name / Grade:</label>
                              <input
                                type="text"
                                required
                                value={prodForm.name}
                                onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                                placeholder="e.g. Imperial High-Gluten Type 0"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Category Classification:</label>
                              <select
                                value={prodForm.category}
                                onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as ProductCategory })}
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              >
                                <option value="Artisanal Breads">Artisanal Breads</option>
                                <option value="Pastries & Biscuits">Pastries & Biscuits</option>
                                <option value="Industrial Milling">Industrial Milling</option>
                                <option value="Semolina & Specialty">Semolina & Specialty</option>
                                <option value="Organic Whole Grain">Organic Whole Grain</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Catalog Description:</label>
                              <textarea
                                value={prodForm.description}
                                required
                                onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                                placeholder="Describe texture application bounds..."
                                rows={2}
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Protein Index ( dry% ):</label>
                              <input
                                type="text"
                                required
                                value={prodForm.specs.protein}
                                onChange={(e) => setProdForm({ ...prodForm, specs: { ...prodForm.specs, protein: e.target.value } })}
                                placeholder="e.g. 14.5%"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Moisture Integrity Range:</label>
                              <input
                                type="text"
                                required
                                value={prodForm.specs.moisture}
                                onChange={(e) => setProdForm({ ...prodForm, specs: { ...prodForm.specs, moisture: e.target.value } })}
                                placeholder="e.g. 13.8%"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Oven Ash Residue Index:</label>
                              <input
                                type="text"
                                required
                                value={prodForm.specs.ash}
                                onChange={(e) => setProdForm({ ...prodForm, specs: { ...prodForm.specs, ash: e.target.value } })}
                                placeholder="e.g. 0.52%"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Brabender Water Absorption (%):</label>
                              <input
                                type="text"
                                required
                                value={prodForm.specs.absorption}
                                onChange={(e) => setProdForm({ ...prodForm, specs: { ...prodForm.specs, absorption: e.target.value } })}
                                placeholder="e.g. 68% - 72%"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Chopin Alveograph W Strength:</label>
                              <input
                                type="text"
                                value={prodForm.specs.alveographW || ''}
                                onChange={(e) => setProdForm({ ...prodForm, specs: { ...prodForm.specs, alveographW: e.target.value } })}
                                placeholder="e.g. 380 - 410"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">B2B Reference Price / Ton Guideline:</label>
                          <input
                            type="text"
                            value={prodForm.price}
                            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                            placeholder="e.g. $640 / Metric Ton (B2B Bulk)"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                          <button
                            type="button"
                            onClick={() => { setIsAddingProduct(false); setEditingProductId(null); resetProductForm(); }}
                            className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
                          >
                            Cancel Changes
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            {editingProductId ? 'Update specifications' : 'Publish catalog page'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Product listings list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((p) => (
                        <div key={p.id} className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs flex items-center gap-4 justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-lg border border-stone-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-amber-700 block uppercase tracking-wider">{p.category}</span>
                              <h5 className="font-bold text-stone-900 text-xs truncate leading-normal">{p.name}</h5>
                              <span className="text-[10px] text-stone-500 font-mono">Prot: {p.specs.protein} | W: {p.specs.alveographW || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-stone-50 rounded-lg transition-all cursor-pointer"
                              title="Edit specifications"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-stone-50 rounded-lg transition-all cursor-pointer"
                              title="Delete model line"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. NEWS TAB (Announcements publisher) */}
                {activeTab === 'news' && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-base font-bold text-stone-900">Milling announcements & press releases</h4>
                        <p className="text-[11px] text-stone-500">Publish news feeds, lab updates, or weather rheology reports.</p>
                      </div>
                      <button
                        onClick={() => setIsAddingNews(!isAddingNews)}
                        className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        {isAddingNews ? 'Hide Publisher' : 'Write Press Release'}
                      </button>
                    </div>

                    {isAddingNews && (
                      <form onSubmit={handleSaveNews} className="bg-stone-50 border border-amber-100 rounded-xl p-5 space-y-4">
                        <h5 className="font-bold text-stone-950 text-xs uppercase tracking-wider text-amber-800">
                          📰 Write corporate announcement
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Headline title:</label>
                            <input
                              type="text"
                              required
                              value={newsForm.title}
                              onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                              placeholder="e.g. Sustainable Silo Technology Initiative Awarded"
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Author byline:</label>
                              <input
                                type="text"
                                required
                                value={newsForm.author}
                                onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                                placeholder="Dieter Schultheiss, Operations"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Press category:</label>
                              <select
                                value={newsForm.category}
                                onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as NewsCategory })}
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                              >
                                <option value="Press Release">Press Release</option>
                                <option value="Market Report">Market Report</option>
                                <option value="Technical Article">Technical Article</option>
                                <option value="Seasonal Update">Seasonal Update</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Brief digest/Summary:</label>
                            <input
                              type="text"
                              required
                              value={newsForm.summary}
                              onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                              placeholder="A short single sentence description of this announcement target indices..."
                              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Main rich content body:</label>
                            <textarea
                              value={newsForm.content}
                              required
                              onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                              placeholder="Type complete details of news story here..."
                              rows={5}
                              className="w-full px-3 py-2 bg-white border border-stone-300 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                          <button
                            type="button"
                            onClick={() => setIsAddingNews(false)}
                            className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
                          >
                            Cancel and Close
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            Publish announcement live
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3">
                      {news.map((item) => (
                        <div key={item.id} className="bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[9px] font-bold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                              <span className="text-[9px] text-stone-400 font-mono">{item.date}</span>
                            </div>
                            <h5 className="font-bold text-stone-900 text-xs truncate leading-normal">{item.title}</h5>
                            <span className="text-[10px] text-stone-400 block truncate font-sans">By {item.author}</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="text-stone-400 hover:text-red-700 hover:bg-stone-50 p-2 rounded-lg transition-all shrink-0 cursor-pointer"
                            title="Delete news article"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. STATS TAB (Factory Settings) */}
                {activeTab === 'stats' && (
                  <div className="space-y-6">
                    <div className="border-b border-stone-200 pb-4">
                      <h4 className="text-base font-bold text-stone-900">Factory stats and certificates registry</h4>
                      <p className="text-[11px] text-stone-500">Edit general statistics and laboratory standard certifications displayed across the visitor home landing pages.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 border border-stone-200 p-5 rounded-xl">
                      <div className="space-y-4">
                        <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2 text-amber-800">
                          🚜 Facility Live Metrics
                        </h5>
                        
                        <div>
                          <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Milling capacity metric / Day:</label>
                          <input
                            type="text"
                            value={stats.dailyCapacity}
                            onChange={(e) => handleUpdateStats('dailyCapacity', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Active Distributors globally:</label>
                          <input
                            type="text"
                            value={stats.activeDistributors}
                            onChange={(e) => handleUpdateStats('activeDistributors', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Active Export Markets Countries:</label>
                          <input
                            type="text"
                            value={stats.countriesExported}
                            onChange={(e) => handleUpdateStats('countriesExported', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-stone-500 font-bold block uppercase mb-1">Mill establishment Year:</label>
                          <input
                            type="text"
                            value={stats.foundedYear}
                            onChange={(e) => handleUpdateStats('foundedYear', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2 text-amber-800">
                          🛡️ Audited Laboratory Certifications
                        </h5>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          These represent standard independent audits displaying in the footer trust segments. Updates save immediately.
                        </p>
                        
                        <div className="space-y-2">
                          {stats.labCertifications.map((cert, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="w-5 h-5 bg-stone-200 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-1">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={cert}
                                onChange={(e) => handleUpdateCertification(idx, e.target.value)}
                                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-700"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Footer message panel status */}
          <div className="bg-stone-100 px-6 py-3 shrink-0 text-right text-[10px] font-mono text-stone-400 border-t border-stone-200 flex justify-between items-center">
            <span>Server protocol: <code>TLS 1.3 / HTTP/2</code></span>
            <span>Last synchronized: 2026-06-15 01:53 MST</span>
          </div>

        </div>
      </div>
    </div>
  );
}
