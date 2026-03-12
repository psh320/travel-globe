"use client";

import { create } from "zustand";

import type { MapViewMode } from "@/features/map/types";

type MapEngineState = {
  hoveredCountryCode: string | null;
  selectedCountryCode: string | null;
  viewMode: MapViewMode;
  setHoveredCountryCode: (countryCode: string | null) => void;
  pressCountry: (countryCode: string) => void;
  openSelectedCountry: () => void;
  resetView: () => void;
};

export const useMapEngineStore = create<MapEngineState>((set, get) => ({
  hoveredCountryCode: null,
  selectedCountryCode: null,
  viewMode: "world",
  setHoveredCountryCode: (hoveredCountryCode) => set({ hoveredCountryCode }),
  pressCountry: (countryCode) => {
    const { selectedCountryCode, viewMode } = get();

    if (selectedCountryCode === countryCode) {
      set({ viewMode: viewMode === "world" ? "country" : "world" });
      return;
    }

    set({
      selectedCountryCode: countryCode,
      viewMode: "world",
    });
  },
  openSelectedCountry: () => {
    if (!get().selectedCountryCode) {
      return;
    }

    set({ viewMode: "country" });
  },
  resetView: () =>
    set({
      hoveredCountryCode: null,
      selectedCountryCode: null,
      viewMode: "world",
    }),
}));
