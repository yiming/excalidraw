import {
  SLIDE_PAPER_SIZES,
  WORKSPACE_LIMITS,
  buildWorkspaceFile,
  countedFileCount,
  countedPageTotal,
  isOverQuota,
  quotaExcess,
} from "./workspaceLibrary";

import type { WorkspaceFile } from "./workspaceLibrary";

const slide = (pageCount: number, name = "Slides"): WorkspaceFile => ({
  id: name,
  name,
  kind: "slide",
  paperSize: "16:9-landscape",
  pageCount,
  pageBackgrounds: Array.from({ length: pageCount }, () => "#ffffff"),
  updatedAt: 1,
});

const infinite = (name = "Board"): WorkspaceFile => ({
  id: name,
  name,
  kind: "infinite",
  paperSize: null,
  pageCount: 1,
  pageBackgrounds: ["#ffffff"],
  updatedAt: 1,
});

describe("workspace quota", () => {
  it("counts two files of ten pages as twenty and inside the limit", () => {
    const files = [slide(10, "A"), slide(10, "B")];
    expect(countedFileCount(files)).toBe(WORKSPACE_LIMITS.countedFiles);
    expect(countedPageTotal(files)).toBe(WORKSPACE_LIMITS.countedPages);
    expect(isOverQuota(files)).toBe(false);
  });

  it("does not count an infinite canvas toward files or pages", () => {
    const files = [slide(10, "A"), slide(10, "B"), infinite("Canvas")];
    expect(countedFileCount(files)).toBe(2);
    expect(countedPageTotal(files)).toBe(20);
    expect(isOverQuota(files)).toBe(false);
    expect(
      countedPageTotal([
        {
          ...infinite("Wide"),
          pageCount: 40,
          pageBackgrounds: Array.from({ length: 40 }, () => "#ffffff"),
        },
      ]),
    ).toBe(0);
  });

  it("flags a third counted file, an eleventh page, and a twenty-first page", () => {
    expect(
      quotaExcess([slide(1, "A"), slide(1, "B"), slide(1, "C")]),
    ).toMatchObject({ overFiles: true });
    expect(quotaExcess([slide(11, "A")])).toMatchObject({
      overFilePages: true,
    });
    expect(
      quotaExcess([slide(10, "A"), slide(10, "B"), slide(1, "C")]),
    ).toMatchObject({ overTotalPages: true, overFiles: true });
    expect(isOverQuota([slide(10, "A"), slide(11, "B")])).toBe(true);
  });

  it("builds a slide from the six paper sizes and a default of ten white pages", () => {
    expect(SLIDE_PAPER_SIZES).toEqual([
      "16:9-landscape",
      "16:9-portrait",
      "4:3-landscape",
      "4:3-portrait",
      "a4-landscape",
      "a4-portrait",
    ]);
    expect(SLIDE_PAPER_SIZES.join(" ")).not.toMatch(/ipad/i);

    const file = buildWorkspaceFile({
      name: "  Lecture  ",
      kind: "slide",
      paperSize: "a4-portrait",
      pageCount: 10,
      now: 5,
    });
    expect(file.name).toBe("Lecture");
    expect(file.paperSize).toBe("a4-portrait");
    expect(file.pageCount).toBe(10);
    expect(file.pageBackgrounds).toEqual(Array(10).fill("#ffffff"));
    file.pageBackgrounds[0] = "#000000";
    expect(file.pageBackgrounds[1]).toBe("#ffffff");
  });

  it("builds an infinite canvas as one uncounted page without a paper size", () => {
    const file = buildWorkspaceFile({
      name: "Board",
      kind: "infinite",
      paperSize: "4:3-landscape",
      pageCount: 10,
      now: 5,
    });
    expect(file.kind).toBe("infinite");
    expect(file.paperSize).toBeNull();
    expect(file.pageCount).toBe(1);
    expect(countedFileCount([file])).toBe(0);
    expect(countedPageTotal([file])).toBe(0);
  });
});
