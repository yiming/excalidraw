import { useEffect, useState } from "react";

import { COLOR_PALETTE, MIME_TYPES } from "@excalidraw/common";
import { CaptureUpdateAction } from "@excalidraw/element";
import {
  useExcalidrawAPI,
  useExcalidrawSetAppState,
} from "@excalidraw/excalidraw/components/App";
import { Dialog } from "@excalidraw/excalidraw/components/Dialog";
import DialogActionButton from "@excalidraw/excalidraw/components/DialogActionButton";
import { RadioGroup } from "@excalidraw/excalidraw/components/RadioGroup";
import { TextField } from "@excalidraw/excalidraw/components/TextField";
import { getDropdownMenuItemClassName } from "@excalidraw/excalidraw/components/dropdownMenu/common";
import DropdownMenuGroup from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuGroup";
import MenuItemContent from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuItemContent";
import {
  LibraryIcon,
  TrashIcon,
} from "@excalidraw/excalidraw/components/icons";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";
import { fileSave } from "@excalidraw/excalidraw/data/filesystem";
import { serializeAsJSON } from "@excalidraw/excalidraw/data/json";
import { useI18n } from "@excalidraw/excalidraw/i18n";

import {
  DEFAULT_PAGE_BACKGROUND,
  SLIDE_PAPER_SIZES,
  buildWorkspaceFile,
  isOverQuota,
  workspaceIndexedDbStore,
} from "../data/workspaceLibrary";

import type {
  SlidePaperSize,
  WorkspaceFile,
  WorkspaceKind,
  WorkspaceStore,
} from "../data/workspaceLibrary";

type WorkspaceView = "list" | "create" | "warning";

const paperLabelKey = {
  "16:9-landscape": "workspace.paper.16x9Landscape",
  "16:9-portrait": "workspace.paper.16x9Portrait",
  "4:3-landscape": "workspace.paper.4x3Landscape",
  "4:3-portrait": "workspace.paper.4x3Portrait",
  "a4-landscape": "workspace.paper.a4Landscape",
  "a4-portrait": "workspace.paper.a4Portrait",
} as const;

