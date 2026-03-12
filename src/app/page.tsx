import { MobileMapEntry } from "@/features/mobile-shell/components/mobile-map-entry";
import { getCurrentUserPersistedArchiveReadModel } from "@/lib/supabase";

export default async function Home() {
  const persistedArchive = await getCurrentUserPersistedArchiveReadModel({
    themeName: "red",
  });

  return (
    <MobileMapEntry
      initialArchiveEntries={persistedArchive?.entries}
      initialVisitDetails={persistedArchive?.visitDetails}
    />
  );
}
