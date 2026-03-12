"use client";

import { useMemo, useState } from "react";

import { MapHost } from "@/features/map/components/map-host";
import { mockVisitRecords } from "@/features/map/data/mock-visit-records";
import {
  defaultMapInteractionState,
  openFocusedCountry,
  pressMapCountry,
  returnToWorld,
} from "@/features/map/lib/map-interaction";
import type { MapHostSnapshot, MapInteractionState } from "@/features/map/types";
import {
  getArchiveCounts,
  getCityMapSummaries,
  getCountryMapSummaries,
} from "@/lib/archive";

import {
  deriveSelectedCountry,
  syncPanelTabWithMapSnapshot,
} from "../integration-state";
import type { ArchiveHighlight, PanelTab } from "../types";
import { AppShell } from "./app-shell";

export function MobileMapExperience() {
  const [mapState, setMapState] = useState<MapInteractionState>(
    defaultMapInteractionState,
  );
  const [panelTab, setPanelTab] = useState<PanelTab | null>(null);

  const countrySummaries = useMemo(
    () => getCountryMapSummaries(mockVisitRecords, { themeName: "red" }),
    [],
  );
  const selectedCountry = useMemo(
    () => deriveSelectedCountry(mapState.selectedCountryCode, countrySummaries),
    [countrySummaries, mapState.selectedCountryCode],
  );
  const citySummaries = useMemo(
    () =>
      getCityMapSummaries(
        mockVisitRecords,
        selectedCountry?.countryCode ?? null,
        { themeName: "red" },
      ),
    [selectedCountry],
  );
  const archiveCounts = useMemo(() => getArchiveCounts(mockVisitRecords), []);
  const archiveHighlights: ArchiveHighlight[] = citySummaries.slice(0, 4).map((city) => ({
    id: `${city.countryCode}-${city.cityName}`,
    title: city.cityName,
    subtitle: `${city.visitCount} entries • bucket ${city.intensityBucket}`,
  }));
  const worldArchiveNotes = [
    `${archiveCounts.totalVisits} saved visits are ready for archive browsing.`,
    `${archiveCounts.countriesVisited} countries and ${archiveCounts.citiesVisited} cities are available in the current archive dataset.`,
    "Tap once to select, then tap again or use Open detail to enter focused country mode.",
  ];

  function applySnapshot(snapshot: MapHostSnapshot) {
    setMapState({
      selectedCountryCode: snapshot.selectedCountryCode,
      viewMode: snapshot.viewMode,
    });
    setPanelTab((currentTab) => syncPanelTabWithMapSnapshot(currentTab, snapshot));
  }

  function handleSelectCountry(countryCode: string) {
    const nextState = pressMapCountry(mapState, countryCode);
    setMapState(nextState);

    if (nextState.viewMode === "country") {
      setPanelTab((currentTab) => currentTab ?? "overview");
    }
  }

  function handleOpenCountry(tab: PanelTab = "overview") {
    if (!mapState.selectedCountryCode) {
      return;
    }

    setMapState((currentState) => openFocusedCountry(currentState));
    setPanelTab(tab);
  }

  function handleOpenArchive() {
    if (mapState.selectedCountryCode) {
      setMapState((currentState) => openFocusedCountry(currentState));
    }

    setPanelTab("archive");
  }

  function handleOpenUpload() {
    setPanelTab("upload");
  }

  function handleClosePanel() {
    setPanelTab(null);

    if (mapState.viewMode === "country") {
      setMapState((currentState) => returnToWorld(currentState));
    }
  }

  const activeTab = panelTab ?? "overview";

  return (
    <AppShell
      activeTab={activeTab}
      archiveHighlights={archiveHighlights}
      countrySummaries={countrySummaries}
      isDetailOpen={panelTab !== null}
      mapViewport={
        <MapHost
          className="h-[min(70vh,38rem)] min-h-[22rem]"
          onStateChange={applySnapshot}
          state={mapState}
          themeName="red"
          visits={mockVisitRecords}
        />
      }
      onClosePanel={handleClosePanel}
      onOpenArchive={handleOpenArchive}
      onOpenCountry={handleOpenCountry}
      onOpenUpload={handleOpenUpload}
      onSelectCountry={handleSelectCountry}
      onSwitchTab={setPanelTab}
      selectedCountry={selectedCountry}
      worldArchiveNotes={worldArchiveNotes}
    />
  );
}
