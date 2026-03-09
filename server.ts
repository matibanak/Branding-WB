import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import { BrandBrief } from './src/types';

dotenv.config();

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

async function startServer() {
  const app = express();
  app.use(express.json());

  // Init Gemini SDK
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelName = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview';

  // The endpoint to generate Image
  app.post('/api/generate-image', async (req, res) => {
    try {
      const formData: BrandBrief & { imageType?: 'logos' | 'mockups' | 'marketing' } = req.body;
      const basePrompt = buildPrompt(formData);
      
      let prompts: string[] = [];
      
      if (formData.imageType === 'mockups') {
        const mockupInstruction = "IMPORTANT: Output highly aesthetic, award-winning Behance-style visual presentations. Focus on premium editorial layouts and physical mockups. Use stunning studio lighting.";
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
      } else {
        const logoInstruction = "IMPORTANT: ALWAYS output a clean, high-quality, modern vector-style logo design on a solid bright white background. NO extra text, NO mockups, NO 3d renders, NO brand guideline boards.";
        prompts = [
          `[URGENT: MINIMALIST ISOLOGO ONLY] ${basePrompt} ${logoInstruction} Style: Clean vector, flat minimalist icon combined with a short lettermark.`,
          `[URGENT: ABSTRACT MONOGRAM ONLY] ${basePrompt} ${logoInstruction} Style: Abstract geometric monogram, bold shapes.`,
          `[URGENT: TYPOGRAPHY WORDMARK ONLY] ${basePrompt} ${logoInstruction} Style: Elegant typography wordmark, creative font treatment, NO icons.`,
          `[URGENT: INSTITUTIONAL BADGE ONLY] ${basePrompt} ${logoInstruction} Style: Circular emblem, institutional crest, highly detailed badge.`
        ];
      }

      const results = [];
      
      for (const prompt of prompts) {
        try {
          console.log("Generating image with prompt:", prompt.substring(0, 100) + "...");
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              aspectRatio: "1:1",
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
             // Push a null to keep array index aligned if we wanted, but we filter anyway later
             results.push(null);
          }
        } catch (e: any) {
          console.error("Error generating single image:", e?.message || e);
          results.push(null);
        }
      }

      const validImages = results; // Frontend expects exactly 4 images, so we should try to keep 4.
      // Wait, let's keep it as is, frontend maps by index. Wait, if it's null it breaks? 
      // Actually frontend generatedImageUrls uses indices. So retaining nulls is better for order, 
      // but let's just make validImages the filtered ones like before just to not break API.
      const cleanedImages = results.filter(r => r !== null);

      
      if (cleanedImages.length > 0) {
        // Pad with the first image if some failed, so we always return expected amount
        const targetLength = formData.imageType === 'logos' ? 4 : 3;
        while (cleanedImages.length < targetLength) {
          cleanedImages.push(cleanedImages[0]);
        }
        res.json({ success: true, images: cleanedImages });
      } else {
        res.status(500).json({ success: false, error: "Failed to extract any images from response" });
      }

    } catch (e: any) {
      console.error("Error generating image:", e);
      res.status(500).json({ success: false, error: e.message || "Internal Error" });
    }
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer();
