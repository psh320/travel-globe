import type {
  ArchiveHighlight,
  MobileCountrySummary,
  PanelTab,
} from "../types";

type DetailPanelProps = {
  activeTab: PanelTab;
  archiveHighlights: ArchiveHighlight[];
  onClose: () => void;
  onSwitchTab: (tab: PanelTab) => void;
  selectedCountry: MobileCountrySummary | null;
  worldArchiveNotes: string[];
};

export function DetailPanel({
  activeTab,
  archiveHighlights,
  onClose,
  onSwitchTab,
  selectedCountry,
  worldArchiveNotes,
}: DetailPanelProps) {
  const title =
    activeTab === "upload"
      ? "Add a new memory"
      : selectedCountry?.countryName ?? "World archive";

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
              <div className="grid grid-cols-3 gap-2">
                <StatCard
                  label="Entries"
                  value={String(selectedCountry.visitCount)}
                />
                <StatCard
                  label="Cities"
                  value={String(selectedCountry.uniqueCityCount)}
                />
                <StatCard
                  label="Last saved"
                  value={selectedCountry.lastVisitedAt ?? "No date"}
                />
              </div>

              <div className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
                <p className="text-sm font-semibold text-[#172126]">
                  Country detail shell
                </p>
                <p className="mt-2 text-sm text-[#5f6d72]">
                  This panel is ready for focused country stats, grouped archive
                  sections, and richer Map Engine detail views as those outputs land.
                </p>
                <div className="mt-3 inline-flex min-h-11 items-center rounded-full border border-[rgba(23,33,38,0.1)] bg-white px-4 text-sm text-[#172126]">
                  {selectedCountry.countryCode} • Intensity bucket {selectedCountry.intensityBucket}
                </div>
              </div>

              <div className="space-y-2">
                {archiveHighlights.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-[#172126]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-[#5f6d72]">
                      {item.subtitle}
                    </p>
                  </article>
                ))}
              </div>
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
          {(selectedCountry ? archiveHighlights : worldArchiveNotes).map((item) => (
            <article
              key={typeof item === "string" ? item : item.id}
              className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4"
            >
              {typeof item === "string" ? (
                <p className="text-sm text-[#172126]">{item}</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#172126]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[#5f6d72]">
                    {item.subtitle}
                  </p>
                </>
              )}
            </article>
          ))}
        </div>
      ) : null}

      {activeTab === "upload" ? (
        <div className="mt-4 space-y-3">
          <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-[#f7f4ee] p-4">
            <p className="text-sm font-semibold text-[#172126]">
              Photo upload shell
            </p>
            <p className="mt-2 text-sm text-[#5f6d72]">
              Large drop zone, visible progress, and a plain-language location
              review step fit naturally into the mobile sheet.
            </p>
            <div className="mt-3 rounded-[1.25rem] border border-dashed border-[rgba(23,33,38,0.1)] bg-white px-4 py-6 text-sm text-[#5f6d72]">
              Upload from camera roll, then confirm country and city if needed.
            </div>
          </article>
          <article className="rounded-[1.5rem] border border-[rgba(23,33,38,0.1)] bg-white p-4">
            <p className="text-sm font-semibold text-[#172126]">
              Add text entry
            </p>
            <p className="mt-2 text-sm text-[#5f6d72]">
              Manual place selection can be attached by upstream map/data flows
              without changing the shell structure.
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
