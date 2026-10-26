import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_FINGER_MODE_SIZE,
  FINGER_MODE_SIZES,
  fingerMayUseTool,
  fingerModeTargetsActive,
  guardPointerListener,
  pinchZoomScaleFactor,
  resolveFingerModeHandleSize,
  shouldAbortFreedrawForExtraTouch,
  shouldIgnoreConcurrentTouch,
  shouldReleaseTouchGestureForPen,
  shouldStartSingleFingerPan,
} from "../components/penModePointer";

const TOOLS = [
  "selection",
  "lasso",
  "text",
  "image",
  "freedraw",
  "rectangle",
  "arrow",
  "line",
  "eraser",
  "hand",
  "frame",
  "laser",
] as const;

describe("fingerMayUseTool", () => {
  it("blocks touch for every tool while pen mode is on", () => {
    expect(TOOLS.every(() => fingerMayUseTool(true, "touch") === false)).toBe(
      true,
    );
  });

  it("allows a pen and a mouse in pen mode", () => {
    expect(fingerMayUseTool(true, "pen")).toBe(true);
    expect(fingerMayUseTool(true, "mouse")).toBe(true);
  });

  it("allows touch when pen mode is off", () => {
    expect(fingerMayUseTool(false, "touch")).toBe(true);
  });
});

describe("shouldStartSingleFingerPan", () => {
  it("pans a lone finger in pen mode", () => {
    expect(
      shouldStartSingleFingerPan({
        penMode: true,
        pointerType: "touch",
        trackedPointerCount: 1,
        penPointerDown: false,
      }),
    ).toBe(true);
  });

  it("does not pan a second finger, a pen, or a finger while the pen is down", () => {
    expect(
      shouldStartSingleFingerPan({
        penMode: true,
        pointerType: "touch",
        trackedPointerCount: 2,
        penPointerDown: false,
      }),
    ).toBe(false);
    expect(
      shouldStartSingleFingerPan({
        penMode: true,
        pointerType: "pen",
        trackedPointerCount: 1,
        penPointerDown: true,
      }),
    ).toBe(false);
    expect(
      shouldStartSingleFingerPan({
        penMode: true,
        pointerType: "touch",
        trackedPointerCount: 1,
        penPointerDown: true,
      }),
    ).toBe(false);
  });

  it("does not pan when pen mode is off", () => {
    expect(
      shouldStartSingleFingerPan({
        penMode: false,
        pointerType: "touch",
        trackedPointerCount: 1,
        penPointerDown: false,
      }),
    ).toBe(false);
  });
});

describe("pinchZoomScaleFactor", () => {
  it("zooms from the finger distance when no pen is in the gesture", () => {
    expect(
      pinchZoomScaleFactor({
        distance: 200,
        initialDistance: 100,
        pointerTypes: ["touch", "touch"],
      }),
    ).toBe(2);
  });

  it("does not zoom when a pen is among the pointers", () => {
    expect(
      pinchZoomScaleFactor({
        distance: 200,
        initialDistance: 100,
        pointerTypes: ["pen", "touch"],
      }),
    ).toBe(1);
  });
});

