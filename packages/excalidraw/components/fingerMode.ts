/**
 * Finger mode only enlarges listed UI targets. It does not decide
 * pointer, pen, or touch gestures.
 */

export const FINGER_MODE_SIZE_TIERS = [
  "small",
  "medium",
  "large",
  "xl",
] as const;

export type FingerModeSizeTier = typeof FINGER_MODE_SIZE_TIERS[number];

/** Preset while the user has not chosen. Large, not extra-large. */
export const DEFAULT_FINGER_MODE_SIZE: FingerModeSizeTier = "large";

export type FingerModeItem =
  | "defaultButton"
  | "lgButton"
  | "menuItem"
  | "menuGap"
  | "handle";

/**
 * Pixels for each item. Small is that item's upstream size.
 * Scale and rotate handles share this handle row, and each has its own tier.
 */
export const FINGER_MODE_ITEM_SIZES: Record<
  FingerModeItem,
  Record<FingerModeSizeTier, number>
> = {
  defaultButton: { small: 32, medium: 36, large: 40, xl: 44 },
  lgButton: { small: 36, medium: 39, large: 42, xl: 44 },
  menuItem: { small: 32, medium: 36, large: 40, xl: 44 },
  menuGap: { small: 1, medium: 4, large: 6, xl: 8 },
  handle: { small: 8, medium: 20, large: 32, xl: 44 },
};

export type FingerModeSizingState = {
  fingerMode: boolean;
  fingerModeDefaultButton: FingerModeSizeTier;
  fingerModeLgButton: FingerModeSizeTier;
  fingerModeMenuItem: FingerModeSizeTier;
  fingerModeMenuGap: FingerModeSizeTier;
};

export const isCoarsePointer = (
  view: { matchMedia?: (query: string) => { matches: boolean } } | null,
) => !!view?.matchMedia?.("(pointer: coarse)")?.matches;

/** CSS pixel size of a handle tier while finger mode is on. */
export const fingerModeHandleSize = (
  fingerMode: boolean,
  tier: FingerModeSizeTier,
) => (fingerMode ? FINGER_MODE_ITEM_SIZES.handle[tier] : undefined);

/** Inline custom properties. Empty when finger mode is off, so upstream sizes stay. */
export const fingerModeStyle = (
  state: FingerModeSizingState,
): Record<`--${string}`, string> | null => {
  if (!state.fingerMode) {
    return null;
  }
  const px = (item: FingerModeItem, tier: FingerModeSizeTier) =>
    `${FINGER_MODE_ITEM_SIZES[item][tier]}px`;
  return {
    "--default-button-size": px("defaultButton", state.fingerModeDefaultButton),
    "--lg-button-size": px("lgButton", state.fingerModeLgButton),
    "--finger-menu-item-height": px("menuItem", state.fingerModeMenuItem),
    "--finger-menu-gap": px("menuGap", state.fingerModeMenuGap),
  };
};
