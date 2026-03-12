import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { Box2, Vector2 } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import countriesTopology from "world-atlas/countries-110m.json";

import { getAlpha2CountryCode } from "@/features/map/lib/country-code-map";
import type { Bounds2D, WorldCountryRecord } from "@/features/map/types";

const svgLoader = new SVGLoader();

let cachedCountries: WorldCountryRecord[] | undefined;

function getPathBounds(path: string): Bounds2D {
  const { paths } = svgLoader.parse(
    `<svg xmlns="http://www.w3.org/2000/svg"><path d="${path}" /></svg>`,
  );
  const bounds = new Box2();

  for (const svgPath of paths) {
    for (const subPath of svgPath.subPaths) {
      for (const point of subPath.getPoints()) {
        bounds.expandByPoint(new Vector2(point.x, -point.y));
      }
    }
  }

  return {
    minX: bounds.min.x,
    minY: bounds.min.y,
    maxX: bounds.max.x,
    maxY: bounds.max.y,
  };
}

export function loadWorldCountryRecords() {
  if (cachedCountries) {
    return cachedCountries;
  }

  const topology = countriesTopology as unknown as {
    objects: {
      countries: unknown;
    };
  };
  const world = feature(
    countriesTopology as never,
    topology.objects.countries as never,
  ) as unknown as {
    type: "FeatureCollection";
    features: Array<{
      id: string;
      properties: { name: string };
      geometry: object;
    }>;
  };

  const projection = geoNaturalEarth1().fitExtent(
    [
      [-160, -82],
      [160, 82],
    ],
    world as never,
  );
  const pathBuilder = geoPath(projection);

  cachedCountries = world.features
    .map((country) => {
      const path = pathBuilder(country as never);
      const countryCode = getAlpha2CountryCode({
        numericCode: country.id,
        displayName: country.properties.name,
      });

      if (!path || !country.properties.name || !countryCode) {
        return null;
      }

      const bounds = getPathBounds(path);

      return {
        countryCode,
        displayName: country.properties.name,
        bounds,
        centroid: [
          (bounds.minX + bounds.maxX) / 2,
          (bounds.minY + bounds.maxY) / 2,
        ] as [number, number],
        path,
      };
    })
    .filter((country): country is WorldCountryRecord => country !== null);

  return cachedCountries;
}
