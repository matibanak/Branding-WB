import { GoogleGenAI } from '@google/genai';
import { BrandBrief } from '../src/types';

// Function to safely construct prompt.
function buildPrompt(formData: BrandBrief) {
  const parts = [];
  
  parts.push(`Create a professional brand logo or mockup for a business named "${formData.businessName}".`);
  if (formData.description) parts.push(`Business description: ${formData.description}.`);
  if (formData.industry) parts.push(`Industry: ${formData.industry}.`);
  parts.push(`Target audience: ${formData.audienceType === 'Both' ? 'B2B and B2C' : formData.audienceType}. Key audience tags: ${formData.audienceTags}.`);
  
  if (formData.values) parts.push(`Core values: ${formData.values}.`);
  if (formData.competitors) parts.push(`References or Competitors: ${formData.competitors}.`);
  if (formData.messagingHints) parts.push(`Messaging hints: ${formData.messagingHints}.`);
  
  const styleTraits = [];
  if (formData.styleClassicModern < 40) styleTraits.push('Classic');
  if (formData.styleClassicModern > 60) styleTraits.push('Modern');
  if (formData.styleAccessiblePremium < 40) styleTraits.push('Accessible');
  if (formData.styleAccessiblePremium > 60) styleTraits.push('Premium');
  if (formData.styleFunSerious < 40) styleTraits.push('Fun');
  if (formData.styleFunSerious > 60) styleTraits.push('Serious');
  
  if (styleTraits.length > 0) parts.push(`Style direction: ${styleTraits.join(', ')}.`);
  if (formData.styleDirections && formData.styleDirections.length > 0) {
    parts.push(`Design preferences: ${formData.styleDirections.join(', ')}.`);
  }
  
  const colors = [];
  if (formData.colorPalette) colors.push(`Palette: ${formData.colorPalette}`);
  if (formData.customColors) colors.push(`Custom colors: ${formData.customColors}`);
  if (colors.length > 0) parts.push(`Color requirements: ${colors.join(' and ')}.`);

  return parts.filter(Boolean).join(" ");
}

