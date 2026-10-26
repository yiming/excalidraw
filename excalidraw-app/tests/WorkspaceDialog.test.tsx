import { vi } from "vitest";

import { API } from "@excalidraw/excalidraw/tests/helpers/api";
import { Excalidraw } from "@excalidraw/excalidraw";
import { fileSave } from "@excalidraw/excalidraw/data/filesystem";
import {
  act,
  fireEvent,
  render,
  waitFor,
} from "@excalidraw/excalidraw/tests/test-utils";

import { AppMainMenu } from "../components/AppMainMenu";
import { AppWelcomeScreen } from "../components/AppWelcomeScreen";
import { WorkspaceDialog } from "../components/WorkspaceDialog";
import { createMemoryWorkspaceStore } from "../data/workspaceLibrary";

import type { WorkspaceFile } from "../data/workspaceLibrary";

vi.mock("@excalidraw/excalidraw/data/filesystem", () => ({
  fileSave: vi.fn(async () => null),
}));

const { h } = window;

const slide = (id: string, pageCount: number): WorkspaceFile => ({
  id,
  name: id,
  kind: "slide",
  paperSize: "16:9-landscape",
  pageCount,
  pageBackgrounds: Array.from({ length: pageCount }, () => "#ffffff"),
  updatedAt: 1,
});

const renderWorkspace = async (store = createMemoryWorkspaceStore()) => {
  await render(
    <Excalidraw>
      <AppMainMenu
        onCollabDialogOpen={() => {}}
        isCollaborating={false}
        isCollabEnabled={false}
        theme="light"
        refresh={() => {}}
      />
      <AppWelcomeScreen onCollabDialogOpen={() => {}} isCollabEnabled={false} />
      <WorkspaceDialog store={store} />
    </Excalidraw>,
  );
  return store;
};

const openMenu = () => {
  fireEvent.click(document.querySelector("[data-testid='main-menu-trigger']")!);
};

const openWorkspace = async () => {
  openMenu();
  fireEvent.click(
    document.querySelector("[data-testid='workspace-menu-item']")!,
  );
  await waitFor(() => {
    expect(
      document.querySelector("[data-testid='workspace-dialog']"),
    ).not.toBeNull();
  });
};

const createFile = async (name: string, kind: "Slide" | "Infinite canvas") => {
  fireEvent.click(
    document.querySelector("[data-testid='workspace-new-file']")!,
  );
  fireEvent.change(document.querySelector(".ExcTextField input")!, {
    target: { value: name },
  });
  fireEvent.click(document.querySelector(`input[aria-label='${kind}']`)!);
  fireEvent.click(document.querySelector("[data-testid='workspace-create']")!);
  await waitFor(() => {
    expect(
      document.querySelector("[data-testid='workspace-new-file']") ||
        document.querySelector("[data-testid='workspace-warning']"),
    ).not.toBeNull();
  });
};

