"use client";

import { useMemo } from "react";

import { WorldScene } from "@/features/map/components/world-scene";
import { mockVisitRecords } from "@/features/map/data/mock-visit-records";
import { loadWorldCountryRecords } from "@/features/map/lib/world-boundaries";
import { useMapEngineStore } from "@/features/map/store/map-engine-store";
import { getCountryMapSummaries } from "@/lib/archive";

export function MapExperience() {
  const selectedCountryCode = useMapEngineStore((state) => state.selectedCountryCode);
  const viewMode = useMapEngineStore((state) => state.viewMode);
  const openSelectedCountry = useMapEngineStore((state) => state.openSelectedCountry);
  const resetView = useMapEngineStore((state) => state.resetView);
  const archiveIndex = useMemo(
    () =>
      new Map(
        getCountryMapSummaries(mockVisitRecords, { themeName: "red" }).map((entry) => [
          entry.countryCode,
          entry,
        ]),
      ),
    [],
  );
  const countries = useMemo(() => loadWorldCountryRecords(), []);
  const selectedCountry =
    countries.find((country) => country.countryCode === selectedCountryCode) ?? null;
  const selectedArchive = selectedCountryCode ? archiveIndex.get(selectedCountryCode) : null;

  return (
    <main
      className="relative min-h-screen overflow-hidden text-stone-800"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.85), transparent 48%), linear-gradient(180deg, #f7f4ec 0%, #ebe4d7 100%)",
      }}
    >
      <section className="relative flex min-h-screen flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[28px] border border-stone-400/20 bg-[rgba(255,251,245,0.88)] px-5 py-4 shadow-[0_18px_60px_rgba(80,65,42,0.08)] backdrop-blur md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-stone-500">
                Travel Globe
              </p>
              <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-stone-800 sm:text-3xl">
                Explore a calm 3D world view before later waves zoom into each archive.
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-stone-600">
              Tap or click a country to select it. Press the same country again, or use the open
              action below, to test the focus-ready camera transition.
            </p>
          </div>
        </div>

        <div className="flex-1 pb-48 pt-28 sm:pb-40 sm:pt-36">
          <WorldScene />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[28px] border border-stone-400/20 bg-[rgba(255,251,245,0.92)] p-4 shadow-[0_-8px_50px_rgba(80,65,42,0.08)] backdrop-blur sm:p-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-stone-500">
                {viewMode === "country" ? "Country Focus Foundation" : "World View"}
              </p>
              <h2 className="text-xl font-semibold text-stone-800">
                {selectedCountry?.displayName ?? "No country selected"}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-stone-600">
                {selectedCountry && selectedArchive
                  ? `${selectedArchive.visitCount} visits across ${selectedArchive.uniqueCityCount} cities are reflected by the shared archive and color layers for this country.`
                  : "Country tinting is coming from the shared archive and color layers, while untouched countries stay near-white."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="min-h-12 rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!selectedCountryCode}
                onClick={() => openSelectedCountry()}
                type="button"
              >
                Open selected country
              </button>
              <button
                className="min-h-12 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-700"
                onClick={() => resetView()}
                type="button"
              >
                Return to world
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