export default async function handler(req: any, res: any) {
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const formData: BrandBrief & { imageType?: 'logos' | 'mockups' | 'marketing' | 'ooh' } = req.body;
    const basePrompt = buildPrompt(formData);
    
    // Init Gemini SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelName = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview';
    
    let prompts: string[] = [];
    
    if (formData.imageType === 'mockups') {
      const mockupInstruction = "IMPORTANT: Output highly aesthetic, award-winning Behance-style visual presentations in 8k resolution. Focus on ultra-realistic, premium editorial layouts and physical mockups. Use stunning studio lighting, hyper-detailed textures, and crisp focus.";
      prompts = [
        `[URGENT: PREMIUM STATIONERY MOCKUP] ${basePrompt} ${mockupInstruction} Style: Realistic mockup showing business cards, letterheads, or packaging. Beautiful studio lighting.`,
        `[URGENT: HIGH-IMPACT ADVERTISING KEY VISUAL] ${basePrompt} ${mockupInstruction} Style: Stunning campaign key visual, premium advertising poster with 3D elements or photography.`,
        `[URGENT: BRAND GUIDELINES BOARD] ${basePrompt} ${mockupInstruction} Style: Behance-style brand identity presentation slide showing primary logo, colors, and typography layout.`
      ];
    } else if (formData.imageType === 'marketing') {
      const marketingInstruction = "IMPORTANT: Output highly aesthetic marketing and social media campaign visuals. Focus on sales, discounts, and promotional banners with dynamic backgrounds.";
      prompts = [
        `[URGENT: LEAD GENERATION AD] ${basePrompt} ${marketingInstruction} Style: A modern, sleek digital ad banner showing a person using a computer or phone, with a futuristic overlay.`,
        `[URGENT: FLASH PROMO POSTER] ${basePrompt} ${marketingInstruction} Style: A vibrant, high-energy promotional poster with bold abstract shapes focusing on a '50% OFF' discount concept.`,
        `[URGENT: FREE SHIPPING BANNER] ${basePrompt} ${marketingInstruction} Style: A professional e-commerce delivery banner with a premium box or shipping vehicle and dynamic speed lines.`
      ];
    } else if (formData.imageType === 'ooh') {
      const oohInstruction = "IMPORTANT: Output photorealistic, high-quality urban Out Of Home (OOH) advertising mockups. Integrate the brand seamlessly into the environment. No extra text overlays, just the realistic scene.";
      prompts = [
        `[URGENT: BUS STOP AD MOCKUP] ${basePrompt} ${oohInstruction} Style: A modern city bus stop with an illuminated advertising poster displaying the brand. Photorealistic street photography.`,
        `[URGENT: HIGHWAY BILLBOARD MOCKUP] ${basePrompt} ${oohInstruction} Style: A large, wide highway billboard against a blue sky, showcasing the brand's advertisement. Realistic lighting and scale.`,
        `[URGENT: STREET MUPI MOCKUP] ${basePrompt} ${oohInstruction} Style: An urban street mupi (freestanding sidewalk advertising display) at night or dusk, glowing with the brand's ad.`
      ];
    } else {
      const logoInstruction = "IMPORTANT: ALWAYS output a clean, ultra-high-quality (8k resolution) modern flat vector-style logo design on a solid bright white background. It must look like crisp, perfect vector illustration. NO gradients, NO pixelation, NO extra text, NO mockups, NO 3d renders, NO brand guideline boards. Just the flat logo.";
      prompts = [
        `[URGENT: MINIMALIST ISOLOGO ONLY] ${basePrompt} ${logoInstruction} Style: Clean vector, flat minimalist icon combined with a short lettermark.`,
        `[URGENT: ABSTRACT MONOGRAM ONLY] ${basePrompt} ${logoInstruction} Style: Abstract geometric monogram, bold shapes.`,
        `[URGENT: TYPOGRAPHY WORDMARK ONLY] ${basePrompt} ${logoInstruction} Style: Elegant typography wordmark, creative font treatment, NO icons.`,
        `[URGENT: INSTITUTIONAL BADGE ONLY] ${basePrompt} ${logoInstruction} Style: Circular emblem, institutional crest, highly detailed badge.`
      ];
    }

    const results = [];
    const targetAspectRatio = formData.imageType === 'ooh' ? "16:9" : "1:1";
    
    for (const prompt of prompts) {
      try {
        console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            aspectRatio: targetAspectRatio,
          } as any
        });
        
        let base64Image = null;
        let mimeType = 'image/jpeg';
        
        if (response.candidates && response.candidates[0]?.content?.parts) {
          const parts = response.candidates[0].content.parts;
          for (const part of parts) {
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              mimeType = part.inlineData.mimeType || 'image/jpeg';
              break;
            } else if (part.text && (part.text.startsWith('/9j/') || part.text.length > 10000)) {
              base64Image = part.text;
              break;
            }
          }
        }

        if (!base64Image && (response as any).generatedImages) {
           const img = (response as any).generatedImages[0].image;
           base64Image = img.imageBytes;
           mimeType = img.mimeType || 'image/jpeg';
        }
        
        if (base64Image) {
          results.push({ base64Image, mimeType });
        } else {
           console.warn("Failed to extract image from response for prompt.");
           results.push(null);
        }
      } catch (e: any) {
        console.error("Error generating single image:", e?.message || e);
        results.push(null);
      }
    }

    const validImages = results;
    
    if (validImages.some(img => img !== null)) {
      res.status(200).json({ success: true, images: validImages });
    } else {
      res.status(500).json({ success: false, error: "Failed to extract any images from response" });
    }

  } catch (e: any) {
    console.error("Error generating image:", e);
    res.status(500).json({ success: false, error: e.message || "Internal Error" });
  }
}
