"use client";

import dynamic from "next/dynamic";

import type { ArchiveVisitEntry } from "@/lib/archive";
import type { ArchiveVisitDetail } from "@/lib/supabase";

const MobileMapExperience = dynamic(
  () =>
    import("@/features/mobile-shell/components/mobile-map-experience").then(
      (module) => module.MobileMapExperience,
    ),
  {
    ssr: false,
  },
);

export function MobileMapEntry({
  initialArchiveEntries,
  initialVisitDetails,
}: {
  initialArchiveEntries?: ArchiveVisitEntry[];
  initialVisitDetails?: ArchiveVisitDetail[];
}) {
  return (
    <MobileMapExperience
      initialArchiveEntries={initialArchiveEntries}
      initialVisitDetails={initialVisitDetails}
    />
  );
}
