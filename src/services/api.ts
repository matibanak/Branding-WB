import { BrandBrief, BrandPackage } from '../types';
import { PREDEFINED_PALETTES } from '../constants';
export const generateBrand = async (brief: BrandBrief): Promise<BrandPackage> => {
  // Simulate AI processing time for strategy and SVG construction
  // Wait no, we will actually call our real Nano Banana Backend!
  let generatedImageUrls: string[] = [];
  let mockupImageUrls: string[] = [];
  let marketingImageUrls: string[] = [];
  let oohImageUrls: string[] = [];
  try {
    // 1. Generate clean logos
    const resLogos = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...brief, imageType: 'logos' })
    });
    const dataLogos = await resLogos.json();
    if (dataLogos.success && dataLogos.images && dataLogos.images.length > 0) {
      generatedImageUrls = dataLogos.images.map((img: any) => {
        if (!img) return undefined;
        if (img.base64Image.startsWith('data:')) return img.base64Image;
        return `data:${img.mimeType};base64,${img.base64Image}`;
      });
    }

    // 2. Generate premium mockups
    const resMockups = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...brief, imageType: 'mockups' })
    });
    const dataMockups = await resMockups.json();
    if (dataMockups.success && dataMockups.images && dataMockups.images.length > 0) {
      mockupImageUrls = dataMockups.images.map((img: any) => {
        if (!img) return undefined;
        if (img.base64Image.startsWith('data:')) return img.base64Image;
        return `data:${img.mimeType};base64,${img.base64Image}`;
      });
    }

    // 3. Generate marketing creatives
    const resMarketing = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...brief, imageType: 'marketing' })
    });
    const dataMarketing = await resMarketing.json();
    if (dataMarketing.success && dataMarketing.images && dataMarketing.images.length > 0) {
      marketingImageUrls = dataMarketing.images.map((img: any) => {
        if (!img) return undefined;
        if (img.base64Image.startsWith('data:')) return img.base64Image;
        return `data:${img.mimeType};base64,${img.base64Image}`;
      });
    }

    // 4. Generate OOH (Via Publica) creatives
    const resOoh = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...brief, imageType: 'ooh' })
    });
    const dataOoh = await resOoh.json();
    if (dataOoh.success && dataOoh.images && dataOoh.images.length > 0) {
      oohImageUrls = dataOoh.images.map((img: any) => {
        if (!img) return undefined;
        if (img.base64Image.startsWith('data:')) return img.base64Image;
        return `data:${img.mimeType};base64,${img.base64Image}`;
      });
    }
  } catch (error) {
    console.warn("Failed to generate Nano Banana images", error);
  }

  // Generate color palette
  let colors = {
    primary: "#FF3366",
    secondary: "#1A1A2E",
    background: "#F9F9F9",
    surface: "#FFFFFF",
    text: "#111111"
  };

  if (brief.colorPalette) {
    const palette = PREDEFINED_PALETTES.find(p => p.id === brief.colorPalette);
    if (palette) {
      colors.primary = palette.colors[0];
      colors.secondary = palette.colors[1];
      // Keep background/surface/text mostly neutral but could adapt
      if (palette.id === 'dark') {
        colors.background = "#0F0F1A";
        colors.surface = "#1A1A2E";
        colors.text = "#FFFFFF";
      }
    }
  }

  if (brief.customColors) {
    const customHexes = brief.customColors.split(',').map(c => c.trim()).filter(c => c.startsWith('#'));
    if (customHexes.length > 0) colors.primary = customHexes[0];
    if (customHexes.length > 1) colors.secondary = customHexes[1];
  }

  // 2026 Radical Internet Trends SVG Generation Logic
  const bName = brief.businessName || 'Brand';
  const initial = bName.charAt(0).toUpperCase();
  const shortName = bName.substring(0, 12);
  
  const randomGradientDeg = Math.floor(Math.random() * 360);
  const flipColors = Math.random() > 0.5;
  const bg1 = flipColors ? colors.secondary : colors.primary;
  const bg2 = flipColors ? colors.primary : colors.secondary;

  // 1. Principal: "Neo-Minimalist Tactile Materiality" (Liquid glass feel)
  const principalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="100%" height="100%">
    <defs>
      <linearGradient id="glass1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.9" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
      <linearGradient id="glass2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
      </linearGradient>
      <filter id="blurFilter">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
    <!-- Liquid shapes -->
    <path d="M 25 25 Q 60 10 75 40 T 35 90 Q 10 60 25 25" fill="url(#glass1)" />
    <!-- Glass reflection -->
    <path d="M 30 30 Q 55 20 65 40 T 40 80 Q 20 55 30 30" fill="url(#glass2)" opacity="0.8" />
    
    <!-- Micro-detail anchor -->
    <circle cx="20" cy="85" r="4" fill="${colors.surface}" stroke="${colors.secondary}" stroke-width="2" />
    
    <!-- Typography -->
    <text x="110" y="70" font-family="Space Grotesk, Inter, sans-serif" font-size="44" font-weight="900" letter-spacing="-1.5" fill="${colors.text === '#FFFFFF' ? '#FFFFFF' : '#0a0a0a'}">${shortName}</text>
    <text x="112" y="90" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="4" fill="${colors.secondary}" opacity="0.7">EST 2026 // NEXT-GEN</text>
  </svg>`;

  // 2. Monograma: "Retro-Futuristic Y2K Hologram" (Chrome/Neon wireframes)
  const monogramSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
    <defs>
      <radialGradient id="holoGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${bg1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.surface};stop-opacity:0" />
      </radialGradient>
      <linearGradient id="chrome" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#fff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- Grid -->
    <path d="M 100 10 L 100 190 M 10 100 L 190 100 M 36 36 L 164 164 M 36 164 L 164 36" stroke="${colors.primary}" stroke-width="1" opacity="0.2" />
    <!-- Glowing orb -->
    <circle cx="100" cy="100" r="80" fill="url(#holoGrad)" opacity="0.3" />
    <!-- 3D Chrome Initial -->
    <text x="100" y="145" font-family="Syne, sans-serif" font-size="140" font-weight="800" text-anchor="middle" fill="url(#chrome)">${initial}</text>
    <!-- Y2K sparkle -->
    <path d="M 150 40 L 155 55 L 170 60 L 155 65 L 150 80 L 145 65 L 130 60 L 145 55 Z" fill="${colors.primary}" />
  </svg>`;

  // 3. Tipográfico: "Typography-Driven Morph-mark" (Extreme tracking and naive tweaks)
  const typoLayout = Math.random() > 0.5;
  const typoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 120" width="100%" height="100%">
    <defs>
      <linearGradient id="tGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
    </defs>
    ${typoLayout 
      ? `<!-- Naive Serif Twist -->
         <text x="175" y="75" font-family="Playfair Display, serif" font-size="62" font-style="italic" font-weight="900" letter-spacing="-2" text-anchor="middle" fill="${colors.primary}">${shortName}</text>
         <path d="M 50 85 C 100 85, 150 105, 300 85" fill="none" stroke="${colors.secondary}" stroke-width="6" stroke-linecap="round"/>`
      : `<!-- Brutalist Wide Tracking -->
         <rect x="20" y="30" width="310" height="60" fill="${colors.secondary}" />
         <text x="175" y="70" font-family="Outfit, sans-serif" font-size="34" font-weight="800" text-anchor="middle" letter-spacing="8" fill="${colors.surface}">${shortName.toUpperCase()}</text>
         <rect x="25" y="35" width="10" height="10" fill="${colors.primary}" />`
    }
  </svg>`;

  // 4. Sello Institucional: "Adaptive Dynamic System"
  const selloStyle = Math.random() > 0.5;
  const selloSvg = selloStyle
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
        <!-- Animated feeling ring -->
        <circle cx="120" cy="120" r="105" fill="none" stroke="${colors.primary}" stroke-width="2" stroke-dasharray="1 10" stroke-linecap="round" />
        <circle cx="120" cy="120" r="85" fill="${colors.surface}" stroke="${colors.secondary}" stroke-width="12" />
        <!-- Micro-detail notch -->
        <rect x="115" y="25" width="10" height="20" fill="${colors.surface}" />
        <text x="120" y="115" font-family="Space Grotesk, sans-serif" font-size="64" font-weight="900" text-anchor="middle" letter-spacing="-2" fill="${colors.primary}">${initial}</text>
        <text x="120" y="155" font-family="Inter, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="6" fill="${colors.secondary}">${bName.substring(0,6).toUpperCase()}</text>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="100%">
        <defs>
          <path id="textPath" d="M 60,120 A 60,60 0 1,1 180,120 A 60,60 0 1,1 60,120" />
        </defs>
        <polygon points="120,20 206,70 206,170 120,220 34,170 34,70" fill="${colors.primary}" opacity="0.1" />
        <circle cx="120" cy="120" r="70" fill="none" stroke="${colors.secondary}" stroke-width="1.5" />
        <!-- Abstract humanized shape inside -->
        <path d="M 90 120 C 90 80, 150 80, 150 120 C 150 160, 90 160, 90 120" fill="${colors.primary}" opacity="0.8" />
        <text font-family="Space Grotesk, sans-serif" font-size="14" font-weight="bold" letter-spacing="5" fill="${colors.text}">
          <textPath href="#textPath" startOffset="50%" text-anchor="middle">${bName.toUpperCase()} // 2026 //</textPath>
        </text>
       </svg>`;

  return {
    brand_id: crypto.randomUUID(),
    strategy: {
      archetype: "El Creador",
      value_proposition: `Empoderamos a ${brief.audienceTags || 'usuarios'} con herramientas del futuro.`,
      tagline: "Diseña el mañana, hoy."
    },
    visual_identity: {
      colors,
      typography_pairings: [
        {
          id: "pairing-1",
          name: "Moderno & Limpio",
          heading: { 
            family: "Space Grotesk", 
            url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap",
            classification: "Sans Serif Geométrico",
            usage_notes: "Ideal para titulares de alto impacto comunicando innovación."
          },
          body: { 
            family: "Inter", 
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap",
            classification: "Sans Serif",
            usage_notes: "Proporciona excelente legibilidad y neutralidad."
          }
        },
        {
          id: "pairing-2",
          name: "Elegancia Clásica",
          heading: { 
            family: "Playfair Display", 
            url: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap",
            classification: "Serif de Transición",
            usage_notes: "Perfecta para transmitir lujo, herencia y confianza premium."
          },
          body: { 
            family: "Lora", 
            url: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500&display=swap",
            classification: "Serif Humanista",
            usage_notes: "Cálida y altamente legible en cuerpos de texto prolongados."
          }
        },
        {
          id: "pairing-3",
          name: "Audaz & Brutalista",
          heading: { 
            family: "Syne", 
            url: "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap",
            classification: "Display Contemporánea",
            usage_notes: "Para marcas disruptivas que buscan romper moldes y destacar."
          },
          body: { 
            family: "Outfit", 
            url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap",
            classification: "Sans Serif Geométrica",
            usage_notes: "Equilibra la excentricidad del titular con limpieza funcional."
          }
        }
      ],
      logos: [
        {
          id: crypto.randomUUID(),
          name: "Principal (Isologotipo Radical)",
          svg_content: generatedImageUrls[0] ? undefined : principalSvg,
          image_url: generatedImageUrls[0],
          layout: "icon_left"
        },
        {
          id: crypto.randomUUID(),
          name: "Monograma (Máscara Abstracta)",
          svg_content: generatedImageUrls[1] ? undefined : monogramSvg,
          image_url: generatedImageUrls[1],
          layout: "icon_only"
        },
        {
          id: crypto.randomUUID(),
          name: "Tipográfico (Wordmark Elegante)",
          svg_content: generatedImageUrls[2] ? undefined : typoSvg,
          image_url: generatedImageUrls[2],
          layout: "wordmark"
        },
        {
          id: crypto.randomUUID(),
          name: "Sello Institucional",
          svg_content: generatedImageUrls[3] ? undefined : selloSvg,
          image_url: generatedImageUrls[3],
          layout: "stacked"
        }
      ]
    },
    verbal_identity: {
      tone: ["Inspirador", "Directo", "Técnico pero accesible"],
      do_say: ["Construimos", "Evolución", "Futuro"],
      dont_say: ["Barato", "Fácil", "Básico"]
    },
    mockups: {
      brand_uses: [
        { id: crypto.randomUUID(), name: "Empaque / Producto", keyword: brief.industry?.toLowerCase().includes("retail") ? "shopping bag,box" : brief.industry?.toLowerCase().includes("auto") ? "car,vehicle" : "stationery,notebook", image_url: mockupImageUrls[0] },
        { id: crypto.randomUUID(), name: "Interiores / Oficina", keyword: "office,glass window,building", image_url: mockupImageUrls[1] },
        { id: crypto.randomUUID(), name: "Uniforme / Merch", keyword: "t-shirt,cap,clothing mockup", image_url: mockupImageUrls[2] },
      ],
      marketing: [
        { id: crypto.randomUUID(), name: "Captura de Leads", keyword: "computer,desk,typing", copy: "Únete a la revolución.", image_url: marketingImageUrls[0] },
        { id: crypto.randomUUID(), name: "Promo Flash", keyword: "happy person,abstract background", copy: "50% OFF", image_url: marketingImageUrls[1] },
        { id: crypto.randomUUID(), name: "Envío Gratis", keyword: "delivery,box,shipping", copy: "Envío Gratis a todo el país.", image_url: marketingImageUrls[2] },
      ],
      ooh: [
        { id: crypto.randomUUID(), name: "Cartel en Autobús", keyword: "bus stop,city,billboard", image_url: oohImageUrls[0] },
        { id: crypto.randomUUID(), name: "Valla Publicitaria (Billboard)", keyword: "highway billboard,advertising", image_url: oohImageUrls[1] },
        { id: crypto.randomUUID(), name: "Mupi en Vía Pública", keyword: "street poster,urban advertising", image_url: oohImageUrls[2] },
      ]
    }
  };
};
