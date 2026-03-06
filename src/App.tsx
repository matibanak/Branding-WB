import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Wizard from './components/Wizard';
import Dashboard from './components/Dashboard';
import { generateBrand } from './services/api';
import { BrandBrief, BrandPackage } from './types';
import { Sparkles } from 'lucide-react';

type AppState = 'wizard' | 'loading' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('wizard');
  const [brandPackage, setBrandPackage] = useState<BrandPackage | null>(null);

  const handleBriefSubmit = async (brief: BrandBrief) => {
    setAppState('loading');
    try {
      const result = await generateBrand(brief);
      setBrandPackage(result);
      setAppState('dashboard');
    } catch (error) {
      console.error("Error generating brand:", error);
      setAppState('wizard');
      alert("Hubo un error al generar la marca. Intenta de nuevo.");
    }
  };

  const handleReset = () => {
    setBrandPackage(null);
    setAppState('wizard');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Simple Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Brand OS</span>
        </div>
        <div className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase tracking-widest">
          MVP Preview
        </div>
      </header>

      <main className="p-6 md:p-12">
        <AnimatePresence mode="wait">
          {appState === 'wizard' && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="text-center mb-10 max-w-xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                  Tu agencia de branding, <br/><span className="text-gray-400">en una plataforma.</span>
                </h1>
                <p className="text-gray-500 text-lg">
                  Completa el brief y deja que nuestra IA genere tu estrategia, identidad visual y lineamientos en segundos.
                </p>
              </div>
              <Wizard onSubmit={handleBriefSubmit} />
            </motion.div>
          )}

          {appState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Generando Magia...</h2>
              <div className="h-6 overflow-hidden relative w-64 text-center">
                <motion.div
                  animate={{ y: [0, -24, -48, -72, -96] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-gray-500"
                >
                  <p className="h-6">Analizando el brief...</p>
                  <p className="h-6">Definiendo arquetipo de marca...</p>
                  <p className="h-6">Seleccionando tipografías...</p>
                  <p className="h-6">Calculando contraste de colores...</p>
                  <p className="h-6">Ensamblando SVG...</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {appState === 'dashboard' && brandPackage && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard brand={brandPackage} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
