import React from 'react';
import { motion } from 'motion/react';
import { BrandPackage } from '../types';
import { Download, Copy, RefreshCw, LayoutTemplate, MessageSquare, Target, Palette } from 'lucide-react';

interface DashboardProps {
  brand: BrandPackage;
  onReset: () => void;
}

export default function Dashboard({ brand, onReset }: DashboardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast here
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Brand Portal</h1>
          <p className="text-gray-500 mt-1">Tu identidad generada por IA, lista para usar.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Nuevo Brief
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar Assets
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Strategy & Verbal */}
        <div className="space-y-8 lg:col-span-1">
          <Section title="Estrategia" icon={<Target className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <Label>Arquetipo</Label>
                <p className="font-medium">{brand.strategy.archetype}</p>
              </div>
              <div>
                <Label>Propuesta de Valor</Label>
                <p className="text-sm text-gray-700 leading-relaxed">{brand.strategy.value_proposition}</p>
              </div>
              <div>
                <Label>Tagline</Label>
                <p className="text-lg font-display font-semibold italic text-gray-900">"{brand.strategy.tagline}"</p>
              </div>
            </div>
          </Section>

          <Section title="Identidad Verbal" icon={<MessageSquare className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <Label>Tono de Voz</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {brand.verbal_identity.tone.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-emerald-600">Sí decir</Label>
                  <ul className="text-sm space-y-1 mt-1">
                    {brand.verbal_identity.do_say.map((word, i) => <li key={i} className="flex items-center before:content-['+'] before:mr-2 before:text-emerald-500">{word}</li>)}
                  </ul>
                </div>
                <div>
                  <Label className="text-rose-600">No decir</Label>
                  <ul className="text-sm space-y-1 mt-1">
                    {brand.verbal_identity.dont_say.map((word, i) => <li key={i} className="flex items-center before:content-['-'] before:mr-2 before:text-rose-500">{word}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Visual Identity */}
        <div className="space-y-8 lg:col-span-2">
          <Section title="Logotipo" icon={<LayoutTemplate className="w-5 h-5" />} className="bg-white">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Light Mode Logo */}
              <div 
                className="flex-1 h-48 rounded-xl flex items-center justify-center p-8 border border-gray-100 relative group"
                style={{ backgroundColor: brand.visual_identity.colors.background }}
              >
                <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-gray-400">Light</div>
                <div className="w-full max-w-[200px]" dangerouslySetInnerHTML={{ __html: brand.visual_identity.logo.svg_content }} />
                <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/80 backdrop-blur rounded-md shadow-sm text-gray-600 hover:text-black">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              {/* Dark Mode Logo */}
              <div 
                className="flex-1 h-48 rounded-xl flex items-center justify-center p-8 relative group"
                style={{ backgroundColor: brand.visual_identity.colors.secondary }}
              >
                <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-white/50">Dark</div>
                {/* Simple hack to invert text color for dark mode preview */}
                <div className="w-full max-w-[200px] [&_text]:!fill-white" dangerouslySetInnerHTML={{ __html: brand.visual_identity.logo.svg_content }} />
                <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/50 backdrop-blur rounded-md text-white hover:bg-black/70">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Paleta de Colores" icon={<Palette className="w-5 h-5" />}>
              <div className="space-y-3">
                {Object.entries(brand.visual_identity.colors).map(([name, hex]) => (
                  <div key={name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: hex }}></div>
                      <div>
                        <p className="text-sm font-medium capitalize">{name}</p>
                        <p className="text-xs font-mono text-gray-500">{hex}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(hex)}
                      className="p-2 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-all"
                      title="Copiar HEX"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Tipografía" icon={<span className="font-serif italic text-lg leading-none">Aa</span>}>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <Label>Títulos (Heading)</Label>
                    <span className="text-xs font-mono text-gray-500">{brand.visual_identity.typography.heading.family}</span>
                  </div>
                  <p className="text-3xl font-display text-gray-900" style={{ fontFamily: brand.visual_identity.typography.heading.family }}>
                    Agilidad y Diseño.
                  </p>
                </div>
                <div className="h-px w-full bg-gray-100"></div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <Label>Cuerpo (Body)</Label>
                    <span className="text-xs font-mono text-gray-500">{brand.visual_identity.typography.body.family}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: brand.visual_identity.typography.body.family }}>
                    La tipografía de cuerpo debe ser altamente legible en tamaños pequeños. Se utiliza para párrafos largos, descripciones y elementos de interfaz de usuario.
                  </p>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, className = "bg-white" }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
        <div className="text-gray-400">{icon}</div>
        <h3 className="font-display font-semibold text-lg">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Label({ children, className = "text-gray-500" }: { children: React.ReactNode, className?: string }) {
  return <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 ${className}`}>{children}</h4>;
}
