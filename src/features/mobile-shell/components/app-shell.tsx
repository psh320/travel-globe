import type { ReactNode } from "react";

import type { CountryDetailSummary } from "@/lib/archive";

import type {
  DetailListCard,
  DetailStat,
  MobileCountrySummary,
  MobileSelectedCountry,
  PanelTab,
} from "../types";
import { DetailPanel } from "./detail-panel";

type AppShellProps = {
  activeTab: PanelTab;
  countryDetailSummary: CountryDetailSummary | null;
  countryMemoryCards: DetailListCard[];
  countryStats: DetailStat[];
  countrySummaries: MobileCountrySummary[];
  cityCards: DetailListCard[];
  isDetailOpen: boolean;
  mapViewport: ReactNode;
  onClosePanel: () => void;
  onOpenArchive: () => void;
  onOpenCountry: (tab?: PanelTab) => void;
  onOpenUpload: () => void;
  onSelectCountry: (countryCode: string) => void;
  onSwitchTab: (tab: PanelTab) => void;
  selectedCountry: MobileSelectedCountry | null;
  worldArchiveCards: DetailListCard[];
  worldSummaryCards: DetailListCard[];
  worldArchiveNotes: string[];
};

export function AppShell({
  activeTab,
  countryDetailSummary,
  countryMemoryCards,
  countryStats,
  countrySummaries,
  cityCards,
  isDetailOpen,
  mapViewport,
  onClosePanel,
  onOpenArchive,
  onOpenCountry,
  onOpenUpload,
  onSelectCountry,
  onSwitchTab,
  selectedCountry,
  worldArchiveCards,
  worldSummaryCards,
  worldArchiveNotes,
}: AppShellProps) {
  return (
    <main className="min-h-screen px-4 pb-28 pt-4 sm:px-6 sm:pb-10 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[88rem] flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.65fr)_25rem] lg:gap-7">
        <section className="glass-panel relative overflow-hidden rounded-[2rem] p-4 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_65%)]" />
          <header className="relative flex flex-col gap-5 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex min-h-11 items-center rounded-full border border-[rgba(15,118,110,0.15)] bg-[var(--teal-soft)] px-4 text-sm font-medium text-[#0f766e]">
                Personal atlas
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--muted)]">
                  Travel Globe
                </p>
                <h1 className="font-display mt-3 max-w-3xl text-[2.6rem] leading-[0.95] tracking-[-0.04em] text-[#172126] sm:text-[3.4rem]">
                  A calmer way to keep the places you have been.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Explore your archive through a tactile world map, then drift into
                  country detail, city groupings, and freshly saved memories without
                  leaving the same mobile-first canvas.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem] lg:max-w-[28rem]">
              <MetricCard
                label="Mode"
                value={selectedCountry ? selectedCountry.displayName : "World"}
              />
              <MetricCard
                label="Archive"
                value={
                  selectedCountry?.summary
                    ? `${selectedCountry.summary.visitCount} entries`
                    : "Ready"
                }
              />
              <MetricCard
                label="Focus"
                value={isDetailOpen ? activeTab : "Map"}
              />
            </div>
          </header>

          <div className="relative mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
            <section className="relative overflow-hidden rounded-[1.9rem] border border-[var(--line)] bg-[var(--map-stage)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
              <div className="pointer-events-none absolute inset-x-8 top-3 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_70%)] blur-2xl" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-md">
                  <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--muted)]">
                    Map stage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Tap a country once to mark it, then open the story sheet to browse
                    grouped memories, stats, and recent additions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ActionChip label="Archive" onClick={onOpenArchive} tone="light" />
                  <ActionChip
                    label={selectedCountry ? "Open detail" : "Choose a country"}
                    onClick={() => onOpenCountry("overview")}
                    tone="dark"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-[1.6rem] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,250,244,0.55)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                {mapViewport}
              </div>
            </section>

            <SelectionRail
              countrySummaries={countrySummaries}
              onOpenArchive={onOpenArchive}
              onOpenCountry={onOpenCountry}
              onOpenUpload={onOpenUpload}
              onSelectCountry={onSelectCountry}
              selectedCountry={selectedCountry}
            />
          </div>

          <section className="mt-5 grid gap-3 md:grid-cols-3">
            <AtmosphereCard
              eyebrow="Flow"
              title="One canvas"
              description="Map, detail, and upload now feel like one place instead of three separate scaffolds."
            />
            <AtmosphereCard
              eyebrow="Mobile"
              title="Thumb-first"
              description="Primary actions stay in reach, sheets rise cleanly, and detail stays legible in portrait."
            />
            <AtmosphereCard
              eyebrow="Memory"
              title="Story-led"
              description="Stats stay crisp, but the experience now leans into places, recency, and visual rhythm."
            />
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <DetailPanel
              activeTab={activeTab}
              countryDetailSummary={countryDetailSummary}
              countryMemoryCards={countryMemoryCards}
              countryStats={countryStats}
              cityCards={cityCards}
              onClose={onClosePanel}
              onSwitchTab={onSwitchTab}
              selectedCountry={selectedCountry}
              worldArchiveCards={worldArchiveCards}
              worldSummaryCards={worldSummaryCards}
              worldArchiveNotes={worldArchiveNotes}
            />
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[rgba(248,242,233,0.9)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            className="min-h-12 flex-1 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 text-sm font-semibold text-[#172126] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => onOpenCountry("overview")}
            disabled={!selectedCountry}
          >
            {isDetailOpen ? "Reopen detail" : "Open detail"}
          </button>
          <button
            className="min-h-12 flex-1 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 text-sm font-semibold text-[#172126]"
            type="button"
            onClick={onOpenArchive}
          >
            Archive
          </button>
          <button
            className="min-h-12 flex-1 rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(143,61,34,0.25)]"
            type="button"
            onClick={onOpenUpload}
          >
            Add
          </button>
        </div>
      </div>

      {isDetailOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(23,33,38,0.28)] lg:hidden">
          <button
            type="button"
            aria-label="Close detail panel"
            className="absolute inset-0"
            onClick={onClosePanel}
          />
          <div className="glass-panel-strong sheet-enter absolute inset-x-0 bottom-0 rounded-t-[2rem] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgba(33,44,54,0.16)]">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[rgba(23,33,38,0.12)]" />
            <DetailPanel
              activeTab={activeTab}
              countryDetailSummary={countryDetailSummary}
              countryMemoryCards={countryMemoryCards}
              countryStats={countryStats}
              cityCards={cityCards}
              onClose={onClosePanel}
              onSwitchTab={onSwitchTab}
              selectedCountry={selectedCountry}
              worldArchiveCards={worldArchiveCards}
              worldSummaryCards={worldSummaryCards}
              worldArchiveNotes={worldArchiveNotes}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function SelectionRail({
  countrySummaries,
  onOpenArchive,
  onOpenCountry,
  onOpenUpload,
  onSelectCountry,
  selectedCountry,
}: {
  countrySummaries: MobileCountrySummary[];
  onOpenArchive: () => void;
  onOpenCountry: (tab?: PanelTab) => void;
  onOpenUpload: () => void;
  onSelectCountry: (countryCode: string) => void;
  selectedCountry: MobileSelectedCountry | null;
}) {
  return (
    <section className="grid gap-3">
      <div className="glass-panel-strong rounded-[1.7rem] p-4">
        <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--muted)]">
          Selected place
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-display text-[2rem] leading-none tracking-[-0.04em] text-[#172126]">
              {selectedCountry?.displayName ?? "Choose a country"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {selectedCountry
                ? selectedCountry.summary
                  ? `${selectedCountry.countryCode} • ${selectedCountry.summary.visitCount} saved entries • bucket ${selectedCountry.summary.intensityBucket}`
                  : `${selectedCountry.countryCode} • No archive entries yet`
                : "Select from the globe or the rhythm rail to open detail."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="min-h-12 rounded-2xl bg-[#172126] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,33,38,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => onOpenCountry("overview")}
              disabled={!selectedCountry}
            >
              Open country detail
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 text-sm font-semibold text-[#172126]"
              type="button"
              onClick={onOpenArchive}
            >
              Browse archive content
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[rgba(200,100,59,0.18)] bg-[var(--accent-soft)] px-4 text-sm font-semibold text-[var(--accent-deep)]"
              type="button"
              onClick={onOpenUpload}
            >
              Add visit or upload photo
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[1.7rem] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--muted)]">
            Country rhythm
          </p>
          <span className="text-xs text-[var(--muted)]">
            {countrySummaries.length} saved
          </span>
        </div>
        <div className="soft-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {countrySummaries.map((country) => {
            const isSelected =
              country.countryCode === selectedCountry?.countryCode;

            return (
              <button
                key={country.countryCode}
                type="button"
                onClick={() => onSelectCountry(country.countryCode)}
                className={`min-h-[6.25rem] min-w-[8.8rem] shrink-0 rounded-[1.5rem] border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-transparent bg-[#172126] text-white shadow-[0_16px_34px_rgba(23,33,38,0.18)]"
                    : "border-[var(--line)] bg-[rgba(255,255,255,0.82)] text-[#172126]"
                }`}
              >
                <span
                  className="mb-3 block h-2.5 w-12 rounded-full"
                  style={{ backgroundColor: country.fillColor }}
                />
                <span className="block text-sm font-semibold">
                  {country.countryName}
                </span>
                <span className="mt-1 block text-xs opacity-75">
                  {country.countryCode} • {country.visitCount} entries
                </span>
                <span className="mt-4 block text-xs opacity-65">
                  {country.uniqueCityCount} cities • tone {country.intensityBucket}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--line)] bg-[rgba(255,255,255,0.64)] px-4 py-3">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[#172126]">{value}</p>
    </div>
  );
}

function AtmosphereCard({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className="glass-panel-strong rounded-[1.5rem] p-4">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <p className="font-display mt-3 text-[1.55rem] leading-none tracking-[-0.04em] text-[#172126]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </article>
  );
}

function ActionChip({
  label,
  onClick,
  tone,
}: {
  label: string;
  onClick: () => void;
  tone: "dark" | "light";
}) {
  return (
    <button
      className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${
        tone === "dark"
          ? "bg-[var(--accent)] text-white shadow-[0_10px_24px_rgba(143,61,34,0.22)]"
          : "border border-[var(--line)] bg-[rgba(255,255,255,0.7)] text-[#172126]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
