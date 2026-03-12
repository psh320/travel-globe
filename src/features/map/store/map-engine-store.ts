"use client";

import { create } from "zustand";

import type { MapViewMode } from "@/features/map/types";

type MapEngineState = {
  hoveredCountryName: string | null;
  selectedCountryName: string | null;
  viewMode: MapViewMode;
  setHoveredCountryName: (countryName: string | null) => void;
  pressCountry: (countryName: string) => void;
  openSelectedCountry: () => void;
  resetView: () => void;
};

export const useMapEngineStore = create<MapEngineState>((set, get) => ({
  hoveredCountryName: null,
  selectedCountryName: null,
  viewMode: "world",
  setHoveredCountryName: (hoveredCountryName) => set({ hoveredCountryName }),
  pressCountry: (countryName) => {
    const { selectedCountryName, viewMode } = get();

    if (selectedCountryName === countryName) {
      set({ viewMode: viewMode === "world" ? "country" : "world" });
      return;
    }

    set({
      selectedCountryName: countryName,
      viewMode: "world",
    });
  },
  openSelectedCountry: () => {
    if (!get().selectedCountryName) {
      return;
    }

    set({ viewMode: "country" });
  },
  resetView: () =>
    set({
      hoveredCountryName: null,
      selectedCountryName: null,
      viewMode: "world",
    }),
}));
