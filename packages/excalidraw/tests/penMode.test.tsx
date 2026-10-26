import React from "react";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { Pointer, UI } from "./helpers/ui";
import { fireEvent, render } from "./test-utils";

const { h } = window;

const mouse = new Pointer("mouse");
const finger = new Pointer("touch", 11);
const finger2 = new Pointer("touch", 12);
const pen = new Pointer("pen", 13);

const openPenModeItem = () => {
  const trigger = document.querySelector(
    ".App-toolbar__extra-tools-trigger",
  ) as HTMLElement;
  fireEvent.click(trigger);
  return document.querySelector(
    "[data-testid='toolbar-pen-mode']",
  ) as HTMLElement;
};

describe("pen mode", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  it("turns pen mode on from the first pen press", () => {
    expect(h.state.penDetected).toBe(false);
    pen.down(20, 20);
    pen.up(22, 22);
    expect(h.state.penMode).toBe(true);
    expect(h.state.penDetected).toBe(true);
  });

  it("toggles from the more-tools menu and keeps the menu item state", () => {
    const item = openPenModeItem();
    expect(item.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(item);
    expect(h.state.penMode).toBe(true);
    expect(item.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(item);
    expect(h.state.penMode).toBe(false);
    expect(item.getAttribute("aria-pressed")).toBe("false");
  });

  it("does not let a finger drag a selected element", () => {
    API.setAppState({ penMode: true, penDetected: true });
    const rect = UI.createElement("rectangle", { x: 20, y: 20, size: 40 });
    const x = rect.x;
    finger.down(30, 30);
    finger.move(40, 20);
    finger.up();
    expect(rect.x).toBe(x);
    expect(rect.y).toBe(20);
  });

  it("still lets a mouse draw while pen mode is on", () => {
    API.setAppState({ penMode: true, penDetected: true });
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(40, 40);
    expect(
      h.elements.filter(
        (element) => element.type === "rectangle" && !element.isDeleted,
      ),
    ).toHaveLength(1);
  });

  it("pans with one finger", () => {
    API.setAppState({ penMode: true, penDetected: true });
    const { scrollX, scrollY } = h.state;
    finger.down(30, 30);
    finger.move(20, 10);
    finger.up();
    expect(h.state.scrollX === scrollX && h.state.scrollY === scrollY).toBe(
      false,
    );
  });

  it("pinch-zooms in pen mode while freedraw is selected", () => {
    API.setAppState({ penMode: true, penDetected: true });
    UI.clickTool("freedraw");
    expect(h.state.zoom.value).toBe(1);
    finger.down(80, 80);
    finger2.down(100, 80);
    finger.move(-20, 0);
    expect(h.state.zoom.value).toBeGreaterThan(1);
    finger.up();
    finger2.up();
  });

  it("lets a pen draw after a finger is already down", () => {
    API.setAppState({ penMode: true, penDetected: true });
    UI.clickTool("freedraw");
    const zoom = h.state.zoom.value;
    finger.down(20, 20);
    pen.down(40, 40);
    pen.move(30, 10);
    pen.up();
    expect(h.state.zoom.value).toBe(zoom);
    expect(
      h.elements.filter(
        (element) => element.type === "freedraw" && !element.isDeleted,
      ).length,
    ).toBeGreaterThan(0);
    pen.down(70, 70);
    pen.move(20, 10);
    pen.up();
    expect(
      h.elements.filter(
        (element) => element.type === "freedraw" && !element.isDeleted,
      ).length,
    ).toBeGreaterThan(1);
    finger.up();
  });

  it("ignores a palm while a pen stroke is in progress", () => {
    API.setAppState({ penMode: true, penDetected: true });
    UI.clickTool("freedraw");
    pen.down(10, 10);
    pen.move(20, 0);
    const stroke = h.elements.find(
      (element) => element.type === "freedraw" && !element.isDeleted,
    );
    const pointCount =
      stroke && stroke.type === "freedraw" ? stroke.points.length : 0;
    finger.down(15, 15);
    finger.move(40, 40);
    finger.up();
    const during = h.elements.find(
      (element) => element.type === "freedraw" && !element.isDeleted,
    );
    expect(
      during && during.type === "freedraw" ? during.points.length : 0,
    ).toBe(pointCount);
    pen.move(10, 10);
    pen.up();
    expect(
      h.elements.filter(
        (element) => element.type === "freedraw" && !element.isDeleted,
      ),
    ).toHaveLength(1);
  });

  it("still aborts a short finger freedraw when pen mode is off", () => {
    UI.clickTool("freedraw");
    finger.down(10, 10);
    finger.move(2, 2);
    finger2.down(40, 40);
    expect(
      h.elements.filter(
        (element) => element.type === "freedraw" && !element.isDeleted,
      ),
    ).toHaveLength(0);
    finger.up();
    finger2.up();
  });

  it("still lets a finger draw a rectangle when pen mode is off", () => {
    UI.clickTool("rectangle");
    finger.down(10, 10);
    finger.up(40, 40);
    expect(
      h.elements.filter(
        (element) => element.type === "rectangle" && !element.isDeleted,
      ),
    ).toHaveLength(1);
  });
});
