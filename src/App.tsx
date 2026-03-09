import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Wizard from './components/Wizard';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProjectsGallery from './components/ProjectsGallery';
import { generateBrand } from './services/api';
import { BrandBrief, BrandPackage } from './types';
import { Sparkles, UserCircle } from 'lucide-react';

type AppState = 'login' | 'gallery' | 'wizard' | 'loading' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [brandPackage, setBrandPackage] = useState<BrandPackage | null>(null);
  const [draftBrief, setDraftBrief] = useState<Partial<BrandBrief> | undefined>(undefined);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAppState('gallery');
      } else {
        setAppState('login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBriefSubmit = async (brief: BrandBrief) => {
    setAppState('loading');
    setDraftBrief(brief);
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

  const handleSaveProject = async () => {
    if (!user) {
      alert("Debes iniciar sesión para poder guardar.");
      setAppState('login');
      return;
    }
    if (!brandPackage || !draftBrief) return;
    
    try {
      // Firebase no admite valores 'undefined', así que limpiamos el objeto
      const safeBrief = JSON.parse(JSON.stringify(draftBrief));
      const safeResult = JSON.parse(JSON.stringify(brandPackage));

      await addDoc(collection(db, "projects"), {
        userId: user.uid,
        brief: safeBrief,
        result: safeResult,
        createdAt: Date.now()
      });
      alert("¡Proyecto guardado en tu galería!");
    } catch (dbErr) {
      console.error("Error saving to database:", dbErr);
      alert("Hubo un problema al guardar el proyecto.");
    }
  };

  const handleRegenerateLogos = async () => {
    if (!draftBrief) return;
    setAppState('loading');
    try {
      const result = await generateBrand(draftBrief as BrandBrief);
      setBrandPackage(result);
      setAppState('dashboard');
    } catch (error) {
      console.error("Error regenerating logos:", error);
      setAppState('dashboard');
      alert("Hubo un error al regenerar los logos.");
    }
  };

  const handleReset = () => {
    setBrandPackage(null);
    setDraftBrief(undefined);
    setAppState('gallery'); // Back to gallery instead of wizard
  };

  const handleEdit = () => {
    setAppState('wizard');
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleOpenProject = (brief: BrandBrief, result: BrandPackage) => {
    setDraftBrief(brief);
    setBrandPackage(result);
    setAppState('dashboard');
  };

  // If initial load auth check
  if (appState === 'loading' && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      {/* Simple Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-10 transition-all">
        <div 
          className={`flex items-center gap-2 ${user ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={() => user && setAppState('gallery')}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Brand OS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-medium px-2 py-1 bg-white/10 rounded text-gray-300 uppercase tracking-widest hidden md:block">
            MVP Preview
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full pl-1 pr-3 py-1 shadow-sm">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" />
              ) : (
                <UserCircle className="w-6 h-6 text-gray-400" />
              )}
              <span className="text-xs font-medium truncate max-w-[100px]">{user.displayName?.split(' ')[0] || 'Usuario'}</span>
            </div>
          )}
        </div>
      </header>

      <main className="p-6 md:p-12">
        <AnimatePresence mode="wait">
          {appState === 'login' && (
            <Login onLoginSuccess={() => setAppState('gallery')} />
          )}

          {appState === 'gallery' && (
            <ProjectsGallery 
              onNewProject={() => { setDraftBrief(undefined); setAppState('wizard'); }} 
              onOpenProject={handleOpenProject} 
              onLogout={handleLogout} 
            />
          )}

          {appState === 'wizard' && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="text-center mb-10 max-w-xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-white">
                  Tu agencia de branding, <br/><span className="text-gray-500">en una plataforma.</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Completa el brief y deja que nuestra IA genere tu estrategia, identidad visual y lineamientos en segundos.
                </p>
              </div>
              <Wizard onSubmit={handleBriefSubmit} initialData={draftBrief} />
            </motion.div>
          )}

          {appState === 'loading' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 text-white">Generando Magia...</h2>
              <div className="h-6 overflow-hidden relative w-72 text-center">
                <motion.div
                  animate={{ y: [0, -24, -48, -72, -96, -120, -144] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                  className="text-gray-400"
                >
                  <p className="h-6">Analizando el brief premium...</p>
                  <p className="h-6">Definiendo arquetipo y voz...</p>
                  <p className="h-6">Creando variantes de logo...</p>
                  <p className="h-6">Seleccionando tipografías...</p>
                  <p className="h-6">Ajustando sistema de color...</p>
                  <p className="h-6">Generando mockups visuales...</p>
                  <p className="h-6">Guardando proyecto en la nube...</p>
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
              <Dashboard 
                brand={brandPackage} 
                onReset={handleReset} 
                onEdit={handleEdit} 
                onSave={user ? handleSaveProject : undefined}
                onRegenerateLogos={handleRegenerateLogos}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
