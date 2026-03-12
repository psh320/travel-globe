export type CountryArchiveSummary = {
  countryCode: string;
  visitCount: number;
  photoCount: number;
  postCount: number;
};

export const mockCountryArchiveSummaries: CountryArchiveSummary[] = [
  { countryCode: "392", visitCount: 9, photoCount: 124, postCount: 12 },
  { countryCode: "250", visitCount: 6, photoCount: 82, postCount: 9 },
  { countryCode: "036", visitCount: 4, photoCount: 58, postCount: 6 },
  { countryCode: "840", visitCount: 7, photoCount: 113, postCount: 14 },
  { countryCode: "124", visitCount: 3, photoCount: 37, postCount: 4 },
  { countryCode: "076", visitCount: 2, photoCount: 21, postCount: 3 },
  { countryCode: "352", visitCount: 2, photoCount: 19, postCount: 2 },
  { countryCode: "710", visitCount: 3, photoCount: 33, postCount: 3 },
  { countryCode: "764", visitCount: 5, photoCount: 66, postCount: 8 },
  { countryCode: "554", visitCount: 2, photoCount: 17, postCount: 2 },
];
