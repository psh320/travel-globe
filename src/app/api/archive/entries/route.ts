import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import {
  buildPhotoAssetDraft,
  buildTravelPostDraft,
  buildVisitDraft,
} from "@/lib/archive/create-entry";
import { requireSessionUser } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/clients/server";
import { createPhotoAsset } from "@/lib/supabase/repositories/photo-assets";
import { createTravelPost } from "@/lib/supabase/repositories/travel-posts";
import { createVisit } from "@/lib/supabase/repositories/visits";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const supabase = await createSupabaseServerClient();
    const formData = await request.formData();

    const sourceType = formData.get("sourceType");

    if (sourceType !== "photo" && sourceType !== "text") {
      return NextResponse.json(
        { error: "Source type must be photo or text" },
        { status: 400 },
      );
    }

    const visitId = crypto.randomUUID();
    const photoAssetId = sourceType === "photo" ? crypto.randomUUID() : null;
    const file = formData.get("file");

    const visitDraft = buildVisitDraft({
      cityName: formData.get("cityName")?.toString() ?? null,
      content: formData.get("content")?.toString() ?? null,
      countryCode: formData.get("countryCode")?.toString() ?? "",
      countryName: formData.get("countryName")?.toString() ?? "",
      fileName: file instanceof File ? file.name : null,
      fileSizeBytes: file instanceof File ? file.size : null,
      inferredCityName: formData.get("inferredCityName")?.toString() || null,
      inferredConfidenceLevel:
        parseOptionalConfidence(formData.get("inferredConfidenceLevel")),
      inferredCountryCode:
        formData.get("inferredCountryCode")?.toString() || null,
      inferredCountryName:
        formData.get("inferredCountryName")?.toString() || null,
      inferredLatitude: parseOptionalNumber(formData.get("inferredLatitude")),
      inferredLongitude: parseOptionalNumber(formData.get("inferredLongitude")),
      mimeType: file instanceof File ? file.type : null,
      photoAssetId,
      sourceType,
      title: formData.get("title")?.toString() ?? null,
      userId: user.id,
      visitId,
      visitedAt: formData.get("visitedAt")?.toString() || null,
    });

    const visit = await createVisit(supabase, user.id, visitDraft);
    const postDraft = buildTravelPostDraft({
      cityName: formData.get("cityName")?.toString() ?? null,
      content: formData.get("content")?.toString() ?? null,
      countryCode: formData.get("countryCode")?.toString() ?? "",
      countryName: formData.get("countryName")?.toString() ?? "",
      inferredConfidenceLevel:
        parseOptionalConfidence(formData.get("inferredConfidenceLevel")),
      sourceType,
      title: formData.get("title")?.toString() ?? null,
      userId: user.id,
      visitId,
      visitedAt: formData.get("visitedAt")?.toString() || null,
    });

    let photoAsset = null;

    if (sourceType === "photo") {
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: "Photo uploads require a file" },
          { status: 400 },
        );
      }

      const photoAssetDraft = buildPhotoAssetDraft({
        cityName: formData.get("cityName")?.toString() ?? null,
        content: formData.get("content")?.toString() ?? null,
        countryCode: formData.get("countryCode")?.toString() ?? "",
        countryName: formData.get("countryName")?.toString() ?? "",
        inferredCityName: formData.get("inferredCityName")?.toString() || null,
        inferredConfidenceLevel:
          parseOptionalConfidence(formData.get("inferredConfidenceLevel")),
        inferredCountryCode:
          formData.get("inferredCountryCode")?.toString() || null,
        inferredCountryName:
          formData.get("inferredCountryName")?.toString() || null,
        fileName: file.name,
        fileSizeBytes: file.size,
        inferredLatitude: parseOptionalNumber(formData.get("inferredLatitude")),
        inferredLongitude: parseOptionalNumber(formData.get("inferredLongitude")),
        mimeType: file.type,
        photoAssetId,
        sourceType,
        title: formData.get("title")?.toString() ?? null,
        userId: user.id,
        visitId,
        visitedAt: formData.get("visitedAt")?.toString() || null,
      });

      if (!photoAssetDraft) {
        return NextResponse.json(
          { error: "Photo upload draft could not be created" },
          { status: 400 },
        );
      }

      const uploadResult = await supabase.storage
        .from(photoAssetDraft.storage_bucket ?? "travel-photos")
        .upload(photoAssetDraft.storage_path, file, {
          contentType: file.type || undefined,
          upsert: false,
        });

      if (uploadResult.error) {
        throw uploadResult.error;
      }

      photoAsset = await createPhotoAsset(supabase, user.id, photoAssetDraft);
    }

    const post = postDraft
      ? await createTravelPost(supabase, user.id, postDraft)
      : null;

    revalidatePath("/");

    return NextResponse.json({
      post,
      photoAsset,
      visit,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create archive entry";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (!value) {
    return null;
  }

  const normalized = value.toString().trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalConfidence(value: FormDataEntryValue | null) {
  const normalized = value?.toString().trim();

  if (
    normalized === "high" ||
    normalized === "medium" ||
    normalized === "low" ||
    normalized === "manual"
  ) {
    return normalized;
  }

  return null;
}
