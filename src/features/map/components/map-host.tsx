"use client";

import { useMemo, useState } from "react";

import { mockVisitRecords } from "@/features/map/data/mock-visit-records";
import {
  createMapHostSnapshot,
  defaultMapInteractionState,
  dismissMapInteraction,
  pressMapCountry,
} from "@/features/map/lib/map-interaction";
import { loadWorldCountryRecords } from "@/features/map/lib/world-boundaries";
import type { MapHostSnapshot, MapInteractionState } from "@/features/map/types";
import { getCountryMapSummaries, type CountryMapSummary, type VisitRecord } from "@/lib/archive";
import { getTheme } from "@/lib/color-scale";

import { WorldScene } from "./world-scene";

export type MapHostProps = {
  className?: string;
  defaultState?: MapInteractionState;
  onOpenFocusedCountry?: (snapshot: MapHostSnapshot) => void;
  onReturnToWorld?: (snapshot: MapHostSnapshot) => void;
  onSelectedCountryChange?: (selection: MapHostSnapshot["selectedCountry"]) => void;
  onStateChange?: (snapshot: MapHostSnapshot) => void;
  state?: MapInteractionState;
  themeName?: string | null;
  visits?: VisitRecord[];
};

function createArchiveIndex(summaries: CountryMapSummary[]) {
  return new Map(summaries.map((summary) => [summary.countryCode, summary]));
}

export function MapHost({
  className,
  defaultState = defaultMapInteractionState,
  onOpenFocusedCountry,
  onReturnToWorld,
  onSelectedCountryChange,
  onStateChange,
  state,
  themeName = "red",
  visits = mockVisitRecords,
}: MapHostProps) {
  const [uncontrolledState, setUncontrolledState] = useState(defaultState);
  const countries = useMemo(() => loadWorldCountryRecords(), []);
  const archiveSummaries = useMemo(
    () => getCountryMapSummaries(visits, { themeName }),
    [themeName, visits],
  );
  const archiveIndex = useMemo(() => createArchiveIndex(archiveSummaries), [archiveSummaries]);
  const theme = useMemo(() => getTheme(themeName), [themeName]);
  const currentState = state ?? uncontrolledState;

  const getSelection = (selectedCountryCode: string | null) => {
    if (!selectedCountryCode) {
      return null;
    }

    const country = countries.find(
      (worldCountry) => worldCountry.countryCode === selectedCountryCode,
    );

    if (!country) {
      return null;
    }

    return {
      countryCode: country.countryCode,
      displayName: country.displayName,
      summary: archiveIndex.get(country.countryCode) ?? null,
    };
  };

  const emitState = (
    nextState: MapInteractionState,
    reason: "press" | "open" | "return" | "dismiss",
  ) => {
    if (!state) {
      setUncontrolledState(nextState);
    }

    const previousSelection = getSelection(currentState.selectedCountryCode);
    const nextSelection = getSelection(nextState.selectedCountryCode);
    const snapshot = createMapHostSnapshot(nextState, nextSelection);

    if (previousSelection?.countryCode !== nextSelection?.countryCode) {
      onSelectedCountryChange?.(nextSelection);
    }

    if (reason === "open" && snapshot.focusedCountry) {
      onOpenFocusedCountry?.(snapshot);
    }

    if (reason === "return") {
      onReturnToWorld?.(snapshot);
    }

    onStateChange?.(snapshot);
  };

  return (
    <div
      className={
        className ??
        "relative h-[min(70vh,38rem)] min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-[rgba(23,33,38,0.1)] bg-[#f4f1e8]"
      }
      data-country-code={currentState.selectedCountryCode ?? undefined}
      data-view-mode={currentState.viewMode}
    >
      <WorldScene
        archiveIndex={archiveIndex}
        countries={countries}
        emptyColor={theme.emptyColor}
        selectedCountryCode={currentState.selectedCountryCode}
        viewMode={currentState.viewMode}
        onCountryPress={(countryCode) => {
          const nextState = pressMapCountry(currentState, countryCode);
          const reason =
            nextState.viewMode === "country" && currentState.viewMode === "world"
              ? "open"
              : "press";
          emitState(nextState, reason);
        }}
        onDismiss={() => {
          const nextState = dismissMapInteraction(currentState);

          if (
            nextState.selectedCountryCode === currentState.selectedCountryCode &&
            nextState.viewMode === currentState.viewMode
          ) {
            return;
          }

          const reason = currentState.viewMode === "country" ? "return" : "dismiss";
          emitState(nextState, reason);
        }}
      />
    </div>
  );
}
