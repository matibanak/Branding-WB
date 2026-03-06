export interface BrandBrief {
  businessName: string;
  description: string;
  audienceType: 'B2B' | 'B2C' | 'Both';
  audienceTags: string;
  styleClassicModern: number; // 0 to 100
  styleAccessiblePremium: number; // 0 to 100
  styleFunSerious: number; // 0 to 100
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
    typography: {
      heading: { family: string; url: string };
      body: { family: string; url: string };
    };
    logo: {
      svg_content: string;
      layout: string;
    };
  };
  verbal_identity: {
    tone: string[];
    do_say: string[];
    dont_say: string[];
  };
}
