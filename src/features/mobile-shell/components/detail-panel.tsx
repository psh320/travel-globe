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
    <section className="rounded-[1.75rem] border border-[rgba(23,33,38,0.1)] bg-[rgba(255,255,255,0.96)] p-4 shadow-[0_24px_70px_rgba(33,44,54,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f6d72]">
            {activeTab === "archive"
              ? "Archive"
              : activeTab === "upload"
                ? "Upload"
                : "Country detail"}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#172126]">
            {title}
          </h2>
        </div>
        <button
          className="min-h-11 rounded-full border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm font-medium text-[#172126]"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-[1.25rem] bg-[#eef1ec] p-1">
        {(["overview", "archive", "upload"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onSwitchTab(tab)}
            className={`min-h-11 rounded-2xl px-3 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "bg-white text-[#172126] shadow-sm"
                : "text-[#5f6d72]"
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

              <div className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
                <p className="text-sm font-semibold text-[#172126]">
                  Country detail
                </p>
                <p className="mt-2 text-sm text-[#5f6d72]">
                  Stats lead, city grouping follows, and saved memories stay visible
                  in the same touch-friendly sheet.
                </p>
                <div className="mt-3 inline-flex min-h-11 items-center rounded-full border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm text-[#172126]">
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
                <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4">
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
            <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
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
                <article
                  key={item}
                  className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4"
                >
                  <p className="text-sm text-[#172126]">{item}</p>
                </article>
              ))}
            </>
          )}
        </div>
      ) : null}

      {activeTab === "upload" ? (
        <div className="mt-4 space-y-3">
          <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
            <p className="text-sm font-semibold text-[#172126]">
              Create archive entry
            </p>
            <p className="mt-2 text-sm text-[#5f6d72]">
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
          <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4">
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
    <div className="rounded-[1.25rem] border border-[rgba(23,33,38,0.1)] bg-white p-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#5f6d72]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#172126]">
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
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#5f6d72]">
        {heading}
      </p>
      {cards.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4"
        >
          <p className="text-sm font-semibold text-[#172126]">{item.title}</p>
          <p className="mt-1 text-sm text-[#5f6d72]">{item.subtitle}</p>
          {item.supportingText ? (
            <p className="mt-2 text-sm text-[#3e4a50]">{item.supportingText}</p>
          ) : null}
          {item.meta.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.meta.map((metaItem) => (
                <span
                  key={metaItem}
                  className="inline-flex min-h-9 items-center rounded-full bg-[#eef1ec] px-3 text-xs font-medium text-[#304048]"
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
