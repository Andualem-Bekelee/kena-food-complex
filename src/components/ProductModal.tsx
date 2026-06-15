import React, { useState } from 'react';
import { Product } from '../types';
import { X, CheckCircle, Package, Layers, Info, Dumbbell, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BakingCalculator from './BakingCalculator';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'calculator'>('overview');

  if (!product) return null;

  // Extract initial hydration range for baker calculator
  const getInitialHydration = (absorptionStr: string): number => {
    const numbers = absorptionStr.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0], 10);
    }
    return 65; // fallback default
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Outer Container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl border border-stone-200"
          >
            {/* Header / Photo Banner */}
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-stone-900/60 hover:bg-stone-900/85 text-white p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                id="close-product-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white rounded-md mb-2">
                  {product.category}
                </span>
                <h3 className="text-xl md:text-3xl font-bold tracking-tight">{product.name}</h3>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="bg-stone-50 border-b border-stone-200 px-6 flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                  activeTab === 'overview'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-3.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                  activeTab === 'specs'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Technical Assay
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`py-3.5 px-4 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                  activeTab === 'calculator'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Baking Calculator
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              {/* OverView Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                      <Info className="w-4 h-4 text-amber-600" />
                      Product Profile
                    </h4>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed">
                      {product.longDescription || product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Key Specs Card */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                      <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-amber-600" /> Key Laboratory Parameters
                      </h5>
                      <div className="grid grid-cols-2 gap-3 font-mono text-xs text-stone-600">
                        <div className="bg-white p-2.5 rounded border border-stone-150">
                          <span className="text-[10px] text-stone-400 block font-sans">Min. Protein:</span>
                          <strong className="text-stone-900 text-sm font-bold block">{product.specs.protein}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-stone-150">
                          <span className="text-[10px] text-stone-400 block font-sans">Max. Mineral Ash:</span>
                          <strong className="text-stone-900 text-sm font-bold block">{product.specs.ash}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-stone-150">
                          <span className="text-[10px] text-stone-400 block font-sans">Water Absorption:</span>
                          <strong className="text-stone-900 text-xs font-bold block">{product.specs.absorption}</strong>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-stone-150">
                          <span className="text-[10px] text-stone-400 block font-sans">Alveograph W:</span>
                          <strong className="text-stone-900 text-xs font-bold block truncate">{product.specs.alveographW || 'Standard'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Applications & Formats */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600" /> Ideal Baking Applications
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {product.applications.map((app) => (
                            <span
                              key={app}
                              className="px-2.5 py-1 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-md font-medium"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-amber-600" /> Commercial Formats Available
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {product.packaging.map((pack) => (
                            <span
                              key={pack}
                              className="px-2.5 py-1 text-xs bg-stone-100 text-stone-700 border border-stone-200 rounded-md font-medium"
                            >
                              {pack}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-[11px] font-sans text-stone-400 block uppercase font-semibold">Bulk Representative Pricing</span>
                      <strong className="text-xl text-amber-800 font-mono">{product.price || 'Quotes on Inquiry'}</strong>
                    </div>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 active:bg-amber-900 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Open Dough Calculator
                    </button>
                  </div>
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-stone-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Layers className="w-4 h-4 text-amber-600" />
                      Laboratory Rheology Assay
                    </h4>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                      All milling lots undergo robust hourly laboratory testing. Our parameters ensure structural precision and baking yield consistency for automated mechanical production limits.
                    </p>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="min-w-full divide-y divide-stone-200 text-sm font-mono">
                      <thead className="bg-stone-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold font-sans text-stone-500 uppercase tracking-wider">Assay Parameter</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold font-sans text-stone-500 uppercase tracking-wider">Certified Target Value</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-bold font-sans text-stone-500 uppercase tracking-wider">Testing Methodology</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-stone-150">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-semibold text-xs font-sans">Organic Protein Index ( dry-matter % )</td>
                          <td className="px-6 py-4 whitespace-nowrap text-amber-800 font-bold">{product.specs.protein}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">NIR Spectroscopy (Dumas N × 5.7)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-semibold text-xs font-sans">Mineral Ash Residue Value</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-800 font-semibold">{product.specs.ash}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">Incineration Assay at 900°C (ISO 2171)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-semibold text-xs font-sans">Product Moisture Threshold</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-800 font-semibold">{product.specs.moisture}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">Standard Oven Drying desiccator</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-semibold text-xs font-sans">Brabender Water Absorption Limit</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-800 font-semibold">{product.specs.absorption}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">Brabender Farinograph kneading load</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-semibold text-xs font-sans">Chopin Alveograph Gluten Energy W</td>
                          <td className="px-6 py-4 whitespace-nowrap text-amber-800 font-bold">{product.specs.alveographW || 'Grade-Standard Whole'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-stone-400 text-xs">ISO 5530-4 Dough Air Inflation test</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex gap-3">
                    <Droplets className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold text-stone-800 block mb-0.5">Note on Gluten Rheological Characteristics:</strong>
                      <p className="text-xs text-stone-500 leading-relaxed font-sans">
                        Farinograph absorption targets correspond to standard ambient mixing (21°C). High speed dough spiral mixers or direct extrusion lines may experience slight deviations. Call our quality lab lines to coordinate custom enzyme adjustment parameters.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculator Tab */}
              {activeTab === 'calculator' && (
                <div>
                  <BakingCalculator
                    initialHydration={getInitialHydration(product.specs.absorption)}
                    productName={product.name}
                  />
                </div>
              )}
            </div>

            {/* Footer Close Actions */}
            <div className="bg-stone-50 px-6 py-4 flex justify-end border-t border-stone-200 gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Close Portal View
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
