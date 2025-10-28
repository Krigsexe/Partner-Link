
export interface ConversionData {
  signUp: number;
  purchase: number;
}

export interface PartnerLink {
  id: string;
  partnerName: string;
  promoCode: string;
  generatedUrl: string;
  createdAt: string;
  clicks: number;
  conversions: ConversionData;
}
