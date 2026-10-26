import React from "react";

import { getTransformHandlesFromCoords } from "@excalidraw/element";

import { Excalidraw } from "../index";
import {
  FINGER_MODE_ITEM_SIZES,
  fingerModeHandleSize,
  fingerModeStyle,
  isCoarsePointer,
} from "../components/fingerMode";

import { API } from "./helpers/api";
import { Pointer, UI } from "./helpers/ui";
import { fireEvent, render } from "./test-utils";

const { h } = window;

const finger = new Pointer("touch", 11);
const finger2 = new Pointer("touch", 12);

const openFingerModeItem = () => {
  const trigger = document.querySelector(
    ".App-toolbar__extra-tools-trigger",
  ) as HTMLElement;
  fireEvent.click(trigger);
  return document.querySelector(
    "[data-testid='toolbar-finger-mode']",
  ) as HTMLElement;
};

const editor = () =>
  document.querySelector(".excalidraw.excalidraw-container") as HTMLElement;

describe("finger mode", () => {
  it("uses the spec pixels and keeps scale and rotate independent", () => {
    expect(FINGER_MODE_ITEM_SIZES.defaultButton).toEqual({
      small: 32,
      medium: 36,
      large: 40,
      xl: 44,
    });
    expect(FINGER_MODE_ITEM_SIZES.lgButton.large).toBe(42);
    expect(FINGER_MODE_ITEM_SIZES.menuItem.xl).toBe(44);
    expect(FINGER_MODE_ITEM_SIZES.menuGap).toEqual({
      small: 1,
      medium: 4,
      large: 6,
      xl: 8,
    });
    expect(FINGER_MODE_ITEM_SIZES.handle).toEqual({
      small: 8,
      medium: 20,
      large: 32,
      xl: 44,
    });
    expect(fingerModeHandleSize(false, "xl")).toBeUndefined();
    expect(fingerModeHandleSize(true, "small")).toBe(8);
    expect(
      fingerModeStyle({
        fingerMode: false,
        fingerModeDefaultButton: "xl",
        fingerModeLgButton: "xl",
        fingerModeMenuItem: "xl",
        fingerModeMenuGap: "xl",
      }),
    ).toBeNull();

    const handles = getTransformHandlesFromCoords(
      [0, 0, 100, 100, 50, 50],
      0 as any,
      { value: 1 as any },
      "mouse",
      {},
      4,
      4,
      fingerModeHandleSize(true, "large"),
      fingerModeHandleSize(true, "xl"),
    );
    expect(handles.nw?.[2]).toBe(32);
    expect(handles.rotation?.[2]).toBe(44);
  });

  describe("editor", () => {
    beforeEach(async () => {
      await render(<Excalidraw />);
    });

    it("persists its own setting and enlarges whenever it is on", () => {
      expect(h.state.fingerMode).toBe(false);
      expect(h.state.fingerModeDefaultButton).toBe("large");
      expect(h.state.fingerModeRotateHandle).toBe("large");
      expect(h.state.penMode).toBe(false);
      expect(editor().classList.contains("excalidraw--finger-targets")).toBe(
        false,
      );

      API.setAppState({
        fingerMode: true,
        penMode: false,
        fingerModeDefaultButton: "medium",
        fingerModeMenuGap: "xl",
      });
      const root = editor();
      expect(root.classList.contains("excalidraw--finger-targets")).toBe(true);
      expect(root.classList.contains("excalidraw--finger-quiet")).toBe(false);
      expect(root.style.getPropertyValue("--default-button-size")).toBe("36px");
      expect(root.style.getPropertyValue("--lg-button-size")).toBe("42px");
      expect(root.style.getPropertyValue("--finger-menu-gap")).toBe("8px");
      expect(h.state.penMode).toBe(false);
    });

    it("hides shortcut hints only while on and the pointer is coarse", () => {
      const matchMedia = window.matchMedia.bind(window);
      window.matchMedia = ((query: string) => ({
        matches: query === "(pointer: coarse)",
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent() {
          return false;
        },
        onchange: null,
      })) as typeof window.matchMedia;
      try {
        expect(isCoarsePointer(window)).toBe(true);
        API.setAppState({ fingerMode: true });
        expect(editor().classList.contains("excalidraw--finger-quiet")).toBe(
          true,
        );
        API.setAppState({ fingerMode: false });
        expect(editor().classList.contains("excalidraw--finger-quiet")).toBe(
          false,
        );
      } finally {
        window.matchMedia = matchMedia;
      }
    });

    it("shows a finger icon and a switch, without a check or a shortcut", () => {
      const item = openFingerModeItem();
      expect(item.textContent).toContain("Finger mode");
      expect(item.textContent).not.toContain("Pen mode");
      expect(item.textContent).not.toContain("finger pans");
      expect(item.querySelector(".dropdown-menu-item__shortcut")).toBeNull();
      expect(item.querySelector("input[type='checkbox']")).not.toBeNull();
      expect(item.querySelector(".Switch input")?.getAttribute("checked")).toBe(
        null,
      );
      const penMode = h.state.penMode;
      fireEvent.click(item.querySelector("input[type='checkbox']")!);
      expect(h.state.fingerMode).toBe(true);
      expect(h.state.penMode).toBe(penMode);
      expect(item.querySelector("svg")).not.toBeNull();
    });

    it("leaves upstream touch and pinch behaviour in place", () => {
      API.setAppState({ fingerMode: true, penMode: true, penDetected: true });
      UI.clickTool("freedraw");
      const { scrollX, scrollY, zoom } = h.state;
      finger.down(30, 30);
      finger.move(10, 10);
      finger.up();
      expect(h.state.scrollX).toBe(scrollX);
      expect(h.state.scrollY).toBe(scrollY);
      expect(
        h.elements.filter(
          (element) => element.type === "freedraw" && !element.isDeleted,
        ),
      ).toHaveLength(0);

      finger.down(80, 80);
      finger2.down(100, 80);
      finger.move(-20, 0);
      expect(h.state.zoom.value).toBe(zoom.value);
      finger.up();
      finger2.up();
    });
  });
});
