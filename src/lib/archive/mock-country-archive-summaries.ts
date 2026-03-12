export type CountryArchiveSummary = {
  countryCode: string;
  visitCount: number;
  photoCount: number;
  postCount: number;
  baseFill: string;
};

export const mockCountryArchiveSummaries: CountryArchiveSummary[] = [
  { countryCode: "JP", visitCount: 9, photoCount: 124, postCount: 12, baseFill: "#c9b08f" },
  { countryCode: "FR", visitCount: 6, photoCount: 82, postCount: 9, baseFill: "#d7c1a4" },
  { countryCode: "AU", visitCount: 4, photoCount: 58, postCount: 6, baseFill: "#e0cfb7" },
  { countryCode: "US", visitCount: 7, photoCount: 113, postCount: 14, baseFill: "#d1b698" },
  { countryCode: "CA", visitCount: 3, photoCount: 37, postCount: 4, baseFill: "#e6d9c5" },
  { countryCode: "BR", visitCount: 2, photoCount: 21, postCount: 3, baseFill: "#eadfce" },
  { countryCode: "IS", visitCount: 2, photoCount: 19, postCount: 2, baseFill: "#ece2d3" },
  { countryCode: "ZA", visitCount: 3, photoCount: 33, postCount: 3, baseFill: "#e5d6c1" },
  { countryCode: "TH", visitCount: 5, photoCount: 66, postCount: 8, baseFill: "#dcc8ad" },
  { countryCode: "NZ", visitCount: 2, photoCount: 17, postCount: 2, baseFill: "#ebe0cf" },
];