describe("concurrent pen and touch", () => {
  it("ignores touch only while a pen is down in pen mode", () => {
    expect(
      shouldIgnoreConcurrentTouch({
        pointerType: "touch",
        penMode: true,
        penPointerDown: true,
      }),
    ).toBe(true);
    expect(
      shouldIgnoreConcurrentTouch({
        pointerType: "touch",
        penMode: true,
        penPointerDown: false,
      }),
    ).toBe(false);
    expect(
      shouldIgnoreConcurrentTouch({
        pointerType: "touch",
        penMode: false,
        penPointerDown: true,
      }),
    ).toBe(false);
    expect(
      shouldIgnoreConcurrentTouch({
        pointerType: "pen",
        penMode: true,
        penPointerDown: true,
      }),
    ).toBe(false);
  });

  it("releases tracked touches when the pen lands", () => {
    expect(
      shouldReleaseTouchGestureForPen({
        pointerType: "pen",
        trackedPointerTypes: ["touch"],
      }),
    ).toBe(true);
    expect(
      shouldReleaseTouchGestureForPen({
        pointerType: "pen",
        trackedPointerTypes: ["pen"],
      }),
    ).toBe(false);
    expect(
      shouldReleaseTouchGestureForPen({
        pointerType: "touch",
        trackedPointerTypes: ["touch"],
      }),
    ).toBe(false);
  });

  it("still aborts a finger-drawn freedraw on a second touch", () => {
    expect(
      shouldAbortFreedrawForExtraTouch({
        pointerType: "touch",
        newElementType: "freedraw",
        penAuthored: false,
      }),
    ).toBe(true);
    expect(
      shouldAbortFreedrawForExtraTouch({
        pointerType: "touch",
        newElementType: "freedraw",
        penAuthored: true,
      }),
    ).toBe(false);
    expect(
      shouldAbortFreedrawForExtraTouch({
        pointerType: "pen",
        newElementType: "freedraw",
        penAuthored: false,
      }),
    ).toBe(false);
  });
});

describe("guardPointerListener", () => {
  it("drops ignored events before the listener and keeps flush", () => {
    const listener = vi.fn();
    const flush = vi.fn();
    const cancel = vi.fn();
    const guarded = guardPointerListener(
      Object.assign(listener, { flush, cancel }),
      (event: { pointerType: string }) => event.pointerType === "touch",
    );

    guarded({ pointerType: "pen" });
    guarded({ pointerType: "touch" });
    guarded.flush();
    guarded.cancel();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ pointerType: "pen" });
    expect(flush).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});

describe("finger mode size tiers", () => {
  it("defaults to large", () => {
    expect(DEFAULT_FINGER_MODE_SIZE).toBe("large");
  });

  it("spaces buttons, menu rows, and handles from upstream to 44px", () => {
    expect(FINGER_MODE_SIZES.small).toEqual({
      defaultButton: 32,
      lgButton: 36,
      menuItem: 32,
      menuGap: 1,
      handle: 8,
    });
    expect(FINGER_MODE_SIZES.medium).toEqual({
      defaultButton: 36,
      lgButton: 39,
      menuItem: 36,
      menuGap: 4,
      handle: 20,
    });
    expect(FINGER_MODE_SIZES.large).toEqual({
      defaultButton: 40,
      lgButton: 42,
      menuItem: 40,
      menuGap: 6,
      handle: 32,
    });
    expect(FINGER_MODE_SIZES.xl).toEqual({
      defaultButton: 44,
      lgButton: 44,
      menuItem: 44,
      menuGap: 8,
      handle: 44,
    });
  });

  it("overrides handle size only in pen mode on a coarse pointer", () => {
    expect(
      resolveFingerModeHandleSize({
        penMode: true,
        coarsePointer: true,
        tier: "large",
      }),
    ).toBe(32);
    expect(
      resolveFingerModeHandleSize({
        penMode: true,
        coarsePointer: true,
        tier: "xl",
      }),
    ).toBe(44);
    expect(
      resolveFingerModeHandleSize({
        penMode: false,
        coarsePointer: true,
        tier: "xl",
      }),
    ).toBeUndefined();
    expect(
      resolveFingerModeHandleSize({
        penMode: true,
        coarsePointer: false,
        tier: "xl",
      }),
    ).toBeUndefined();
  });

  it("leaves upstream button sizes alone on the small tier", () => {
    expect(
      fingerModeTargetsActive({
        penMode: true,
        coarsePointer: true,
        tier: "small",
      }),
    ).toBe(false);
    expect(
      fingerModeTargetsActive({
        penMode: true,
        coarsePointer: true,
        tier: "large",
      }),
    ).toBe(true);
  });
});
