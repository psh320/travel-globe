import type { CountryDetailSummary } from "@/lib/archive";

import type { DetailListCard, DetailStat, MobileSelectedCountry, PanelTab } from "../types";
import { ArchiveCreateForm } from "./archive-create-form";

type DetailPanelProps = {
  activeTab: PanelTab;
  countryDetailSummary: CountryDetailSummary | null;
  countryMemoryCards: DetailListCard[];
  countryStats: DetailStat[];
  cityCards: DetailListCard[];
  onClose: () => void;
  onSwitchTab: (tab: PanelTab) => void;
  selectedCountry: MobileSelectedCountry | null;
  worldArchiveCards: DetailListCard[];
  worldSummaryCards: DetailListCard[];
  worldArchiveNotes: string[];
};

export function DetailPanel({
  activeTab,
  countryDetailSummary,
  countryMemoryCards,
  countryStats,
  cityCards,
  onClose,
  onSwitchTab,
  selectedCountry,
  worldArchiveCards,
  worldSummaryCards,
  worldArchiveNotes,
}: DetailPanelProps) {
  const title =
    activeTab === "upload"
      ? "Add a new memory"
      : selectedCountry?.displayName ?? "World archive";

  return (
    <section className="glass-panel-strong rounded-[1.9rem] p-4 lg:p-5">
      <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            {activeTab === "archive"
              ? "Archive"
              : activeTab === "upload"
                ? "Upload"
                : "Country detail"}
          </p>
          <h2 className="font-display mt-3 text-[2.1rem] leading-none tracking-[-0.045em] text-[#172126]">
            {title}
          </h2>
        </div>
        <button
          className="min-h-11 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-4 text-sm font-medium text-[#172126]"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-[1.35rem] bg-[rgba(216,226,220,0.7)] p-1">
        {(["overview", "archive", "upload"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onSwitchTab(tab)}
            className={`min-h-11 rounded-2xl px-3 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "bg-[rgba(255,255,255,0.92)] text-[#172126] shadow-sm"
                : "text-[var(--muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="mt-4 space-y-4">
          {selectedCountry ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {(countryStats.length > 0
                  ? countryStats
                  : [
                      {
                        label: "Entries",
                        value: String(selectedCountry.summary?.visitCount ?? 0),
                      },
                      {
                        label: "Cities",
                        value: String(selectedCountry.summary?.uniqueCityCount ?? 0),
                      },
                    ]).map((stat) => (
                  <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>

              <div className="rounded-[1.65rem] border border-[var(--line)] bg-[rgba(241,234,224,0.72)] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
                  Focus state
                </p>
                <p className="font-display mt-3 text-[1.75rem] leading-none tracking-[-0.04em] text-[#172126]">
                  The detail sheet stays anchored to the map.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Stats lead, city grouping follows, and saved memories stay close to the
                  selected country instead of drifting into generic cards.
                </p>
                <div className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 text-sm text-[#172126]">
                  {countryDetailSummary
                    ? `${selectedCountry.countryCode} • ${countryDetailSummary.photoAssetCount} photos • ${countryDetailSummary.travelPostCount} posts`
                    : `${selectedCountry.countryCode} • No saved archive yet`}
                </div>
              </div>

              {cityCards.length > 0 ? (
                <SectionCards heading="City groups" cards={cityCards} />
              ) : null}

              {countryMemoryCards.length > 0 ? (
                <SectionCards
                  heading="Saved memories"
                  cards={countryMemoryCards.slice(0, 5)}
                />
              ) : (
                <article className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.84)] p-4">
                  <p className="text-sm font-semibold text-[#172126]">
                    No archive entries yet
                  </p>
                  <p className="mt-1 text-sm text-[#5f6d72]">
                    This country is selected and focus-ready, but there are no saved
                    visits to show in the archive panel yet.
                  </p>
                </article>
              )}
            </>
          ) : (
            <article className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(241,234,224,0.72)] p-4">
              <p className="text-sm font-semibold text-[#172126]">
                Select a country first
              </p>
              <p className="mt-2 text-sm text-[#5f6d72]">
                The shell expects a selected country from the map or summary rail,
                then opens full detail through the same touch-friendly panel.
              </p>
            </article>
          )}
        </div>
      ) : null}

      {activeTab === "archive" ? (
        <div className="mt-4 space-y-3">
          {selectedCountry ? (
            <>
              {countryMemoryCards.length > 0 ? (
                <SectionCards
                  heading={`${selectedCountry.displayName} archive`}
                  cards={countryMemoryCards}
                />
              ) : null}
              {cityCards.length > 0 ? (
                <SectionCards heading="By city" cards={cityCards} />
              ) : null}
            </>
          ) : (
            <>
              {worldSummaryCards.length > 0 ? (
                <SectionCards heading="Top countries" cards={worldSummaryCards} />
              ) : null}
              {worldArchiveCards.length > 0 ? (
                <SectionCards heading="Recent memories" cards={worldArchiveCards} />
              ) : null}
              {worldArchiveNotes.map((item) => (
                <article key={item} className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.84)] p-4">
                  <p className="text-sm text-[#172126]">{item}</p>
                </article>
              ))}
            </>
          )}
        </div>
      ) : null}

      {activeTab === "upload" ? (
        <div className="mt-4 space-y-3">
          <article className="rounded-[1.65rem] border border-[var(--line)] bg-[rgba(241,234,224,0.72)] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              Create
            </p>
            <p className="font-display mt-3 text-[1.75rem] leading-none tracking-[-0.04em] text-[#172126]">
              Add the next memory without leaving the map.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Save a photo memory or text note, confirm the place, and let the map refresh
              after the entry is written.
            </p>
            <div className="mt-4">
              <ArchiveCreateForm
                defaultCityName={null}
                defaultCountryCode={selectedCountry?.countryCode}
                defaultCountryName={selectedCountry?.displayName}
                onSaved={() => onSwitchTab("archive")}
              />
            </div>
          </article>
          <article className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.84)] p-4">
            <p className="text-sm font-semibold text-[#172126]">
              Manual confirmation
            </p>
            <p className="mt-2 text-sm text-[#5f6d72]">
              Country and city stay editable, so missing EXIF or low-confidence location data
              never blocks saving a memory.
            </p>
          </article>
        </div>
      ) : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] p-3">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </p>
      <p className="font-display mt-2 text-[1.8rem] leading-none tracking-[-0.05em] text-[#172126]">
        {value}
      </p>
    </div>
  );
}

function SectionCards({
  cards,
  heading,
}: {
  cards: DetailListCard[];
  heading: string;
}) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
        {heading}
      </p>
      {cards.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.82)] p-4"
        >
          <p className="text-sm font-semibold text-[#172126]">{item.title}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{item.subtitle}</p>
          {item.supportingText ? (
            <p className="mt-2 text-sm text-[#3e4a50]">{item.supportingText}</p>
          ) : null}
          {item.meta.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.meta.map((metaItem) => (
                <span
                  key={metaItem}
                  className="inline-flex min-h-9 items-center rounded-full bg-[rgba(213,236,232,0.72)] px-3 text-xs font-medium text-[#304048]"
                >
                  {metaItem}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}
