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
      "settings-category-about",
      "settings-category-finger",
      "settings-category-preferences",
      "settings-category-theme",
      "settings-category-language",
    ]);
  });

  it("shows the thank-you sentence and the five links on one page", () => {
    act(() => {
      h.app.setState({ openDialog: { name: "settings" } });
    });
    fireEvent.click(
      document.querySelector("[data-testid='settings-category-thanks']")!,
    );
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
    act(() => {
      h.app.setState({ openDialog: { name: "settings" } });
    });
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

    fireEvent.click(document.querySelector("[data-testid='settings-close']")!);
    expect(h.state.openDialog).toBeNull();
  });

  it("defaults the finger-mode size tier to large and keeps the switch out of settings", () => {
    expect(h.state.fingerModeSize).toBe("large");
    act(() => {
      h.app.setState({ openDialog: { name: "settings" } });
    });
    fireEvent.click(
      document.querySelector("[data-testid='settings-category-finger']")!,
    );
    const detail = document.querySelector("[data-testid='settings-detail']");
    expect(detail?.textContent).toContain("Large");
    expect(detail?.textContent).toContain("Extra Large");
    expect(detail?.textContent).not.toContain("Pen mode");
    const large = Array.from(detail?.querySelectorAll("button") ?? []).find(
      (button) => button.textContent === "Large",
    );
    expect(large?.getAttribute("aria-pressed")).toBe("true");
  });
});
