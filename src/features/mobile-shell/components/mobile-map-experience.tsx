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
  createArchiveVisitEntries,
  getCountryDetailSummary,
  getWorldMapCountrySummaries,
  getArchiveCounts,
  type ArchiveVisitEntry,
} from "@/lib/archive";

import {
  deriveSelectedCountry,
  syncPanelTabWithMapSnapshot,
} from "../integration-state";
import type { ArchiveHighlight, PanelTab } from "../types";
import { AppShell } from "./app-shell";

type MobileMapExperienceProps = {
  initialArchiveEntries?: ArchiveVisitEntry[];
};

export function MobileMapExperience({
  initialArchiveEntries,
}: MobileMapExperienceProps) {
  const [mapState, setMapState] = useState<MapInteractionState>(
    defaultMapInteractionState,
  );
  const [panelTab, setPanelTab] = useState<PanelTab | null>(null);
  const archiveEntries = useMemo(
    () => initialArchiveEntries ?? createArchiveVisitEntries(mockVisitRecords),
    [initialArchiveEntries],
  );
  const archiveVisits = useMemo(
    () => archiveEntries.map((entry) => entry.visit),
    [archiveEntries],
  );

  const countrySummaries = useMemo(
    () => getWorldMapCountrySummaries(archiveEntries, { themeName: "red" }),
    [archiveEntries],
  );
  const selectedCountry = useMemo(
    () => deriveSelectedCountry(mapState.selectedCountryCode, countrySummaries),
    [countrySummaries, mapState.selectedCountryCode],
  );
  const countryDetail = useMemo(
    () =>
      selectedCountry
        ? getCountryDetailSummary(archiveEntries, selectedCountry.countryCode, {
            themeName: "red",
          })
        : null,
    [archiveEntries, selectedCountry],
  );
  const archiveCounts = useMemo(() => getArchiveCounts(archiveVisits), [archiveVisits]);
  const archiveHighlights: ArchiveHighlight[] = (countryDetail?.cityGroups ?? [])
    .slice(0, 4)
    .map((city) => ({
      id: `${city.countryCode}-${city.cityName}`,
      title: city.cityName,
      subtitle: `${city.visitCount} entries • ${city.photoAssetCount} photos • ${city.travelPostCount} posts`,
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
          countrySummaries={countrySummaries}
          onStateChange={applySnapshot}
          state={mapState}
          themeName="red"
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
