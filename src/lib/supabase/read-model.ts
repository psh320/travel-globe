import {
  getCityGroupingSummaries,
  getCountryDetailSummary,
  getWorldMapCountrySummaries,
  type ArchiveVisitEntry,
  type CityGroupSummary,
  type CountryDetailSummary,
  type VisitRecord,
  type WorldMapCountrySummary,
} from "@/lib/archive";
import { getOptionalSessionUser } from "@/lib/supabase/auth";
import { createOptionalSupabaseServerClient } from "@/lib/supabase/clients/server";
import { listPhotoAssetsForUser } from "@/lib/supabase/repositories/photo-assets";
import { listTravelPostsForUser } from "@/lib/supabase/repositories/travel-posts";
import { listVisitsForUser } from "@/lib/supabase/repositories/visits";
import {
  toArchiveVisitEntries,
  type ArchiveVisitDetail,
} from "@/lib/supabase/types";

type ReadModelOptions = {
  themeName?: string | null;
};

export type PersistedArchiveReadModel = {
  entries: ArchiveVisitEntry[];
  visits: VisitRecord[];
  visitDetails: ArchiveVisitDetail[];
  countrySummaries: WorldMapCountrySummary[];
};

export function createArchiveVisitEntriesFromDetails(
  visitDetails: ArchiveVisitDetail[],
): ArchiveVisitEntry[] {
  return toArchiveVisitEntries(visitDetails);
}

export function createPersistedArchiveReadModel(
  visitDetails: ArchiveVisitDetail[],
  options: ReadModelOptions = {},
): PersistedArchiveReadModel {
  const entries = createArchiveVisitEntriesFromDetails(visitDetails);

  return {
    entries,
    visits: entries.map((entry) => entry.visit),
    visitDetails,
    countrySummaries: getWorldMapCountrySummaries(entries, options),
  };
}

export function getPersistedWorldMapCountrySummaries(
  visitDetails: ArchiveVisitDetail[],
  options: ReadModelOptions = {},
): WorldMapCountrySummary[] {
  return createPersistedArchiveReadModel(visitDetails, options).countrySummaries;
}

export function getPersistedCountryDetailSummary(
  visitDetails: ArchiveVisitDetail[],
  countryCode: string,
  options: ReadModelOptions = {},
): CountryDetailSummary | null {
  return getCountryDetailSummary(
    createArchiveVisitEntriesFromDetails(visitDetails),
    countryCode,
    options,
  );
}

export function getPersistedCityGroupingSummaries(
  visitDetails: ArchiveVisitDetail[],
  countryCode?: string | null,
  options: ReadModelOptions = {},
): CityGroupSummary[] {
  return getCityGroupingSummaries(
    createArchiveVisitEntriesFromDetails(visitDetails),
    countryCode,
    options,
  );
}

export async function getCurrentUserPersistedArchiveReadModel(
  options: ReadModelOptions = {},
): Promise<PersistedArchiveReadModel | null> {
  const supabase = await createOptionalSupabaseServerClient();
  const user = await getOptionalSessionUser();

  if (!supabase || !user) {
    return null;
  }

  const visitDetails = await listVisitsForUser(supabase, user.id);
  return createPersistedArchiveReadModel(visitDetails, options);
}

export async function getCurrentUserPersistedCountryDetail(
  countryCode: string,
  options: ReadModelOptions = {},
): Promise<CountryDetailSummary | null> {
  const archiveReadModel = await getCurrentUserPersistedArchiveReadModel(options);

  if (!archiveReadModel) {
    return null;
  }

  return getCountryDetailSummary(archiveReadModel.entries, countryCode, options);
}

export async function getCurrentUserPersistedCityGroupingSummaries(
  countryCode?: string | null,
  options: ReadModelOptions = {},
): Promise<CityGroupSummary[] | null> {
  const archiveReadModel = await getCurrentUserPersistedArchiveReadModel(options);

  if (!archiveReadModel) {
    return null;
  }

  return getCityGroupingSummaries(archiveReadModel.entries, countryCode, options);
}

export async function getCurrentUserPersistedArchiveRelations() {
  const supabase = await createOptionalSupabaseServerClient();
  const user = await getOptionalSessionUser();

  if (!supabase || !user) {
    return null;
  }

  const [photoAssets, travelPosts] = await Promise.all([
    listPhotoAssetsForUser(supabase, user.id),
    listTravelPostsForUser(supabase, user.id),
  ]);

  return {
    photoAssets,
    travelPosts,
  };
}
