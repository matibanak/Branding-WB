import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrandPackage } from '../types';
import { Download, Copy, RefreshCw, LayoutTemplate, MessageSquare, Target, Palette, Megaphone, Image as ImageIcon, Edit3 } from 'lucide-react';

interface DashboardProps {
  brand: BrandPackage;
  onReset: () => void;
  onEdit: () => void;
  onSave?: () => void;
  onRegenerateLogos?: () => void;
}

export default function Dashboard({ brand, onReset, onEdit, onSave, onRegenerateLogos }: DashboardProps) {
  const [activePairingIdx, setActivePairingIdx] = useState(0);
  const [selectedLogoIdx, setSelectedLogoIdx] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSvg = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadImage = (base64Url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAssets = () => {
    brand.visual_identity.logos.forEach(logo => {
      if (logo.image_url) {
        downloadImage(logo.image_url, `logo-${logo.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`);
      } else {
        downloadSvg(logo.svg_content || '', `logo-${logo.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.svg`);
      }
    });
  };

  const primaryLogoSvg = brand.visual_identity.logos[selectedLogoIdx]?.svg_content || '';
  const iconLogoSvg = brand.visual_identity.logos[selectedLogoIdx]?.svg_content || primaryLogoSvg;

  return (
    <div className="max-w-6xl mx-auto w-full pb-20 text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Brand Portal</h1>
          <p className="text-gray-400 mt-1">Tu identidad premium, lista para conquistar el mercado.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Empezar de Cero
          </button>
          <button onClick={onEdit} className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors flex items-center shadow-sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Brief
          </button>
          {onSave && (
            <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center">
              Guardar Proyecto
            </button>
          )}
          <button onClick={exportAssets} className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors shadow-sm flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Descargar Assets
          </button>
        </div>
      </header>

      <div className="space-y-12">
        {/* 1. Contexto & Estrategia */}
        <Section title="Estrategia de Marca" icon={<Target className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label>Arquetipo & Enfoque</Label>
              <p className="font-medium text-white">{brand.strategy.archetype}</p>
            </div>
            <div className="space-y-2">
              <Label>Propuesta de Valor</Label>
              <p className="text-sm text-gray-300 leading-relaxed">{brand.strategy.value_proposition}</p>
            </div>
            <div className="space-y-2">
              <Label>Tagline Comercial</Label>
              <p className="text-xl font-display font-semibold italic text-white">"{brand.strategy.tagline}"</p>
            </div>
          </div>
        </Section>

        {/* 2. Logos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5 bg-[#111]"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="text-gray-500"><LayoutTemplate className="w-5 h-5" /></div>
              <h3 className="font-display font-bold text-xl text-white">Sistema de Logotipos</h3>
            </div>
            {onRegenerateLogos && (
              <button 
                onClick={onRegenerateLogos}
                className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center shadow-sm border border-white/5"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerar Logos
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {brand.visual_identity.logos?.map((logo, idx) => {
               const isSelected = idx === selectedLogoIdx;
               return (
               <div key={logo.id} className="flex flex-col group cursor-pointer" onClick={() => setSelectedLogoIdx(idx)}>
                 <div 
                   className={`h-64 rounded-xl flex flex-col items-center justify-center p-8 relative shadow-sm transition-all border-2 ${isSelected ? 'scale-[1.02] shadow-2xl z-10' : 'border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'}`}
                   style={{ backgroundColor: isSelected ? '#1a1a1a' : '#141414', borderColor: isSelected ? brand.visual_identity.colors.primary : undefined }}
                 >
                   <div className={`absolute top-4 left-4 text-xs font-semibold tracking-wide ${isSelected ? 'text-white backdrop-blur-md bg-black/50 border border-white/10' : 'text-gray-500 bg-[#222] border border-white/5'} z-10 px-2 py-1 rounded-md transition-all`}>
                     {logo.name} {isSelected && <span style={{color: brand.visual_identity.colors.primary}}>✓ Seleccionado</span>}
                   </div>
                   {logo.image_url ? (
                     <img src={logo.image_url} alt={logo.name} className="w-full h-full object-cover rounded-xl absolute inset-0" />
                   ) : (
                     <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(logo.svg_content || '')}`} alt={logo.name} className="w-full h-full object-contain max-w-[280px]" />
                   )}
                   <button 
                     onClick={(e) => { 
                       e.stopPropagation(); 
                       if (logo.image_url) {
                         downloadImage(logo.image_url, `logo-${logo.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`);
                       } else {
                         downloadSvg(logo.svg_content || '', `logo-${logo.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.svg`); 
                       }
                     }}
                     className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg shadow font-medium text-sm flex items-center gap-2 bg-black/50 text-white border border-white/10 backdrop-blur-md hover:bg-white/10"
                     title={`Descargar ${logo.name}`}
                   >
                     <Download className="w-4 h-4" /> {logo.image_url ? 'PNG' : 'SVG'}
                   </button>
                 </div>
               </div>
             )})}
          </div>
        </motion.div>

        {/* 3 & 4. Tipografía y Colores en Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tipografía */}
          <Section title="Tipografías Recomendadas" icon={<span className="font-serif italic text-lg leading-none">Aa</span>}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-sm font-medium text-gray-400">Selecciona un estilo:</label>
              <select 
                className="px-3 py-2 bg-[#222] border border-white/10 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/20"
                value={activePairingIdx}
                onChange={(e) => setActivePairingIdx(Number(e.target.value))}
              >
                {brand.visual_identity.typography_pairings?.map((pairing, idx) => (
                  <option key={pairing.id} value={idx}>{pairing.name}</option>
                ))}
              </select>
            </div>

            {brand.visual_identity.typography_pairings && brand.visual_identity.typography_pairings[activePairingIdx] && (
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-2 gap-2">
                    <Label>Títulos - <span className="text-gray-500 font-normal">{brand.visual_identity.typography_pairings[activePairingIdx].heading.classification}</span></Label>
                    <a href={brand.visual_identity.typography_pairings[activePairingIdx].heading.url} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded">
                      Link <Download className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-4xl font-display text-white mb-2 leading-tight" style={{ fontFamily: brand.visual_identity.typography_pairings[activePairingIdx].heading.family }}>
                    Visualiza el Futuro.
                  </p>
                  <p className="text-xs text-gray-400 italic border-l-2 border-white/10 pl-2">{brand.visual_identity.typography_pairings[activePairingIdx].heading.usage_notes}</p>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-2 gap-2">
                    <Label>Cuerpo - <span className="text-gray-500 font-normal">{brand.visual_identity.typography_pairings[activePairingIdx].body.classification}</span></Label>
                    <a href={brand.visual_identity.typography_pairings[activePairingIdx].body.url} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded">
                      Link <Download className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-2" style={{ fontFamily: brand.visual_identity.typography_pairings[activePairingIdx].body.family }}>
                    La tipografía de cuerpo debe asegurar una lectura fluida y sin distracciones. Proyecta profesionalismo y claridad en todos los puntos de contacto con tu audiencia.
                  </p>
                </div>
              </div>
            )}
          </Section>

          {/* Colores */}
          <Section title="Paleta de Colores" icon={<Palette className="w-5 h-5" />}>
            <div className="space-y-4">
              {Object.entries(brand.visual_identity.colors).map(([name, hex]) => (
                <div key={name} className="flex items-center justify-between group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer" onClick={() => copyToClipboard(hex)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: hex }}></div>
                    <div>
                      <p className="text-sm font-semibold capitalize text-white">{name}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{hex}</p>
                    </div>
                  </div>
                  <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-medium">
                    Copiar <Copy className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* 5. Mockups: Usos de Marca */}
        <Section title="Aplicaciones Físicas & Usos" icon={<ImageIcon className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brand.mockups?.brand_uses.map((mockup) => (
              <ImageMockup key={mockup.id} keyword={mockup.keyword} title={mockup.name} imageUrlOverride={mockup.image_url} className="aspect-[3/2] sm:aspect-video">
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/20 mix-blend-multiply transition-all group-hover:bg-black/10" />
                <div className="relative z-10 w-32 drop-shadow-lg [&_text]:!fill-white [&_path]:!stroke-white" dangerouslySetInnerHTML={{ __html: iconLogoSvg }} />
              </ImageMockup>
            ))}
          </div>
        </Section>

        {/* 6. Mockups: Marketing & Digital */}
        <Section title="Campañas & Marketing" icon={<MessageSquare className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brand.mockups?.marketing.map((mockup) => (
              <ImageMockup key={mockup.id} keyword={mockup.keyword} title={mockup.name} imageUrlOverride={mockup.image_url} className="aspect-square sm:aspect-video">
                {/* Gradient overlay using brand colors */}
                <div 
                   className="absolute inset-0 opacity-80 mix-blend-hard-light"
                   style={{ background: `linear-gradient(to top, ${brand.visual_identity.colors.primary}, transparent)` }}
                />
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
                  <div className="w-24 drop-shadow-md [&_text]:!fill-white [&_path]:!stroke-white" dangerouslySetInnerHTML={{ __html: iconLogoSvg }} />
                  <div>
                    <h3 
                      className="text-white text-3xl font-bold leading-none mb-2 drop-shadow-md"
                      style={{ fontFamily: brand.visual_identity.typography_pairings?.[activePairingIdx]?.heading.family || 'sans-serif' }}
                    >
                      {mockup.copy}
                    </h3>
                    <div 
                      className="inline-block mt-2 px-4 py-2 text-sm font-bold uppercase rounded"
                      style={{ backgroundColor: brand.visual_identity.colors.secondary, color: brand.visual_identity.colors.surface }}
                    >
                      Comprar Ahora
                    </div>
                  </div>
                </div>
              </ImageMockup>
            ))}
          </div>
        </Section>

        {/* 7. Mockups: Out of Home (Vía Pública) */}
        <Section title="Vía Pública (OOH)" icon={<Megaphone className="w-5 h-5" />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {brand.mockups?.ooh.map((mockup, idx) => (
              <ImageMockup key={mockup.id} keyword={mockup.keyword} title={mockup.name} className={idx === 0 ? "lg:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-48 mb-6 drop-shadow-xl [&_text]:!fill-white [&_path]:!stroke-white" dangerouslySetInnerHTML={{ __html: primaryLogoSvg }} />
                  <p 
                    className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg max-w-lg"
                    style={{ fontFamily: brand.visual_identity.typography_pairings?.[activePairingIdx]?.heading.family || 'sans-serif' }}
                  >
                    {brand.strategy.tagline}
                  </p>
                </div>
              </ImageMockup>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// Reusable UI Components

function Section({ title, icon, children, className = "bg-[#111]" }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/10">
        <div className="text-gray-500">{icon}</div>
        <h3 className="font-display font-bold text-xl text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Label({ children, className = "text-gray-400" }: { children: React.ReactNode, className?: string }) {
  return <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${className}`}>{children}</h4>;
}

// Image Mockup Helper Component
function ImageMockup({ keyword, title, children, className = "aspect-square", imageUrlOverride }: { key?: React.Key, keyword: string, title: string, children: React.ReactNode, className?: string, imageUrlOverride?: string }) {
  const [imgError, setImgError] = useState(false);
  
  // Using picsum.photos for stable diverse placeholder images since Unsplash Source is deprecated
  const imageUrl = imageUrlOverride || `https://picsum.photos/seed/${encodeURIComponent(keyword + title)}/800/600`;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrlOverride) {
      const link = document.createElement('a');
      link.href = imageUrlOverride;
      link.download = `mockup-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div className={`relative w-full overflow-hidden rounded-xl bg-[#222] shadow-inner ${className}`}>
        {/* Background Image */}
        {!imgError ? (
          <img 
            src={imageUrl} 
            alt={`Mockup for ${title}`}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-gray-500 text-xs font-medium">Image unavailable</span>
          </div>
        )}
        
        {/* Overlay Content (Logos, Texts, Gradients) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {children}
        </div>

        {/* Download Button */}
        {imageUrlOverride && (
           <button 
             onClick={handleDownload}
             className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg shadow font-medium text-sm flex items-center gap-2 bg-black/60 text-white border border-white/20 backdrop-blur-md hover:bg-white/10 z-20"
             title={`Descargar ${title}`}
           >
             <Download className="w-4 h-4" /> PNG
           </button>
        )}
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">{title}</p>
    </div>
  );
}
