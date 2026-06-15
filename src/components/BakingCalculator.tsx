import React, { useState, useMemo } from 'react';
import { Scale, RotateCcw, Sparkles } from 'lucide-react';

interface BakingCalculatorProps {
  initialHydration?: number;
  productName: string;
}

interface RecipePreset {
  name: string;
  hydration: number;
  salt: number;
  yeastOrStarter: number;
  starterType: 'Starter' | 'Instant Yeast';
}

export default function BakingCalculator({ initialHydration = 68, productName }: BakingCalculatorProps) {
  const [flourWeight, setFlourWeight] = useState<number>(1000);
  const [hydration, setHydration] = useState<number>(initialHydration);
  const [salt, setSalt] = useState<number>(2.0);
  const [starter, setStarter] = useState<number>(20.0);
  const [starterType, setStarterType] = useState<'Starter' | 'Instant Yeast'>('Starter');

  const presets: RecipePreset[] = useMemo(() => [
    { name: 'Rustic Sourdough', hydration: 72, salt: 2.0, yeastOrStarter: 20, starterType: 'Starter' },
    { name: 'Classic Baguette', hydration: 65, salt: 1.8, yeastOrStarter: 1.0, starterType: 'Instant Yeast' },
    { name: 'High Hydration Ciabatta', hydration: 80, salt: 2.2, yeastOrStarter: 1.5, starterType: 'Instant Yeast' },
    { name: 'Enriched Brioche/Bun', hydration: 55, salt: 1.5, yeastOrStarter: 10, starterType: 'Starter' },
  ], []);

  const applyPreset = (preset: RecipePreset) => {
    setHydration(preset.hydration);
    setSalt(preset.salt);
    setStarter(preset.yeastOrStarter);
    setStarterType(preset.starterType);
  };

  const results = useMemo(() => {
    const liquidW = (flourWeight * hydration) / 100;
    const saltW = (flourWeight * salt) / 100;
    const starterW = (flourWeight * starter) / 100;
    const totalW = flourWeight + liquidW + saltW + starterW;

    // Convert grams to ounces (1g = 0.035274 oz)
    const gToOz = (g: number) => (g * 0.035274).toFixed(1);

    return {
      liquid: { g: Math.round(liquidW), oz: gToOz(liquidW) },
      salt: { g: Math.round(saltW), oz: gToOz(saltW) },
      starter: { g: Math.round(starterW), oz: gToOz(starterW) },
      total: { g: Math.round(totalW), oz: gToOz(totalW) },
    };
  }, [flourWeight, hydration, salt, starter]);

  const resetCalculator = () => {
    setFlourWeight(1000);
    setHydration(initialHydration);
    setSalt(2.0);
    setStarter(20.0);
    setStarterType('Starter');
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 md:p-6" id="baking-calc">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Scale className="text-amber-600 w-5 h-5" />
          <h4 className="font-semibold text-stone-900 text-sm md:text-base">Artisanal Dough Formula Calculator</h4>
        </div>
        <button
          onClick={resetCalculator}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-600 transition-colors py-1 px-2 hover:bg-stone-100 rounded-lg"
          title="Reset back to default values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Specs
        </button>
      </div>

      <p className="text-xs text-stone-500 mb-4 leading-relaxed">
        Quickly compute exact baker percentages for <strong className="text-stone-700">{productName}</strong>. 
        Adjust flour mass and ratio parameters to scale your dough.
      </p>

      {/* Ratios Preset */}
      <div className="mb-5">
        <span className="text-xs font-medium text-stone-600 block mb-2">Apply Regional Baking Formula Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-amber-50 hover:border-amber-300 text-stone-700 border border-stone-200 rounded-lg transition-all"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls Column */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span>Primary Flour Mass:</span>
              <span className="text-amber-700 font-mono text-xs">{flourWeight}g ({ (flourWeight * 0.0352).toFixed(1) } oz)</span>
            </div>
            <input
              type="range"
              min="100"
              max="15000"
              step="50"
              value={flourWeight}
              onChange={(e) => setFlourWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>100g (Sample)</span>
              <span>15,000g (Bulk Test batch)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span>Liquid Hydration Target:</span>
              <span className="text-amber-700 font-mono text-xs">{hydration}%</span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="1"
              value={hydration}
              onChange={(e) => setHydration(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>40% (Stiff dough)</span>
              <span>95% (Ultra-Open Wet)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1.5">
              <span>Salt percentage:</span>
              <span className="text-amber-700 font-mono text-xs">{salt}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={salt}
              onChange={(e) => setSalt(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>0.5% (Low salt)</span>
              <span>4.0% (Salty/Preservative)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-700">Inoculation Agent:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStarterType('Starter'); setStarter(20); }}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold tracking-wide rounded ${
                    starterType === 'Starter' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  Sourdough
                </button>
                <button
                  onClick={() => { setStarterType('Instant Yeast'); setStarter(1.5); }}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold tracking-wide rounded ${
                    starterType === 'Instant Yeast' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  Commercial Yeast
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
              <span>{starterType} Percentage:</span>
              <span className="text-amber-700 font-mono text-xs">{starter}%</span>
            </div>
            <input
              type="range"
              min={starterType === 'Starter' ? '5.0' : '0.1'}
              max={starterType === 'Starter' ? '40.0' : '4.0'}
              step={starterType === 'Starter' ? '1.0' : '0.1'}
              value={starter}
              onChange={(e) => setStarter(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Output Weight Card Column */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <span className="text-xs font-semibold text-stone-800 tracking-wider uppercase block mb-3 border-b border-stone-100 pb-1.5">
            Dough Mass Breakdowns
          </span>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">🌾 Premium Flour:</span>
              <div className="text-right font-mono">
                <span className="text-stone-900 font-semibold">{flourWeight}g</span>
                <span className="text-stone-400 text-[10px] ml-1.5">100%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">💧 Pure Water:</span>
              <div className="text-right font-mono">
                <span className="text-stone-900 font-semibold">{results.liquid.g}g</span>
                <span className="text-stone-400 text-[10px] ml-1.5">{hydration}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">🧂 Sea Salt:</span>
              <div className="text-right font-mono">
                <span className="text-stone-900 font-semibold">{results.salt.g}g</span>
                <span className="text-stone-400 text-[10px] ml-1.5">{salt}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">🦠 {starterType}:</span>
              <div className="text-right font-mono">
                <span className="text-stone-900 font-semibold">{results.starter.g}g</span>
                <span className="text-stone-400 text-[10px] ml-1.5">{starter}%</span>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3 mt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">📦 Total Dough Mass:</span>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-700 font-mono">{results.total.g}g</span>
                <span className="text-stone-400 text-[10px] font-mono block">({results.total.oz} oz)</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-2.5 mt-4 border border-amber-100 flex items-start gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 leading-normal">
              <strong>Milling Advice:</strong> This hydration ratio is calculated relative to dry flour mass. 
              {hydration > 72 ? " High-hydration formulas perform best when using long, temperature-controlled cold fermentations (14 - 18 hours)." : " Standard hydration levels allow rapid scaling and quick pan proofing."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
