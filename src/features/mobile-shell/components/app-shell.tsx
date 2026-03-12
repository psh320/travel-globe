import type { ReactNode } from "react";

import type {
  ArchiveHighlight,
  MobileCountrySummary,
  MobileSelectedCountry,
  PanelTab,
} from "../types";
import { DetailPanel } from "./detail-panel";

type AppShellProps = {
  activeTab: PanelTab;
  archiveHighlights: ArchiveHighlight[];
  countrySummaries: MobileCountrySummary[];
  isDetailOpen: boolean;
  mapViewport: ReactNode;
  onClosePanel: () => void;
  onOpenArchive: () => void;
  onOpenCountry: (tab?: PanelTab) => void;
  onOpenUpload: () => void;
  onSelectCountry: (countryCode: string) => void;
  onSwitchTab: (tab: PanelTab) => void;
  selectedCountry: MobileSelectedCountry | null;
  worldArchiveNotes: string[];
};

export function AppShell({
  activeTab,
  archiveHighlights,
  countrySummaries,
  isDetailOpen,
  mapViewport,
  onClosePanel,
  onOpenArchive,
  onOpenCountry,
  onOpenUpload,
  onSelectCountry,
  onSwitchTab,
  selectedCountry,
  worldArchiveNotes,
}: AppShellProps) {
  return (
    <main className="min-h-screen px-4 pb-28 pt-4 sm:px-6 sm:pb-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.5fr)_24rem] lg:gap-6">
        <section className="flex min-h-[calc(100vh-9rem)] flex-col rounded-[2rem] border border-[rgba(23,33,38,0.1)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_24px_70px_rgba(33,44,54,0.14)] backdrop-blur md:p-6">
          <header className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="inline-flex min-h-11 items-center rounded-full bg-[#d6f2ee] px-4 text-sm font-medium text-[#0f766e]">
                Mobile-first archive shell
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f6d72]">
                  Travel Globe
                </p>
                <h1 className="max-w-lg text-3xl font-semibold tracking-[-0.04em] text-[#172126] sm:text-4xl">
                  Touch-friendly shell around map selection, detail sheets, and
                  archive actions.
                </h1>
              </div>
            </div>
            <div className="hidden min-h-11 items-center rounded-full border border-[rgba(23,33,38,0.1)] bg-white/75 px-4 text-sm text-[#5f6d72] sm:inline-flex">
              Portrait-ready shell
            </div>
          </header>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <section className="rounded-[1.75rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#172126]">
                    World view
                  </p>
                  <p className="text-sm text-[#5f6d72]">
                    The shell hosts Map Engine output without owning rendering
                    details.
                  </p>
                </div>
                <button
                  className="min-h-11 rounded-full border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm font-medium text-[#172126]"
                  type="button"
                  onClick={onOpenArchive}
                >
                  View archive
                </button>
              </div>

              <div className="mt-4">{mapViewport}</div>
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

          <section className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[#172126]">
                Archive drawer
              </p>
              <p className="mt-2 text-sm text-[#5f6d72]">
                On phones, detail content rises from the bottom so the map remains
                visually present.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[#172126]">
                Upload flow
              </p>
              <p className="mt-2 text-sm text-[#5f6d72]">
                Add-entry actions stay near the thumb zone and work without hover.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white/84 p-4">
              <p className="text-sm font-semibold text-[#172126]">
                Narrow-screen detail
              </p>
              <p className="mt-2 text-sm text-[#5f6d72]">
                Stats lead, archive follows, and the panel stays calm and legible in
                portrait.
              </p>
            </article>
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <DetailPanel
              activeTab={activeTab}
              archiveHighlights={archiveHighlights}
              onClose={onClosePanel}
              onSwitchTab={onSwitchTab}
              selectedCountry={selectedCountry}
              worldArchiveNotes={worldArchiveNotes}
            />
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(23,33,38,0.1)] bg-[rgba(250,247,241,0.94)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            className="min-h-12 flex-1 rounded-2xl border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm font-semibold text-[#172126] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => onOpenCountry("overview")}
            disabled={!selectedCountry}
          >
            {isDetailOpen ? "Reopen detail" : "Open detail"}
          </button>
          <button
            className="min-h-12 flex-1 rounded-2xl border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm font-semibold text-[#172126]"
            type="button"
            onClick={onOpenArchive}
          >
            Archive
          </button>
          <button
            className="min-h-12 flex-1 rounded-2xl bg-[#0f766e] px-4 text-sm font-semibold text-white"
            type="button"
            onClick={onOpenUpload}
          >
            Add
          </button>
        </div>
      </div>

      {isDetailOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(23,33,38,0.24)] lg:hidden">
          <button
            type="button"
            aria-label="Close detail panel"
            className="absolute inset-0"
            onClick={onClosePanel}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-white/70 bg-[rgba(255,255,255,0.96)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgba(33,44,54,0.16)]">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[rgba(23,33,38,0.12)]" />
            <DetailPanel
              activeTab={activeTab}
              archiveHighlights={archiveHighlights}
              onClose={onClosePanel}
              onSwitchTab={onSwitchTab}
              selectedCountry={selectedCountry}
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
      <div className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white/86 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f6d72]">
          Selection
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-lg font-semibold text-[#172126]">
              {selectedCountry?.displayName ?? "Choose a country"}
            </p>
            <p className="text-sm text-[#5f6d72]">
              {selectedCountry
                ? selectedCountry.summary
                  ? `${selectedCountry.countryCode} • ${selectedCountry.summary.visitCount} entries`
                  : `${selectedCountry.countryCode} • No archive entries yet`
                : "Select from map output or the summary rail to open detail."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="min-h-12 rounded-2xl bg-[#172126] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => onOpenCountry("overview")}
              disabled={!selectedCountry}
            >
              Open country detail
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm font-semibold text-[#172126]"
              type="button"
              onClick={onOpenArchive}
            >
              Browse archive content
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[rgba(23,33,38,0.1)] bg-[#d6f2ee] px-4 text-sm font-semibold text-[#0f766e]"
              type="button"
              onClick={onOpenUpload}
            >
              Add visit or upload photo
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white/74 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f6d72]">
          Country summaries
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {countrySummaries.map((country) => {
            const isSelected =
              country.countryCode === selectedCountry?.countryCode;

            return (
              <button
                key={country.countryCode}
                type="button"
                onClick={() => onSelectCountry(country.countryCode)}
                className={`min-h-12 shrink-0 rounded-2xl border px-4 text-left ${
                  isSelected
                    ? "border-transparent bg-[#172126] text-white"
                    : "border-[rgba(23,33,38,0.1)] bg-white text-[#172126]"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {country.countryName}
                </span>
                <span className="block text-xs opacity-70">
                  {country.countryCode} • bucket {country.intensityBucket}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
