type ByteOrder = "little" | "big";

export type ExtractedExifMetadata = {
  capturedAt: string | null;
  latitude: number | null;
  longitude: number | null;
};

function readUint16(view: DataView, offset: number, order: ByteOrder) {
  return view.getUint16(offset, order === "little");
}

function readUint32(view: DataView, offset: number, order: ByteOrder) {
  return view.getUint32(offset, order === "little");
}

function canRead(view: DataView, offset: number, byteLength: number) {
  return offset >= 0 && offset + byteLength <= view.byteLength;
}

function readAscii(
  view: DataView,
  absoluteOffset: number,
  count: number,
) {
  let value = "";

  for (let index = 0; index < count; index += 1) {
    const code = view.getUint8(absoluteOffset + index);

    if (code === 0) {
      break;
    }

    value += String.fromCharCode(code);
  }

  return value.trim();
}

function getValueOffset(
  tiffStart: number,
  rawValueFieldOffset: number,
  pointerValue: number,
  type: number,
  count: number,
) {
  const unitSize =
    type === 2 ? 1 : type === 3 ? 2 : type === 4 ? 4 : type === 5 ? 8 : 0;
  const totalSize = unitSize * count;

  if (totalSize <= 4) {
    return rawValueFieldOffset;
  }

  return tiffStart + pointerValue;
}

function readRational(
  view: DataView,
  absoluteOffset: number,
  order: ByteOrder,
) {
  const numerator = readUint32(view, absoluteOffset, order);
  const denominator = readUint32(view, absoluteOffset + 4, order);

  if (!denominator) {
    return null;
  }

  return numerator / denominator;
}

function convertGpsCoordinate(values: number[], ref: string | null) {
  if (values.length !== 3) {
    return null;
  }

  const decimal = values[0] + values[1] / 60 + values[2] / 3600;

  if (ref === "S" || ref === "W") {
    return -decimal;
  }

  return decimal;
}

function parseExifDate(value: string | null) {
  if (!value) {
    return null;
  }

  const match = value.match(
    /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/,
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second] = match;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
}

function parseGpsIfd(
  view: DataView,
  tiffStart: number,
  gpsOffset: number,
  order: ByteOrder,
) {
  if (!canRead(view, gpsOffset, 2)) {
    return {
      latitude: null,
      longitude: null,
    };
  }

  const entryCount = readUint16(view, gpsOffset, order);

  let latitudeRef: string | null = null;
  let longitudeRef: string | null = null;
  const latitudeValues: number[] = [];
  const longitudeValues: number[] = [];

  for (let entryIndex = 0; entryIndex < entryCount; entryIndex += 1) {
    const entryOffset = gpsOffset + 2 + entryIndex * 12;

    if (!canRead(view, entryOffset, 12)) {
      break;
    }

    const tag = readUint16(view, entryOffset, order);
    const type = readUint16(view, entryOffset + 2, order);
    const count = readUint32(view, entryOffset + 4, order);
    const rawValueOffset = entryOffset + 8;
    const absoluteOffset = getValueOffset(
      tiffStart,
      rawValueOffset,
      readUint32(view, rawValueOffset, order),
      type,
      count,
    );

    if (tag === 0x0001 && type === 2) {
      latitudeRef = readAscii(view, absoluteOffset, count);
    }

    if (tag === 0x0002 && type === 5) {
      for (let valueIndex = 0; valueIndex < count; valueIndex += 1) {
        if (!canRead(view, absoluteOffset + valueIndex * 8, 8)) {
          break;
        }

        const rational = readRational(
          view,
          absoluteOffset + valueIndex * 8,
          order,
        );

        if (rational !== null) {
          latitudeValues.push(rational);
        }
      }
    }

    if (tag === 0x0003 && type === 2) {
      longitudeRef = readAscii(view, absoluteOffset, count);
    }

    if (tag === 0x0004 && type === 5) {
      for (let valueIndex = 0; valueIndex < count; valueIndex += 1) {
        if (!canRead(view, absoluteOffset + valueIndex * 8, 8)) {
          break;
        }

        const rational = readRational(
          view,
          absoluteOffset + valueIndex * 8,
          order,
        );

        if (rational !== null) {
          longitudeValues.push(rational);
        }
      }
    }
  }

  return {
    latitude: convertGpsCoordinate(latitudeValues, latitudeRef),
    longitude: convertGpsCoordinate(longitudeValues, longitudeRef),
  };
}

