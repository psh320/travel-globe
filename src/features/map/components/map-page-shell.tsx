"use client";

import dynamic from "next/dynamic";

const MapExperience = dynamic(
  () => import("@/features/map/components/map-experience").then((module) => module.MapExperience),
  {
    ssr: false,
  },
);

export function MapPageShell() {
  return <MapExperience />;
}
