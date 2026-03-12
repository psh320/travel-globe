import type { CountryMapSummary } from "@/lib/archive";

export type Bounds2D = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type CameraTarget = {
  center: [number, number];
  position: [number, number, number];
  zoom: number;
};

export type WorldCountryRecord = {
  countryCode: string;
  displayName: string;
  bounds: Bounds2D;
  centroid: [number, number];
  path: string;
};

export type MapViewMode = "world" | "country";

export type MapInteractionState = {
  selectedCountryCode: string | null;
  viewMode: MapViewMode;
};

export type MapCountrySelection = {
  countryCode: string;
  displayName: string;
  summary: CountryMapSummary | null;
};

export type MapHostSnapshot = MapInteractionState & {
  focusedCountry: MapCountrySelection | null;
  selectedCountry: MapCountrySelection | null;
};
