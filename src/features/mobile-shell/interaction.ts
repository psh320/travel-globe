export type MobileSelectionState = {
  selectedCountryCode: string | null;
  isDetailOpen: boolean;
};

export function handleCountryTap(
  state: MobileSelectionState,
  countryCode: string,
): MobileSelectionState {
  if (state.selectedCountryCode === countryCode) {
    return {
      selectedCountryCode: countryCode,
      isDetailOpen: true,
    };
  }

  return {
    selectedCountryCode: countryCode,
    isDetailOpen: false,
  };
}

export function openSelectedCountry(
  state: MobileSelectionState,
): MobileSelectionState {
  if (!state.selectedCountryCode) {
    return state;
  }

  return {
    ...state,
    isDetailOpen: true,
  };
}

export function closeCountryDetail(
  state: MobileSelectionState,
): MobileSelectionState {
  return {
    ...state,
    isDetailOpen: false,
  };
}
