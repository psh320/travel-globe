import type { MapHostSnapshot, MapInteractionState } from "@/features/map/types";

export const defaultMapInteractionState: MapInteractionState = {
  selectedCountryCode: null,
  viewMode: "world",
};

export function pressMapCountry(
  state: MapInteractionState,
  countryCode: string,
): MapInteractionState {
  if (state.selectedCountryCode !== countryCode) {
    return {
      selectedCountryCode: countryCode,
      viewMode: "world",
    };
  }

  if (state.viewMode === "world") {
    return {
      ...state,
      viewMode: "country",
    };
  }

  return state;
}

export function openFocusedCountry(
  state: MapInteractionState,
): MapInteractionState {
  if (!state.selectedCountryCode || state.viewMode === "country") {
    return state;
  }

  return {
    ...state,
    viewMode: "country",
  };
}

export function returnToWorld(
  state: MapInteractionState,
): MapInteractionState {
  if (state.viewMode === "world") {
    return state;
  }

  return {
    ...state,
    viewMode: "world",
  };
}

export function clearMapSelection(): MapInteractionState {
  return defaultMapInteractionState;
}

export function dismissMapInteraction(
  state: MapInteractionState,
): MapInteractionState {
  if (state.viewMode === "country") {
    return returnToWorld(state);
  }

  return clearMapSelection();
}

export function getFocusedCountryCode(state: MapInteractionState) {
  return state.viewMode === "country" ? state.selectedCountryCode : null;
}

export function createMapHostSnapshot(
  state: MapInteractionState,
  selectedCountry: MapHostSnapshot["selectedCountry"],
): MapHostSnapshot {
  return {
    ...state,
    selectedCountry,
    focusedCountry: state.viewMode === "country" ? selectedCountry : null,
  };
}
