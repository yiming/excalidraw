import { createStore, get, set } from "idb-keyval";

import { COLOR_PALETTE, randomId } from "@excalidraw/common";

import { STORAGE_KEYS } from "../app_constants";

export const WORKSPACE_LIMITS = {
  countedFiles: 2,
  pagesPerFile: 10,
  countedPages: 20,
} as const;

export const SLIDE_PAPER_SIZES = [
  "16:9-landscape",
  "16:9-portrait",
  "4:3-landscape",
  "4:3-portrait",
  "a4-landscape",
  "a4-portrait",
] as const;

export type SlidePaperSize = typeof SLIDE_PAPER_SIZES[number];

export type WorkspaceKind = "infinite" | "slide";

export type WorkspaceFile = {
  id: string;
  name: string;
  kind: WorkspaceKind;
  paperSize: SlidePaperSize | null;
  pageCount: number;
  pageBackgrounds: string[];
  updatedAt: number;
};

export const DEFAULT_PAGE_BACKGROUND = COLOR_PALETTE.white;

export const isCountedFile = (file: { kind: WorkspaceKind }) =>
  file.kind === "slide";

export const countedFileCount = (files: readonly WorkspaceFile[]) =>
  files.filter(isCountedFile).length;

export const countedPageTotal = (files: readonly WorkspaceFile[]) =>
  files.reduce(
    (total, file) => total + (isCountedFile(file) ? file.pageCount : 0),
    0,
  );

export const quotaExcess = (files: readonly WorkspaceFile[]) => {
  const counted = files.filter(isCountedFile);
  return {
    overFiles: counted.length > WORKSPACE_LIMITS.countedFiles,
    overFilePages: counted.some(
      (file) => file.pageCount > WORKSPACE_LIMITS.pagesPerFile,
    ),
    overTotalPages: countedPageTotal(files) > WORKSPACE_LIMITS.countedPages,
  };
};

export const isOverQuota = (files: readonly WorkspaceFile[]) => {
  const excess = quotaExcess(files);
  return excess.overFiles || excess.overFilePages || excess.overTotalPages;
};

const isSlidePaperSize = (value: string | null): value is SlidePaperSize =>
  value !== null && (SLIDE_PAPER_SIZES as readonly string[]).includes(value);

const clampPageCount = (count: number) => {
  if (!Number.isFinite(count)) {
    return WORKSPACE_LIMITS.pagesPerFile;
  }
  return Math.min(
    WORKSPACE_LIMITS.pagesPerFile,
    Math.max(1, Math.floor(count)),
  );
};

export const buildWorkspaceFile = (input: {
  name: string;
  kind: WorkspaceKind;
  paperSize: SlidePaperSize | null;
  pageCount: number;
  now?: number;
}): WorkspaceFile => {
  const pageCount =
    input.kind === "infinite" ? 1 : clampPageCount(input.pageCount);
  return {
    id: randomId(),
    name: input.name.trim(),
    kind: input.kind,
    paperSize:
      input.kind === "slide"
        ? isSlidePaperSize(input.paperSize)
          ? input.paperSize
          : "16:9-landscape"
        : null,
    pageCount,
    pageBackgrounds: Array.from(
      { length: pageCount },
      () => DEFAULT_PAGE_BACKGROUND,
    ),
    updatedAt: input.now ?? Date.now(),
  };
};

export type WorkspaceStore = {
  load: () => Promise<WorkspaceFile[]>;
  save: (files: WorkspaceFile[]) => Promise<void>;
};

export const createMemoryWorkspaceStore = (
  initial: readonly WorkspaceFile[] = [],
): WorkspaceStore => {
  let files = initial.slice();
  return {
    async load() {
      return files.slice();
    },
    async save(next) {
      files = next.slice();
    },
  };
};

const isWorkspaceFile = (value: unknown): value is WorkspaceFile => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const file = value as WorkspaceFile;
  return (
    typeof file.id === "string" &&
    typeof file.name === "string" &&
    (file.kind === "infinite" || file.kind === "slide") &&
    typeof file.pageCount === "number" &&
    Array.isArray(file.pageBackgrounds)
  );
};

const workspaceDb = createStore(
  `${STORAGE_KEYS.IDB_WORKSPACE}-db`,
  `${STORAGE_KEYS.IDB_WORKSPACE}-store`,
);

const WORKSPACE_FILES_KEY = "files";

export const workspaceIndexedDbStore: WorkspaceStore = {
  async load() {
    try {
      const data = await get<unknown>(WORKSPACE_FILES_KEY, workspaceDb);
      return Array.isArray(data) ? data.filter(isWorkspaceFile) : [];
    } catch (error) {
      console.warn("Failed to load workspace files from IndexedDB:", error);
      return [];
    }
  },
  async save(files) {
    try {
      await set(WORKSPACE_FILES_KEY, files, workspaceDb);
    } catch (error) {
      console.warn("Failed to save workspace files to IndexedDB:", error);
      throw error;
    }
  },
};