export const WorkspaceDialog = ({
  store = workspaceIndexedDbStore,
}: {
  store?: WorkspaceStore;
}) => {
  const { t } = useI18n();
  const api = useExcalidrawAPI();
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();
  const open = appState.openDialog?.name === "workspace";
  const [view, setView] = useState<WorkspaceView>("list");
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [ready, setReady] = useState(false);
  const [warningFileId, setWarningFileId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<WorkspaceKind>("infinite");
  const [paperSize, setPaperSize] = useState<SlidePaperSize>("16:9-landscape");
  const [pageCount, setPageCount] = useState(10);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;
    setReady(false);
    setView("list");
    setWarningFileId(null);
    void store.load().then((loaded) => {
      if (cancelled) {
        return;
      }
      setFiles(loaded);
      if (isOverQuota(loaded)) {
        setWarningFileId(loaded[loaded.length - 1]?.id ?? null);
        setView("warning");
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [open, store]);

  if (!open || !ready) {
    return null;
  }

  const close = () => setAppState({ openDialog: null });

  const openFile = (file: WorkspaceFile) => {
    api?.updateScene({
      elements: [],
      appState: {
        name: file.name,
        viewBackgroundColor: file.pageBackgrounds[0] ?? DEFAULT_PAGE_BACKGROUND,
      },
      captureUpdate: CaptureUpdateAction.NEVER,
    });
    close();
  };

  const removeFile = async (id: string) => {
    const next = files.filter((file) => file.id !== id);
    await store.save(next);
    setFiles(next);
    if (!isOverQuota(next)) {
      setView("list");
      setWarningFileId(null);
    }
  };

  const startCreate = () => {
    setName("");
    setKind("infinite");
    setPaperSize("16:9-landscape");
    setPageCount(10);
    setView("create");
  };

  const createFile = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const file = buildWorkspaceFile({
      name: trimmed,
      kind,
      paperSize: kind === "slide" ? paperSize : null,
      pageCount: kind === "slide" ? pageCount : 1,
    });
    const next = [...files, file];
    await store.save(next);
    setFiles(next);
    setName("");
    if (isOverQuota(next)) {
      setWarningFileId(file.id);
      setView("warning");
      return;
    }
    setView("list");
  };

  const exportFile = async () => {
    const file =
      files.find((item) => item.id === warningFileId) ??
      files[files.length - 1];
    if (!file) {
      return;
    }
    try {
      const serialized = serializeAsJSON(
        [],
        {
          name: file.name,
          viewBackgroundColor: file.pageBackgrounds[0] ?? COLOR_PALETTE.white,
        },
        {},
        "local",
      );
      await fileSave(new Blob([serialized], { type: MIME_TYPES.excalidraw }), {
        name: file.name,
        extension: "excalidraw",
        mimeTypes: [MIME_TYPES.excalidraw],
        description: "Excalidraw file",
      });
    } catch (error) {
      console.warn("Failed to export workspace file:", error);
    }
  };

  const fileList = (listed: readonly WorkspaceFile[]) => (
    <div className="dropdown-menu">
      <div className="dropdown-menu-container">
        {listed.map((file) => (
          <div key={file.id}>
            <button
              type="button"
              className={getDropdownMenuItemClassName()}
              data-testid={`workspace-open-${file.id}`}
              onClick={() => openFile(file)}
            >
              <MenuItemContent icon={LibraryIcon}>{file.name}</MenuItemContent>
            </button>
            <button
              type="button"
              className={getDropdownMenuItemClassName()}
              data-testid={`workspace-delete-${file.id}`}
              aria-label={`${t("workspace.delete")} ${file.name}`}
              onClick={() => {
                void removeFile(file.id);
              }}
            >
              <MenuItemContent icon={TrashIcon}>
                {t("workspace.delete")}
              </MenuItemContent>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog
      className="WorkspaceDialog"
      size="small"
      title={t("labels.workspace")}
      onCloseRequest={close}
    >
      <div data-testid="workspace-dialog">
        {view === "list" && (
          <>
            <div className="dropdown-menu">
              <div className="dropdown-menu-container">
                <button
                  type="button"
                  className={getDropdownMenuItemClassName()}
                  data-testid="workspace-new-file"
                  onClick={startCreate}
                >
                  <MenuItemContent icon={LibraryIcon}>
                    {t("workspace.newFile")}
                  </MenuItemContent>
                </button>
              </div>
            </div>
            {files.length === 0 ? (
              <p className="excalidraw__paragraph">{t("workspace.empty")}</p>
            ) : (
              fileList(files)
            )}
          </>
        )}
        {view === "create" && (
          <>
            <TextField
              label={t("labels.fileTitle")}
              placeholder={t("labels.fileTitle")}
              fullWidth
              value={name}
              onChange={setName}
            />
            <DropdownMenuGroup title={t("workspace.type")}>
              <RadioGroup<WorkspaceKind>
                name="workspace-kind"
                value={kind}
                onChange={setKind}
                choices={[
                  {
                    value: "infinite",
                    label: t("workspace.infinite"),
                    ariaLabel: t("workspace.infinite"),
                  },
                  {
                    value: "slide",
                    label: t("workspace.slide"),
                    ariaLabel: t("workspace.slide"),
                  },
                ]}
              />
            </DropdownMenuGroup>
            {kind === "slide" && (
              <>
                <DropdownMenuGroup title={t("workspace.paperSize")}>
                  <select
                    className="dropdown-select"
                    data-testid="workspace-paper"
                    aria-label={t("workspace.paperSize")}
                    value={paperSize}
                    onChange={(event) =>
                      setPaperSize(event.target.value as SlidePaperSize)
                    }
                  >
                    {SLIDE_PAPER_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {t(paperLabelKey[size])}
                      </option>
                    ))}
                  </select>
                </DropdownMenuGroup>
                <DropdownMenuGroup title={t("workspace.pages")}>
                  <select
                    className="dropdown-select"
                    data-testid="workspace-pages"
                    aria-label={t("workspace.pages")}
                    value={pageCount}
                    onChange={(event) =>
                      setPageCount(Number(event.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ),
                    )}
                  </select>
                </DropdownMenuGroup>
              </>
            )}
            <div className="confirm-dialog-buttons">
              <DialogActionButton
                label={t("buttons.back")}
                onClick={() => setView("list")}
              />
              <DialogActionButton
                label={t("workspace.create")}
                actionType="primary"
                data-testid="workspace-create"
                disabled={!name.trim()}
                onClick={() => {
                  void createFile();
                }}
              />
            </div>
          </>
        )}
        {view === "warning" && (
          <>
            <p
              className="excalidraw__paragraph"
              data-testid="workspace-warning"
            >
              {t("workspace.overLimit")}
            </p>
            {fileList(files)}
            <div className="confirm-dialog-buttons">
              <DialogActionButton
                label={t("workspace.export")}
                actionType="primary"
                data-testid="workspace-warning-export"
                onClick={() => {
                  void exportFile();
                }}
              />
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
