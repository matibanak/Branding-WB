import { BrandBrief, BrandPackage } from '../types';
import { PREDEFINED_PALETTES } from '../constants';

export const generateBrand = async (brief: BrandBrief): Promise<BrandPackage> => {
  // Simulate network delay and AI processing
  await new Promise((resolve) => setTimeout(resolve, 4000));

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

  return {
    brand_id: crypto.randomUUID(),
    strategy: {
      archetype: "El Creador",
      value_proposition: `Empoderamos a ${brief.audienceTags || 'usuarios'} con herramientas del futuro.`,
      tagline: "Diseña el mañana, hoy."
    },
    visual_identity: {
      colors,
      typography: {
        heading: { family: "Space Grotesk", url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap" },
        body: { family: "Inter", url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" }
      },
      logo: {
        svg_content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="100%" height="100%">
          <rect width="40" height="40" x="10" y="10" rx="8" fill="${colors.primary}" />
          <circle cx="30" cy="30" r="10" fill="${colors.secondary}" />
          <text x="65" y="40" font-family="Space Grotesk, sans-serif" font-size="28" font-weight="bold" fill="${colors.text === '#FFFFFF' ? '#FFFFFF' : '#1A1A2E'}">${brief.businessName || 'Brand OS'}</text>
        </svg>`,
        layout: "icon_left"
      }
    },
    verbal_identity: {
      tone: ["Inspirador", "Directo", "Técnico pero accesible"],
      do_say: ["Construimos", "Evolución", "Futuro"],
      dont_say: ["Barato", "Fácil", "Básico"]
    }
  };
};
