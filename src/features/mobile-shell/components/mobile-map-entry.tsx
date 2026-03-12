"use client";

import dynamic from "next/dynamic";

import type { ArchiveVisitEntry } from "@/lib/archive";

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
}: {
  initialArchiveEntries?: ArchiveVisitEntry[];
}) {
  return <MobileMapExperience initialArchiveEntries={initialArchiveEntries} />;
}
