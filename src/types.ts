export interface BrandBrief {
  businessName: string;
  description: string;
  industry?: string;
  audienceType: 'B2B' | 'B2C' | 'Both';
  audienceTags: string;
  values?: string;
  competitors?: string;
  messagingHints?: string;
  inspirationUrls?: string;
  styleClassicModern: number; // 0 to 100
  styleAccessiblePremium: number; // 0 to 100
  styleFunSerious: number; // 0 to 100
  styleDirections?: string[];
  preferredUseCases?: string[];
  colorPalette?: string;
  customColors?: string;
}

export interface BrandPackage {
  brand_id: string;
  strategy: {
    archetype: string;
    value_proposition: string;
    tagline: string;
  };
  visual_identity: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
    };
    typography_pairings: Array<{
      id: string;
      name: string;
      heading: { family: string; url: string; classification: string; usage_notes: string };
      body: { family: string; url: string; classification: string; usage_notes: string };
    }>;
    logos: Array<{
      id: string;
      name: string;
      svg_content?: string;
      image_url?: string;
      layout: string;
    }>;
  };
  verbal_identity: {
    tone: string[];
    do_say: string[];
    dont_say: string[];
  };
  mockups: {
    brand_uses: Array<{ id: string; name: string; keyword: string; image_url?: string }>;
    marketing: Array<{ id: string; name: string; keyword: string; copy: string; image_url?: string }>;
    ooh: Array<{ id: string; name: string; keyword: string; image_url?: string }>;
  };
}
