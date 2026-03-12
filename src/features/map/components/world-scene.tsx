"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useMemo, useRef, useState, type RefObject } from "react";
import { EdgesGeometry, ExtrudeGeometry, MathUtils, OrthographicCamera as ThreeOrthographicCamera, Shape } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import { createCameraTarget, mergeBounds } from "@/features/map/lib/camera-targets";
import type { MapViewMode, WorldCountryRecord } from "@/features/map/types";
import type { CountryMapSummary } from "@/lib/archive";

function MapCameraRig({
  cameraRef,
  center,
  zoom,
}: {
  cameraRef: RefObject<ThreeOrthographicCamera | null>;
  center: [number, number];
  zoom: number;
}) {
  useFrame((_, delta) => {
    const camera = cameraRef.current;

    if (!camera) {
      return;
    }

    const easing = 1 - Math.exp(-delta * 5);

    camera.position.x = MathUtils.lerp(camera.position.x, center[0], easing);
    camera.position.y = MathUtils.lerp(camera.position.y, center[1], easing);
    camera.position.z = MathUtils.lerp(camera.position.z, 36, easing);
    camera.zoom = MathUtils.lerp(camera.zoom, zoom, easing);
    camera.updateProjectionMatrix();
  });

  return null;
}

function CountryShape({
  countryCode,
  path,
  fill,
  onCountryPress,
  onHoverChange,
  zOffset,
}: {
  countryCode: string;
  path: string;
  fill: string;
  onCountryPress: (countryCode: string) => void;
  onHoverChange: (countryCode: string | null) => void;
  zOffset: number;
}) {
  const shapes = useMemo(() => {
    const { paths } = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><path d="${path}" /></svg>`,
    );

    return paths.flatMap((svgPath) => SVGLoader.createShapes(svgPath));
  }, [path]);

  return (
    <group>
      {shapes.map((shape, shapeIndex) => (
        <CountrySurface
          key={`${countryCode}-${shapeIndex}`}
          countryCode={countryCode}
          shape={shape}
          fill={fill}
          zOffset={zOffset}
          onHoverChange={onHoverChange}
          onPress={onCountryPress}
        />
      ))}
    </group>
  );
}

function CountrySurface({
  countryCode,
  shape,
  fill,
  zOffset,
  onHoverChange,
  onPress,
}: {
  countryCode: string;
  shape: Shape;
  fill: string;
  zOffset: number;
  onHoverChange: (countryCode: string | null) => void;
  onPress: (countryCode: string) => void;
}) {
  const geometry = useMemo(
    () =>
      new ExtrudeGeometry(shape, {
        depth: 0.7,
        bevelEnabled: false,
        curveSegments: 3,
      }),
    [shape],
  );
  const borderGeometry = useMemo(() => new EdgesGeometry(geometry, 12), [geometry]);

  return (
    <group position={[0, 0, zOffset]}>
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        onPointerDown={(event) => {
          event.stopPropagation();
          onPress(countryCode);
        }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          onHoverChange(countryCode);
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          onHoverChange(null);
        }}
      >
        <meshStandardMaterial color={fill} roughness={0.96} metalness={0.02} />
      </mesh>
      <lineSegments geometry={borderGeometry}>
        <lineBasicMaterial color="#9a9a9a" />
      </lineSegments>
    </group>
  );
}

function WorldContent({
  archiveIndex,
  countries,
  emptyColor,
  onCountryPress,
  onDismiss,
  selectedCountryCode,
  viewMode,
}: {
  archiveIndex: Map<string, CountryMapSummary>;
  countries: WorldCountryRecord[];
  emptyColor: string;
  onCountryPress: (countryCode: string) => void;
  onDismiss: () => void;
  selectedCountryCode: string | null;
  viewMode: MapViewMode;
}) {
  const { size } = useThree();
  const cameraRef = useRef<ThreeOrthographicCamera | null>(null);
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const worldBounds = useMemo(
    () => mergeBounds(countries.map((country) => country.bounds)),
    [countries],
  );
  const selectedCountry = countries.find((country) => country.countryCode === selectedCountryCode);
  const target = selectedCountry && viewMode === "country"
    ? createCameraTarget(selectedCountry.bounds, size, 16)
    : createCameraTarget(worldBounds, size, 20);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 36]} ref={cameraRef} zoom={1.2} />
      <MapCameraRig cameraRef={cameraRef} center={target.center} zoom={target.zoom} />
      <color attach="background" args={["#f4f1e8"]} />
      <ambientLight intensity={2.6} />
      <directionalLight
        castShadow
        intensity={1.5}
        position={[45, 50, 70]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <group position={[0, 0, -1.1]}>
        <mesh receiveShadow position={[0, 0, -0.8]}>
          <boxGeometry args={[360, 185, 1]} />
          <meshStandardMaterial color="#efe9dc" roughness={1} metalness={0} />
        </mesh>
      </group>
      <group position={[0, 0, -0.35]}>
        {countries.map((country) => {
          const archiveEntry = archiveIndex.get(country.countryCode);
          const isHovered = hoveredCountryCode === country.countryCode;
          const isSelected = selectedCountryCode === country.countryCode;
          const fill = isSelected
            ? "#d9b58f"
            : isHovered
              ? archiveEntry
                ? "#ead2ba"
                : "#eeece6"
              : archiveEntry?.fillColor ?? emptyColor;

          return (
            <CountryShape
              key={country.countryCode}
              countryCode={country.countryCode}
              path={country.path}
              fill={fill}
              onCountryPress={onCountryPress}
              onHoverChange={setHoveredCountryCode}
              zOffset={isSelected ? 0.42 : isHovered ? 0.16 : 0}
            />
          );
        })}
      </group>
      <mesh
        position={[0, 0, -4]}
        onPointerDown={() => onDismiss()}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial opacity={0.08} transparent />
      </mesh>
    </>
  );
}

export function WorldScene({
  archiveIndex,
  className,
  countries,
  emptyColor,
  onCountryPress,
  onDismiss,
  selectedCountryCode,
  viewMode,
}: {
  archiveIndex: Map<string, CountryMapSummary>;
  className?: string;
  countries: WorldCountryRecord[];
  emptyColor: string;
  onCountryPress: (countryCode: string) => void;
  onDismiss: () => void;
  selectedCountryCode: string | null;
  viewMode: MapViewMode;
}) {
  return (
    <div className={className ?? "h-full w-full"}>
      <Canvas
        orthographic
        className="h-full w-full"
        dpr={[1, 1.6]}
        gl={{ antialias: true }}
        onPointerMissed={() => onDismiss()}
        shadows
      >
        <WorldContent
          archiveIndex={archiveIndex}
          countries={countries}
          emptyColor={emptyColor}
          onCountryPress={onCountryPress}
          onDismiss={onDismiss}
          selectedCountryCode={selectedCountryCode}
          viewMode={viewMode}
        />
      </Canvas>
    </div>
  );
}
