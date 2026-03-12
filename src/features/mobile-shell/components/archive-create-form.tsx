"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { extractExifMetadata } from "@/lib/exif/parse";

type ArchiveCreateFormProps = {
  defaultCityName?: string | null;
  defaultCountryCode?: string | null;
  defaultCountryName?: string | null;
  onSaved?: () => void;
};

type DraftState = {
  cityName: string;
  content: string;
  countryCode: string;
  countryName: string;
  inferredLatitude: string;
  inferredLongitude: string;
  sourceType: "photo" | "text";
  title: string;
  visitedAt: string;
};

const emptyDraft: DraftState = {
  cityName: "",
  content: "",
  countryCode: "",
  countryName: "",
  inferredLatitude: "",
  inferredLongitude: "",
  sourceType: "photo",
  title: "",
  visitedAt: "",
};

export function ArchiveCreateForm({
  defaultCityName,
  defaultCountryCode,
  defaultCountryName,
  onSaved,
}: ArchiveCreateFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<DraftState>({
    ...emptyDraft,
    cityName: defaultCityName ?? "",
    countryCode: defaultCountryCode ?? "",
    countryName: defaultCountryName ?? "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft((current) => ({
      ...current,
      cityName: current.cityName || defaultCityName || "",
      countryCode: current.countryCode || defaultCountryCode || "",
      countryName: current.countryName || defaultCountryName || "",
    }));
  }, [defaultCityName, defaultCountryCode, defaultCountryName]);

  async function handleFileChange(file: File | null) {
    setSelectedFile(file);
    setErrorMessage(null);

    if (!file) {
      return;
    }

    setStatusMessage("Reading photo metadata…");

    try {
      const metadata = extractExifMetadata(await file.arrayBuffer());

      setDraft((current) => ({
        ...current,
        visitedAt: current.visitedAt || toDateInputValue(metadata.capturedAt),
        inferredLatitude:
          metadata.latitude !== null ? String(metadata.latitude) : current.inferredLatitude,
        inferredLongitude:
          metadata.longitude !== null
            ? String(metadata.longitude)
            : current.inferredLongitude,
      }));

      if (metadata.latitude !== null && metadata.longitude !== null) {
        setStatusMessage("EXIF coordinates found. Confirm the location before saving.");
      } else if (metadata.capturedAt) {
        setStatusMessage("Capture date found. Add or confirm the place before saving.");
      } else {
        setStatusMessage("No EXIF location found. Manual place confirmation is required.");
      }
    } catch {
      setStatusMessage("Could not read EXIF metadata. Manual place confirmation is required.");
    }
  }

  function updateDraft<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setDraft({
      ...emptyDraft,
      cityName: defaultCityName ?? "",
      countryCode: defaultCountryCode ?? "",
      countryName: defaultCountryName ?? "",
    });
    setSelectedFile(null);
    setStatusMessage("Saved. The archive will refresh with the new entry.");
    setErrorMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(
      draft.sourceType === "photo" ? "Uploading photo and saving visit…" : "Saving visit…",
    );

    startTransition(async () => {
      try {
        const body = new FormData();
        body.set("sourceType", draft.sourceType);
        body.set("countryCode", draft.countryCode);
        body.set("countryName", draft.countryName);
        body.set("cityName", draft.cityName);
        body.set("visitedAt", toIsoDateTime(draft.visitedAt));
        body.set("title", draft.title);
        body.set("content", draft.content);
        body.set("inferredLatitude", draft.inferredLatitude);
        body.set("inferredLongitude", draft.inferredLongitude);

        if (selectedFile) {
          body.set("file", selectedFile);
        }

        const response = await fetch("/api/archive/entries", {
          body,
          method: "POST",
        });

        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to save archive entry");
        }

        resetForm();
        onSaved?.();
        router.refresh();
      } catch (error) {
        setStatusMessage(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to save archive entry",
        );
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[#eef1ec] p-1">
        {(["photo", "text"] as const).map((mode) => (
          <button
            key={mode}
            className={`min-h-11 rounded-2xl px-3 text-sm font-semibold capitalize ${
              draft.sourceType === mode
                ? "bg-white text-[#172126] shadow-sm"
                : "text-[#5f6d72]"
            }`}
            onClick={() => updateDraft("sourceType", mode)}
            type="button"
          >
            {mode === "photo" ? "Photo upload" : "Text entry"}
          </button>
        ))}
      </div>

      {draft.sourceType === "photo" ? (
        <label className="block rounded-[1.5rem] border border-dashed border-[rgba(23,33,38,0.16)] bg-white px-4 py-5 text-sm text-[#5f6d72]">
          <span className="block text-sm font-semibold text-[#172126]">
            Choose a photo
          </span>
          <span className="mt-1 block">
            EXIF metadata is read when available, but you can always correct the place manually.
          </span>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="mt-4 block w-full text-sm"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0] ?? null;
              void handleFileChange(file);
            }}
            type="file"
          />
        </label>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Country code"
          onChange={(value) => updateDraft("countryCode", value.toUpperCase())}
          placeholder="JP"
          value={draft.countryCode}
        />
        <Field
          label="Country name"
          onChange={(value) => updateDraft("countryName", value)}
          placeholder="Japan"
          value={draft.countryName}
        />
        <Field
          label="City name"
          onChange={(value) => updateDraft("cityName", value)}
          placeholder="Tokyo"
          value={draft.cityName}
        />
        <Field
          label="Visited date"
          onChange={(value) => updateDraft("visitedAt", value)}
          type="date"
          value={draft.visitedAt}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Latitude (optional)"
          onChange={(value) => updateDraft("inferredLatitude", value)}
          placeholder="35.6764"
          value={draft.inferredLatitude}
        />
        <Field
          label="Longitude (optional)"
          onChange={(value) => updateDraft("inferredLongitude", value)}
          placeholder="139.6500"
          value={draft.inferredLongitude}
        />
      </div>

      <Field
        label="Title (optional)"
        onChange={(value) => updateDraft("title", value)}
        placeholder="Tokyo arrival"
        value={draft.title}
      />

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-[#172126]">
          {draft.sourceType === "photo" ? "Caption or notes (optional)" : "Travel note"}
        </span>
        <textarea
          className="min-h-28 w-full rounded-[1.25rem] border border-[rgba(23,33,38,0.12)] bg-white px-4 py-3 text-sm text-[#172126] outline-none transition focus:border-[#0f766e]"
          onChange={(event) => updateDraft("content", event.currentTarget.value)}
          placeholder={
            draft.sourceType === "photo"
              ? "Add a few details about the memory."
              : "Write the travel memory you want to save."
          }
          value={draft.content}
        />
      </label>

      {statusMessage ? (
        <p className="rounded-[1.25rem] bg-[#eef7f5] px-4 py-3 text-sm text-[#0f766e]">
          {statusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-[1.25rem] bg-[#fdecec] px-4 py-3 text-sm text-[#b42318]">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="min-h-12 w-full rounded-2xl bg-[#0f766e] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          isPending ||
          !draft.countryCode ||
          !draft.countryName ||
          (draft.sourceType === "photo" && !selectedFile) ||
          (draft.sourceType === "text" && !draft.content.trim())
        }
        type="submit"
      >
        {isPending
          ? draft.sourceType === "photo"
            ? "Saving photo visit…"
            : "Saving entry…"
          : draft.sourceType === "photo"
            ? "Save photo visit"
            : "Save text entry"}
      </button>
    </form>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-[#172126]">{label}</span>
      <input
        className="min-h-12 w-full rounded-[1.25rem] border border-[rgba(23,33,38,0.12)] bg-white px-4 text-sm text-[#172126] outline-none transition focus:border-[#0f766e]"
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function toIsoDateTime(value: string) {
  if (!value) {
    return "";
  }

  return new Date(`${value}T00:00:00.000Z`).toISOString();
}
