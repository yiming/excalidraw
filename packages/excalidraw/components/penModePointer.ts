/**
 * Decisions for pen-mode pointer input. Kept free of React so the branches
 * can be tested without mounting the editor.
 *
 * `penMode` means a finger navigates and a pen draws. There is no second
 * mode flag.
 */

/** A finger must not create, select, drag, or edit while pen mode is on. */
export const fingerMayUseTool = (penMode: boolean, pointerType: string) =>
  !(penMode && pointerType === "touch");

/**
 * One finger pans in pen mode. A second finger is a pinch, and a finger that
 * lands while the pen is down is a palm, not a pan.
 */
export const shouldStartSingleFingerPan = (input: {
  penMode: boolean;
  pointerType: string;
  /** pointers already tracked for the gesture, including this one */
  trackedPointerCount: number;
  penPointerDown: boolean;
}) =>
  input.penMode &&
  input.pointerType === "touch" &&
  !input.penPointerDown &&
  input.trackedPointerCount <= 1;

/**
 * Pinch zoom is allowed in pen mode, including freedraw. It is suppressed
 * only while a pen is one of the pointers in the gesture, so a hand resting
 * during a stroke cannot zoom.
 */
export const pinchZoomScaleFactor = (input: {
  distance: number;
  initialDistance: number;
  pointerTypes: readonly string[];
}) => {
  if (input.pointerTypes.some((pointerType) => pointerType === "pen")) {
    return 1;
  }
  return input.distance / input.initialDistance;
};

/**
 * Touch that arrives while a pen is down in pen mode. Ignored so the palm
 * cannot enroll in the gesture or finish the stroke.
 */
export const shouldIgnoreConcurrentTouch = (input: {
  pointerType: string;
  penMode: boolean;
  penPointerDown: boolean;
}) => input.pointerType === "touch" && input.penMode && input.penPointerDown;

/**
 * A pen that lands while fingers are already tracked must drop those fingers
 * before it draws. Otherwise the pen stays inside the two-pointer gesture
 * and cannot leave pan or zoom.
 */
export const shouldReleaseTouchGestureForPen = (input: {
  pointerType: string;
  trackedPointerTypes: readonly string[];
}) =>
  input.pointerType === "pen" &&
  input.trackedPointerTypes.some((pointerType) => pointerType === "touch");

/**
 * A second touch aborts an in-progress freedraw that the finger started.
 * A stroke the pen is drawing is not aborted this way.
 */
export const shouldAbortFreedrawForExtraTouch = (input: {
  pointerType: string;
  newElementType: string | null;
  penAuthored: boolean;
}) =>
  input.pointerType === "touch" &&
  input.newElementType === "freedraw" &&
  !input.penAuthored;

/**
 * Runs `listener` only when `ignore` is false. The check happens before
 * `listener` so a throttled listener cannot keep a palm sample in place of
 * a pen sample from the same frame. `flush` and `cancel` stay attached.
 */
export const FINGER_MODE_SIZE_TIERS = [
  "small",
  "medium",
  "large",
  "xl",
] as const;

export type FingerModeSizeTier = typeof FINGER_MODE_SIZE_TIERS[number];

/** Preset while the user has not chosen. Large, not the 44px extra-large tier. */
export const DEFAULT_FINGER_MODE_SIZE: FingerModeSizeTier = "large";

export type FingerModeSize = {
  /** `--default-button-size` in CSS pixels */
  defaultButton: number;
  /** `--lg-button-size` in CSS pixels */
  lgButton: number;
  /** dropdown row height in CSS pixels */
  menuItem: number;
  /** dropdown row gap in CSS pixels */
  menuGap: number;
  /** transform-handle draw and hit size in CSS pixels */
  handle: number;
};

/**
 * Even steps from upstream (small) to the 44px target (xl).
 * Default buttons and menu height step by 4px. Large buttons step by 3px
 * until the last step, which lands on 44. Handles step by 12px.
 */
export const FINGER_MODE_SIZES: Record<FingerModeSizeTier, FingerModeSize> = {
  small: {
    defaultButton: 32,
    lgButton: 36,
    menuItem: 32,
    menuGap: 1,
    handle: 8,
  },
  medium: {
    defaultButton: 36,
    lgButton: 39,
    menuItem: 36,
    menuGap: 4,
    handle: 20,
  },
  large: {
    defaultButton: 40,
    lgButton: 42,
    menuItem: 40,
    menuGap: 6,
    handle: 32,
  },
  xl: {
    defaultButton: 44,
    lgButton: 44,
    menuItem: 44,
    menuGap: 8,
    handle: 44,
  },
};

export const isCoarsePointer = (
  view: { matchMedia?: (query: string) => { matches: boolean } } | null,
) => !!view?.matchMedia?.("(pointer: coarse)")?.matches;

/** CSS overrides apply only for a tier above upstream, in pen mode, on a coarse pointer. */
export const fingerModeTargetsActive = (input: {
  penMode: boolean;
  coarsePointer: boolean;
  tier: FingerModeSizeTier;
}) => input.penMode && input.coarsePointer && input.tier !== "small";

/**
 * Handle size while pen mode is on and the pointer is coarse.
 * `undefined` keeps the renderer's existing pointer-type sizes.
 */
export const resolveFingerModeHandleSize = (input: {
  penMode: boolean;
  coarsePointer: boolean;
  tier: FingerModeSizeTier;
}) =>
  input.penMode && input.coarsePointer
    ? FINGER_MODE_SIZES[input.tier].handle
    : undefined;

export const guardPointerListener = <
  E extends { pointerType: string },
  L extends ((event: E) => void) & {
    flush: () => void;
    cancel: () => void;
  },
>(
  listener: L,
  ignore: (event: E) => boolean,
): L => {
  const guarded = ((event: E) => {
    if (!ignore(event)) {
      listener(event);
    }
  }) as L;
  guarded.flush = () => listener.flush();
  guarded.cancel = () => listener.cancel();
  return guarded;
};