describe("local workspace", () => {
  it("adds Workspace to the menu and leaves open, save, and export there", async () => {
    await renderWorkspace();
    expect(
      document.querySelector(".welcome-screen-center")?.textContent,
    ).not.toContain("Open");

    act(() => {
      h.app.setState({ fileHandle: {} as FileSystemFileHandle });
    });
    openMenu();
    const labels = Array.from(
      document.querySelectorAll(".main-menu button"),
    ).map((button) => button.textContent);
    const workspace = labels.findIndex((label) => label?.includes("Workspace"));
    const settings = labels.findIndex((label) => label?.includes("Settings"));
    expect(workspace).toBeGreaterThanOrEqual(0);
    expect(settings).toBeGreaterThan(workspace);
    expect(
      document.querySelector("[data-testid='load-button']"),
    ).not.toBeNull();
    expect(
      document.querySelector("[data-testid='save-button']"),
    ).not.toBeNull();
    expect(
      document.querySelector("[data-testid='json-export-button']"),
    ).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/google drive/i);
  });

  it("requires a name and creates a ten-page slide without a location picker", async () => {
    const store = await renderWorkspace();
    await openWorkspace();
    fireEvent.click(
      document.querySelector("[data-testid='workspace-new-file']")!,
    );
    expect(
      (
        document.querySelector(
          "[data-testid='workspace-create']",
        ) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      document.querySelector("[data-testid='workspace-pages']"),
    ).toBeNull();
    expect(document.body.textContent).not.toMatch(/location|資料夾|位置/i);

    fireEvent.click(document.querySelector("input[aria-label='Slide']")!);
    const pages = document.querySelector(
      "[data-testid='workspace-pages']",
    ) as HTMLSelectElement;
    const paper = document.querySelector(
      "[data-testid='workspace-paper']",
    ) as HTMLSelectElement;
    expect(pages.value).toBe("10");
    expect(Array.from(pages.options).map((option) => option.value)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ]);
    expect(
      Array.from(paper.options).map((option) => option.textContent),
    ).toEqual([
      "16:9 landscape",
      "16:9 portrait",
      "4:3 landscape",
      "4:3 portrait",
      "A4 landscape",
      "A4 portrait",
    ]);
    expect(paper.textContent).not.toMatch(/ipad/i);

    fireEvent.change(paper, { target: { value: "a4-portrait" } });
    fireEvent.change(document.querySelector(".ExcTextField input")!, {
      target: { value: "Lecture" },
    });
    fireEvent.click(
      document.querySelector("[data-testid='workspace-create']")!,
    );
    await waitFor(() => {
      expect(document.body.textContent).toContain("Lecture");
    });
    const saved = await store.load();
    expect(saved).toHaveLength(1);
    expect(saved[0].kind).toBe("slide");
    expect(saved[0].paperSize).toBe("a4-portrait");
    expect(saved[0].pageCount).toBe(10);
    expect(saved[0].pageBackgrounds).toEqual(Array(10).fill("#ffffff"));
    expect(
      document.querySelector("[data-testid='workspace-paper']"),
    ).toBeNull();
  });

  it("opens a file onto the canvas and keeps it after a soft limit warning", async () => {
    const store = createMemoryWorkspaceStore([
      {
        id: "colored",
        name: "Colored",
        kind: "slide",
        paperSize: "4:3-landscape",
        pageCount: 2,
        pageBackgrounds: ["#abcdef", "#111111"],
        updatedAt: 1,
      },
    ]);
    await renderWorkspace(store);
    API.setElements([
      API.createElement({
        type: "rectangle",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
      }),
    ]);
    await openWorkspace();
    fireEvent.click(
      document.querySelector("[data-testid='workspace-open-colored']")!,
    );
    await waitFor(() => {
      expect(h.state.openDialog).toBeNull();
    });
    expect(h.state.name).toBe("Colored");
    expect(h.state.viewBackgroundColor).toBe("#abcdef");
    expect(h.elements).toHaveLength(0);
    expect((await store.load())[0].pageBackgrounds).toEqual([
      "#abcdef",
      "#111111",
    ]);

    await openWorkspace();
    await createFile("One", "Slide");
    await createFile("Two", "Infinite canvas");
    expect(
      document.querySelector("[data-testid='workspace-warning']"),
    ).toBeNull();
    await createFile("Three", "Slide");
    expect(
      document.querySelector("[data-testid='workspace-warning']")?.textContent,
    ).toContain(".excalidraw");
    expect(
      document.querySelector("[data-testid='workspace-dialog']")?.textContent,
    ).not.toMatch(/drive/i);
    expect(await store.load()).toHaveLength(4);

    fireEvent.click(
      document.querySelector("[data-testid='workspace-warning-export']")!,
    );
    await waitFor(() => {
      expect(fileSave).toHaveBeenCalled();
    });
    const blob = vi.mocked(fileSave).mock.calls.at(-1)?.[0] as Blob;
    const serialized = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
    const exported = JSON.parse(serialized);
    expect(exported.elements).toEqual([]);
    expect(exported.appState.viewBackgroundColor).toBe("#ffffff");
    expect(vi.mocked(fileSave).mock.calls.at(-1)?.[1]).toMatchObject({
      name: "Three",
      extension: "excalidraw",
    });

    fireEvent.click(document.querySelector("[aria-label='Delete Three']")!);
    await waitFor(() => {
      expect(
        document.querySelector("[data-testid='workspace-warning']"),
      ).toBeNull();
    });
    expect((await store.load()).map((file) => file.name)).toEqual([
      "Colored",
      "One",
      "Two",
    ]);
  });

  it("warns without removing a stored file that already exceeds ten pages", async () => {
    const store = createMemoryWorkspaceStore([slide("Packed", 11)]);
    await renderWorkspace(store);
    await openWorkspace();
    expect(
      document.querySelector("[data-testid='workspace-warning']"),
    ).not.toBeNull();
    expect(document.body.textContent).toContain("Packed");
    expect(await store.load()).toHaveLength(1);
  });
});
