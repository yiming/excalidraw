import { useUIAppState } from "../context/ui-appState";
import { t } from "../i18n";

import DropdownMenu from "./dropdownMenu/DropdownMenu";

import type { AppClassProperties } from "../types";

/** ON/OFF only. Size tiers live on the settings page, not in this item. */
export const PenModeMenuItem = ({ app }: { app: AppClassProperties }) => {
  const appState = useUIAppState();
  const selected = appState.penMode;

  return (
    <DropdownMenu.ItemCheckbox
      checked={selected}
      selected={selected}
      aria-pressed={selected}
      data-testid="toolbar-pen-mode"
      badge={
        <span data-testid="toolbar-pen-mode-state">
          {selected ? t("labels.on") : t("labels.off")}
        </span>
      }
      onSelect={(event) => {
        event.preventDefault();
        app.togglePenMode(null);
      }}
    >
      {t("toolBar.penMode")}
    </DropdownMenu.ItemCheckbox>
  );
};
