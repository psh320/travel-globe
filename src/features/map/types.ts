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

export type ArchiveSummary = {
  countryName: string;
  visitCount: number;
  photoCount: number;
  postCount: number;
};

export type WorldCountryRecord = {
  id: string;
  name: string;
  bounds: Bounds2D;
  centroid: [number, number];
  path: string;
};

export type MapViewMode = "world" | "country";
