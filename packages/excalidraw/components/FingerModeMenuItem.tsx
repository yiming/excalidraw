import { useUIAppState } from "../context/ui-appState";
import { t } from "../i18n";

import DropdownMenu from "./dropdownMenu/DropdownMenu";
import { fingerIcon } from "./icons";
import { Switch } from "./Switch";

import type { AppClassProperties } from "../types";

/** Icon, 「手指模式」, and a switch. No check, shortcut, or subtitle. */
export const FingerModeMenuItem = ({ app }: { app: AppClassProperties }) => {
  const appState = useUIAppState();

  return (
    <DropdownMenu.Item
      icon={fingerIcon}
      data-testid="toolbar-finger-mode"
      badge={
        <span
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.stopPropagation();
            }
          }}
        >
          <Switch
            name="toolbar-finger-mode"
            checked={appState.fingerMode}
            title={t("labels.fingerMode")}
            onChange={(value) => app.setAppState({ fingerMode: value })}
          />
        </span>
      }
      onSelect={(event) => {
        event.preventDefault();
        const target = event.target as HTMLElement | null;
        if (target?.closest(".Switch")) {
          return;
        }
        app.setAppState({ fingerMode: !appState.fingerMode });
      }}
    >
      {t("labels.fingerMode")}
    </DropdownMenu.Item>
  );
};
