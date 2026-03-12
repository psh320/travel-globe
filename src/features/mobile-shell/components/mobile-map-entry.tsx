"use client";

import dynamic from "next/dynamic";

const MobileMapExperience = dynamic(
  () =>
    import("@/features/mobile-shell/components/mobile-map-experience").then(
      (module) => module.MobileMapExperience,
    ),
  {
    ssr: false,
  },
);

export function MobileMapEntry() {
  return <MobileMapExperience />;
}
