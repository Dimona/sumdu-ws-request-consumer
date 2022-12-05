export type MeteomaticsConfig = {
  domain: string;
  protocol: string;
  user: string;
  password: string;
};

export type MeteomaticsRequestAttrConfig = {
  build(params?: Record<string, any>): string;
  description: string;
};

export type MeteomaticsRequestAttrs = Record<
  'temperature' | 'windSpeed' | 'windDirection' | 'precipitation' | 'weatherSymbol' | 'sunrise' | 'sunset',
  MeteomaticsRequestAttrConfig
>;