function parseExifSegment(view: DataView, app1Start: number) {
  const exifHeader = String.fromCharCode(
    view.getUint8(app1Start),
    view.getUint8(app1Start + 1),
    view.getUint8(app1Start + 2),
    view.getUint8(app1Start + 3),
  );

  if (exifHeader !== "Exif") {
    return null;
  }

  const tiffStart = app1Start + 6;
  const byteOrderMarker = String.fromCharCode(
    view.getUint8(tiffStart),
    view.getUint8(tiffStart + 1),
  );
  const order: ByteOrder =
    byteOrderMarker === "II"
      ? "little"
      : byteOrderMarker === "MM"
        ? "big"
        : "little";

  const firstIfdOffset = readUint32(view, tiffStart + 4, order);
  const firstIfdAbsolute = tiffStart + firstIfdOffset;
  const entryCount = readUint16(view, firstIfdAbsolute, order);

  let exifIfdAbsolute: number | null = null;
  let gpsIfdAbsolute: number | null = null;

  for (let entryIndex = 0; entryIndex < entryCount; entryIndex += 1) {
    const entryOffset = firstIfdAbsolute + 2 + entryIndex * 12;

    if (!canRead(view, entryOffset, 12)) {
      break;
    }

    const tag = readUint16(view, entryOffset, order);
    const pointer = readUint32(view, entryOffset + 8, order);

    if (tag === 0x8769) {
      exifIfdAbsolute = tiffStart + pointer;
    }

    if (tag === 0x8825) {
      gpsIfdAbsolute = tiffStart + pointer;
    }
  }

  let capturedAt: string | null = null;

  if (exifIfdAbsolute) {
    const exifEntryCount = readUint16(view, exifIfdAbsolute, order);

    for (let entryIndex = 0; entryIndex < exifEntryCount; entryIndex += 1) {
      const entryOffset = exifIfdAbsolute + 2 + entryIndex * 12;

      if (!canRead(view, entryOffset, 12)) {
        break;
      }

      const tag = readUint16(view, entryOffset, order);
      const type = readUint16(view, entryOffset + 2, order);
      const count = readUint32(view, entryOffset + 4, order);
      const absoluteOffset = getValueOffset(
        tiffStart,
        entryOffset + 8,
        readUint32(view, entryOffset + 8, order),
        type,
        count,
      );

      if (tag === 0x9003 && type === 2) {
        capturedAt = parseExifDate(readAscii(view, absoluteOffset, count));
      }
    }
  }

  const gpsData = gpsIfdAbsolute
    ? parseGpsIfd(view, tiffStart, gpsIfdAbsolute, order)
    : { latitude: null, longitude: null };

  return {
    capturedAt,
    latitude: gpsData.latitude,
    longitude: gpsData.longitude,
  };
}

export function extractExifMetadata(buffer: ArrayBuffer): ExtractedExifMetadata {
  const view = new DataView(buffer);

  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return {
      capturedAt: null,
      latitude: null,
      longitude: null,
    };
  }

  let offset = 2;

  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      break;
    }

    const marker = view.getUint8(offset + 1);

    if (marker === 0xda || marker === 0xd9) {
      break;
    }

    const segmentLength = view.getUint16(offset + 2);

    if (marker === 0xe1) {
      const parsed = parseExifSegment(view, offset + 4);

      if (parsed) {
        return parsed;
      }
    }

    offset += 2 + segmentLength;
  }

  return {
    capturedAt: null,
    latitude: null,
    longitude: null,
  };
}
