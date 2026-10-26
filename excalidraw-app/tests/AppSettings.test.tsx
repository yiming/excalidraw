import React from "react";

import { Excalidraw } from "@excalidraw/excalidraw";
import {
  act,
  fireEvent,
  render,
} from "@excalidraw/excalidraw/tests/test-utils";

import { AppMainMenu } from "../components/AppMainMenu";
import { AppSettings } from "../components/AppSettings";

const { h } = window;

const openSettings = () => {
  act(() => {
    h.app.setState({ openDialog: { name: "settings" } });
  });
};

describe("iPad settings page", () => {
  beforeEach(async () => {
    await render(
      <Excalidraw>
        <AppMainMenu
          onCollabDialogOpen={() => {}}
          isCollaborating={false}
          isCollabEnabled={false}
          theme="light"
          refresh={() => {}}
        />
        <AppSettings theme="light" />
      </Excalidraw>,
    );
  });

  it("opens settings between help and reset, without promotional links", () => {
    fireEvent.click(
      document.querySelector("[data-testid='main-menu-trigger']")!,
    );
    const menu = document.querySelector(".main-menu");
    expect(menu?.textContent).toContain("Settings");
    expect(menu?.textContent).not.toContain("GitHub");
    expect(menu?.textContent).not.toContain("Excalidraw+");
    expect(menu?.textContent).not.toContain("Sign up");
    const labels = Array.from(menu?.querySelectorAll("button") ?? []).map(
      (button) => button.textContent,
    );
    const help = labels.findIndex((label) => label?.includes("Help"));
    const settings = labels.findIndex((label) => label?.includes("Settings"));
    const reset = labels.findIndex((label) =>
      label?.includes("Reset the canvas"),
    );
    expect(help).toBeGreaterThanOrEqual(0);
    expect(settings).toBeGreaterThan(help);
    expect(reset).toBeGreaterThan(settings);

    fireEvent.click(
      document.querySelector("[data-testid='settings-menu-item']")!,
    );
    expect(h.state.openDialog).toEqual({ name: "settings" });
    expect(
      document.querySelector("[data-testid='settings-category-thanks']")
        ?.textContent,
    ).toBe("Special Thanks To");
    expect(
      Array.from(
        document.querySelectorAll("button[data-testid^='settings-category-']"),
      ).map((button) => button.getAttribute("data-testid")),
    ).toEqual([
      "settings-category-thanks",
      "settings-category-preferences",
      "settings-category-themeLanguage",
      "settings-category-about",
    ]);
    expect(document.querySelector("[data-testid='settings-close']")).toBeNull();
    expect(document.querySelector(".Dialog__close")).toBeNull();
    expect(
      document.querySelector("[data-testid='settings-back']")?.textContent,
    ).toBe("Back");
    expect(
      document
        .querySelector("[data-testid='settings-dialog']")
        ?.closest(".excalidraw"),
    ).not.toBeNull();
  });

  it("shows the thank-you sentence and the five links on one page", () => {
    openSettings();
    const sentence = document.querySelector(
      "[data-testid='settings-thanks-sentence']",
    );
    expect(sentence?.textContent).toBe(
      "Special thanks to the original Excalidraw authors.",
    );
    expect(sentence?.closest("a")).toBeNull();
    const hrefs = Array.from(
      document.querySelectorAll("[data-testid='settings-thanks'] a"),
    ).map((anchor) => (anchor as HTMLAnchorElement).href);
    expect(hrefs.some((href) => href.includes("plus"))).toBe(true);
    expect(
      hrefs.filter((href) => href.includes("github.com/excalidraw/excalidraw")),
    ).toHaveLength(1);
    expect(hrefs.some((href) => href.includes("x.com/excalidraw"))).toBe(true);
    expect(hrefs.some((href) => href.includes("discord.gg"))).toBe(true);
    expect(hrefs.some((href) => href.includes("sign-up"))).toBe(true);
    expect(hrefs).toHaveLength(5);
  });

  it("describes this fork on About and keeps credit links off that page", () => {
    openSettings();
    fireEvent.click(
      document.querySelector("[data-testid='settings-category-about']")!,
    );
    const about = document.querySelector("[data-testid='settings-about']");
    expect(
      about?.querySelector("[data-testid='settings-about-name']")?.textContent,
    ).toBe("Excalidraw");
    expect(about?.textContent).toContain(
      "An iPad-friendly fork of Excalidraw.",
    );
    expect(
      about?.querySelector("[data-testid='settings-about-version']")
        ?.textContent,
    ).toContain("Version");
    const repo = about?.querySelector(
      "[data-testid='settings-about-repo']",
    ) as HTMLAnchorElement | null;
    expect(repo?.href).toBe("https://github.com/yiming/excalidraw");
    const hrefs = Array.from(about?.querySelectorAll("a") ?? []).map(
      (anchor) => (anchor as HTMLAnchorElement).href,
    );
    expect(hrefs).toHaveLength(1);
    expect(about?.textContent).not.toContain("Excalidraw+");
    expect(about?.textContent).not.toContain("Discord");
    expect(about?.textContent).not.toContain("Sign up");

    fireEvent.click(document.querySelector("[data-testid='settings-back']")!);
    expect(h.state.openDialog).toBeNull();
  });

  it("puts theme, language, the finger switch, and per-item sizes on one page", () => {
    expect(h.state.fingerMode).toBe(false);
    expect(h.state.fingerModeDefaultButton).toBe("large");
    expect(h.state.fingerModeScaleHandle).toBe("large");
    expect(h.state.fingerModeRotateHandle).toBe("large");
    openSettings();
    fireEvent.click(
      document.querySelector(
        "[data-testid='settings-category-themeLanguage']",
      )!,
    );
    const detail = document.querySelector("[data-testid='settings-detail']");
    expect(detail?.textContent).toContain("Theme");
    expect(detail?.textContent).toContain("Language");
    expect(detail?.querySelector("select")).not.toBeNull();
    expect(detail?.querySelector("[name='settings-theme']")).not.toBeNull();
    const row = document.querySelector("[data-testid='settings-finger-mode']");
    expect(row?.textContent).toContain("Finger mode");
    expect(row?.textContent).not.toContain("Pen mode");
    expect(row?.querySelector("svg")).not.toBeNull();
    expect(row?.querySelector("input[type='checkbox']")).not.toBeNull();
    expect(row?.querySelector(".dropdown-menu-item__shortcut")).toBeNull();
    const sizes = [
      "settings-size-default-button",
      "settings-size-large-button",
      "settings-size-menu-item",
      "settings-size-menu-gap",
      "settings-size-scale-handle",
      "settings-size-rotate-handle",
    ];
    for (const id of sizes) {
      const group = document.querySelector(`[data-testid='${id}']`);
      expect(
        group?.querySelector(".RadioGroup__choice.active")?.textContent,
      ).toBe("Large");
    }
    const themeControl = detail?.querySelector("[name='settings-theme']");
    const languageControl = detail?.querySelector("select");
    const sizeControl = detail?.querySelector(
      "[data-testid='settings-size-default-button']",
    );
    expect(
      themeControl!.compareDocumentPosition(row!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      languageControl!.compareDocumentPosition(row!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
    expect(
      row!.compareDocumentPosition(sizeControl!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);

    fireEvent.click(row!.querySelector("input[type='checkbox']")!);
    expect(h.state.fingerMode).toBe(true);
    expect(h.state.penMode).toBe(false);

    const scale = document.querySelector(
      "[data-testid='settings-size-scale-handle'] .RadioGroup__choice:last-child input",
    )!;
    fireEvent.click(scale);
    expect(h.state.fingerModeScaleHandle).toBe("xl");
    expect(h.state.fingerModeRotateHandle).toBe("large");
  });

  it("uses Switch for a preference and closes on Escape", () => {
    openSettings();
    fireEvent.click(
      document.querySelector("[data-testid='settings-category-preferences']")!,
    );
    const grid = document.querySelector(
      "input[name='settings-grid']",
    ) as HTMLInputElement;
    expect(grid).not.toBeNull();
    expect(
      document.querySelector("[data-testid='settings-dialog'] [aria-pressed]"),
    ).toBeNull();
    fireEvent.click(grid);
    expect(h.state.gridModeEnabled).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(h.state.openDialog).toBeNull();
  });
});
