import { geoContains } from "d3-geo";
import { feature } from "topojson-client";
import countries from "world-countries";
import countriesTopology from "world-atlas/countries-110m.json";

import type { VisitConfidenceLevel } from "@/lib/archive";
import { getAlpha2CountryCode } from "@/features/map/lib/country-code-map";

export type CountryInference = {
  confidenceLevel: VisitConfidenceLevel;
  countryCode: string;
  countryName: string;
  distanceKm: number;
};

type CountrySeed = {
  countryCode: string;
  countryName: string;
  lat: number;
  lng: number;
};

type CountryFeature = CountrySeed & {
  geometry: object;
};

const countrySeeds: CountrySeed[] = countries
  .filter(
    (country): country is (typeof countries)[number] & {
      cca2: string;
      latlng: [number, number];
      name: { common: string };
    } =>
      Boolean(country.cca2) &&
      Array.isArray(country.latlng) &&
      country.latlng.length === 2 &&
      Number.isFinite(country.latlng[0]) &&
      Number.isFinite(country.latlng[1]) &&
      Boolean(country.name?.common),
  )
  .map((country) => ({
    countryCode: country.cca2,
    countryName: country.name.common,
    lat: country.latlng[0],
    lng: country.latlng[1],
  }));

const countryFeatures: CountryFeature[] = (
  feature(
    countriesTopology as never,
    (
      countriesTopology as unknown as {
        objects: { countries: unknown };
      }
    ).objects.countries as never,
  ) as unknown as {
    features: Array<{
      id: string;
      properties: { name: string };
      geometry: object;
    }>;
  }
).features
  .map((country) => {
    const countryCode = getAlpha2CountryCode({
      numericCode: country.id,
      displayName: country.properties.name,
    });

    if (!countryCode) {
      return null;
    }

    const seed = countrySeeds.find((entry) => entry.countryCode === countryCode);

    if (!seed) {
      return null;
    }

    return {
      ...seed,
      geometry: country.geometry,
    };
  })
  .filter((country): country is CountryFeature => country !== null);

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);
  const startLat = toRadians(fromLat);
  const endLat = toRadians(toLat);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

function getConfidenceLevel(distanceKm: number): VisitConfidenceLevel {
  if (distanceKm <= 250) {
    return "high";
  }

  if (distanceKm <= 750) {
    return "medium";
  }

  return "low";
}

export function inferCountryFromCoordinates(
  latitude: number | null,
  longitude: number | null,
): CountryInference | null {
  if (
    latitude === null ||
    longitude === null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const polygonMatch = countryFeatures.find((country) =>
    geoContains(
      {
        type: "Feature",
        properties: { name: country.countryName },
        geometry: country.geometry as never,
      } as never,
      [longitude, latitude],
    ),
  );

  if (polygonMatch) {
    const distanceKm = getDistanceKm(
      latitude,
      longitude,
      polygonMatch.lat,
      polygonMatch.lng,
    );

    return {
      confidenceLevel: getConfidenceLevel(distanceKm),
      countryCode: polygonMatch.countryCode,
      countryName: polygonMatch.countryName,
      distanceKm,
    };
  }

  let bestMatch: CountryInference | null = null;

  for (const country of countrySeeds) {
    const distanceKm = getDistanceKm(
      latitude,
      longitude,
      country.lat,
      country.lng,
    );

    if (!bestMatch || distanceKm < bestMatch.distanceKm) {
      bestMatch = {
        confidenceLevel: getConfidenceLevel(distanceKm),
        countryCode: country.countryCode,
        countryName: country.countryName,
        distanceKm,
      };
    }
  }

  return bestMatch;
}
