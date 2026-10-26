import { useEffect, useState } from "react";

import clsx from "clsx";

import { getVersion, THEME } from "@excalidraw/common";
import {
  actionToggleArrowBinding,
  actionToggleGridMode,
  actionToggleMidpointSnapping,
  actionToggleObjectsSnapMode,
  actionToggleShowHints,
  actionToggleStats,
  actionToggleZenMode,
} from "@excalidraw/excalidraw/actions";
import { actionToggleViewMode } from "@excalidraw/excalidraw/actions/actionToggleViewMode";
import {
  useApp,
  useAppProps,
  useExcalidrawActionManager,
  useExcalidrawSetAppState,
} from "@excalidraw/excalidraw/components/App";
import { Dialog } from "@excalidraw/excalidraw/components/Dialog";
import {
  FINGER_MODE_SIZE_TIERS,
  fingerModeStyle,
  type FingerModeSizeTier,
} from "@excalidraw/excalidraw/components/fingerMode";
import { fingerIcon } from "@excalidraw/excalidraw/components/icons";
import { RadioGroup } from "@excalidraw/excalidraw/components/RadioGroup";
import { Switch } from "@excalidraw/excalidraw/components/Switch";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";
import { useI18n } from "@excalidraw/excalidraw/i18n";
import { resolveInputDevice } from "@excalidraw/excalidraw/appState";

import type { Theme } from "@excalidraw/element/types";

import { LanguageList } from "../app-language/LanguageList";
import { isExcalidrawPlusSignedUser } from "../app_constants";

import "./AppSettings.scss";

const CATEGORIES = ["thanks", "preferences", "themeLanguage", "about"] as const;

type Category = typeof CATEGORIES[number];

const sizeLabel = (
  tier: FingerModeSizeTier,
  translate: ReturnType<typeof useI18n>["t"],
) => {
  switch (tier) {
    case "small":
      return translate("labels.fingerModeSizeSmall");
    case "medium":
      return translate("labels.fingerModeSizeMedium");
    case "large":
      return translate("labels.fingerModeSizeLarge");
    case "xl":
      return translate("labels.fingerModeSizeExtraLarge");
  }
};

const SwitchRow = ({
  name,
  checked,
  label,
  onChange,
}: {
  name: string;
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) => (
  <div className="dropdown-menu-item AppSettings__switch-row">
    <span>{label}</span>
    <Switch name={name} checked={checked} title={label} onChange={onChange} />
  </div>
);

export const AppSettings = ({ theme }: { theme: Theme | "system" }) => {
  const { t } = useI18n();
  const app = useApp();
  const appProps = useAppProps();
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();
  const actionManager = useExcalidrawActionManager();
  const open = appState.openDialog?.name === "settings";
  const [category, setCategory] = useState<Category>("thanks");

  useEffect(() => {
    if (!open) {
      return;
    }
    const doc = app.ownerDocument;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAppState({ openDialog: null });
      }
    };
    doc.addEventListener("keydown", onKeyDown);
    return () => doc.removeEventListener("keydown", onKeyDown);
  }, [app, open, setAppState]);

  if (!open) {
    return null;
  }

  const close = () => setAppState({ openDialog: null });

  const categoryLabel = (id: Category) => {
    switch (id) {
      case "thanks":
        return t("labels.specialThanksTo");
      case "preferences":
        return t("labels.preferences");
      case "themeLanguage":
        return t("labels.themeAndLanguage");
      case "about":
        return t("labels.about");
    }
  };

  const run = (action: Parameters<typeof actionManager.executeAction>[0]) => {
    actionManager.executeAction(action);
  };

  const sizeChoices = FINGER_MODE_SIZE_TIERS.map((tier) => ({
    value: tier,
    label: sizeLabel(tier, t),
  }));

  return (
    <Dialog
      className={clsx(
        "AppSettings",
        appState.fingerMode && "excalidraw--finger-targets",
      )}
      size="wide"
      onCloseRequest={close}
      title={
        <button
          type="button"
          className="AppSettings__back"
          data-testid="settings-back"
          onClick={close}
        >
          {t("buttons.back")}
        </button>
      }
    >
      <div
        className="AppSettings__layout"
        data-testid="settings-dialog"
        style={fingerModeStyle(appState) ?? undefined}
      >
        <div className="AppSettings__list" data-testid="settings-category-list">
          {CATEGORIES.map((id) => (
            <button
              key={id}
              type="button"
              className={clsx("dropdown-menu-item", {
                "dropdown-menu-item--selected": category === id,
              })}
              aria-current={category === id ? "true" : undefined}
              data-testid={`settings-category-${id}`}
              onClick={() => setCategory(id)}
            >
              {categoryLabel(id)}
            </button>
          ))}
        </div>
        <div className="AppSettings__detail" data-testid="settings-detail">
          {category === "thanks" && <ThanksPane />}
          {category === "preferences" && (
            <>
              <div className="AppSettings__group">
                <h3 className="AppSettings__section">
                  {t("labels.boxSelectionMode")}
                </h3>
                <RadioGroup
                  name="settings-box-selection"
                  value={appState.boxSelectionMode}
                  onChange={(value) => setAppState({ boxSelectionMode: value })}
                  choices={[
                    {
                      value: "contain" as const,
                      label: t("labels.boxSelectionContain"),
                    },
                    {
                      value: "overlap" as const,
                      label: t("labels.boxSelectionOverlap"),
                    },
                  ]}
                />
              </div>
              <div className="AppSettings__group">
                <h3 className="AppSettings__section">
                  {t("labels.inputDevice")}
                </h3>
                <RadioGroup
                  name="settings-input-device"
                  value={resolveInputDevice(appState.inputDevice)}
                  onChange={(value) => setAppState({ inputDevice: value })}
                  choices={[
                    {
                      value: "trackpad" as const,
                      label: t("labels.inputDeviceTrackpad"),
                    },
                    {
                      value: "mouse" as const,
                      label: t("labels.inputDeviceMouse"),
                    },
                  ]}
                />
              </div>
              <SwitchRow
                name="settings-tool-lock"
                checked={appState.activeTool.locked}
                label={t("labels.preferences_toolLock")}
                onChange={() => app.toggleLock()}
              />
              <SwitchRow
                name="settings-objects-snap"
                checked={appState.objectsSnapModeEnabled}
                label={t("buttons.objectsSnapMode")}
                onChange={() => run(actionToggleObjectsSnapMode)}
              />
              <SwitchRow
                name="settings-grid"
                checked={appState.gridModeEnabled}
                label={t("labels.toggleGrid")}
                onChange={() => run(actionToggleGridMode)}
              />
              <SwitchRow
                name="settings-zen"
                checked={appState.zenModeEnabled}
                label={t("buttons.zenMode")}
                onChange={() => run(actionToggleZenMode)}
              />
              {actionManager.isActionEnabled(actionToggleViewMode) && (
                <SwitchRow
                  name="settings-view-mode"
                  checked={appState.viewModeEnabled}
                  label={t("labels.viewMode")}
                  onChange={() => run(actionToggleViewMode)}
                />
              )}
              <SwitchRow
                name="settings-stats"
                checked={appState.stats.open}
                label={t("stats.fullTitle")}
                onChange={() => run(actionToggleStats)}
              />
              <SwitchRow
                name="settings-arrow-binding"
                checked={appState.bindingPreference === "enabled"}
                label={t("labels.arrowBinding")}
                onChange={() => run(actionToggleArrowBinding)}
              />
              <SwitchRow
                name="settings-midpoint"
                checked={appState.isMidpointSnappingEnabled}
                label={t("labels.midpointSnapping")}
                onChange={() => run(actionToggleMidpointSnapping)}
              />
              <SwitchRow
                name="settings-hints"
                checked={appState.showHints}
                label={t("labels.showHints")}
                onChange={() => run(actionToggleShowHints)}
              />
            </>
          )}
          {category === "themeLanguage" && (
            <>
              <div className="AppSettings__group">
                <h3 className="AppSettings__section">{t("labels.theme")}</h3>
                <RadioGroup<Theme | "system">
                  name="settings-theme"
                  value={theme}
                  onChange={(value) => {
                    if (appProps.onThemeChange) {
                      appProps.onThemeChange(value);
                      return;
                    }
                    console.warn(
                      "AppSettings: props.onThemeChange must be defined to change the theme.",
                    );
                  }}
                  choices={[
                    { value: THEME.LIGHT, label: t("buttons.lightMode") },
                    { value: THEME.DARK, label: t("buttons.darkMode") },
                    { value: "system", label: t("buttons.systemMode") },
                  ]}
                />
              </div>
              <div className="AppSettings__group">
                <h3 className="AppSettings__section">{t("labels.language")}</h3>
                <LanguageList />
              </div>
              <div
                className="dropdown-menu-item AppSettings__finger"
                data-testid="settings-finger-mode"
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest(".Switch")) {
                    return;
                  }
                  setAppState({ fingerMode: !appState.fingerMode });
                }}
              >
                <span className="dropdown-menu-item__icon">{fingerIcon}</span>
                <span className="dropdown-menu-item__text">
                  {t("labels.fingerMode")}
                </span>
                <Switch
                  name="settings-finger-mode"
                  checked={appState.fingerMode}
                  title={t("labels.fingerMode")}
                  onChange={(value) => setAppState({ fingerMode: value })}
                />
              </div>
              {(
                [
                  [
                    "settings-size-default-button",
                    "labels.fingerModeDefaultButton",
                    appState.fingerModeDefaultButton,
                    "fingerModeDefaultButton",
                  ],
                  [
                    "settings-size-large-button",
                    "labels.fingerModeLargeButton",
                    appState.fingerModeLgButton,
                    "fingerModeLgButton",
                  ],
                  [
                    "settings-size-menu-item",
                    "labels.fingerModeMenuItemHeight",
                    appState.fingerModeMenuItem,
                    "fingerModeMenuItem",
                  ],
                  [
                    "settings-size-menu-gap",
                    "labels.fingerModeMenuItemGap",
                    appState.fingerModeMenuGap,
                    "fingerModeMenuGap",
                  ],
                  [
                    "settings-size-scale-handle",
                    "labels.fingerModeScaleHandle",
                    appState.fingerModeScaleHandle,
                    "fingerModeScaleHandle",
                  ],
                  [
                    "settings-size-rotate-handle",
                    "labels.fingerModeRotateHandle",
                    appState.fingerModeRotateHandle,
                    "fingerModeRotateHandle",
                  ],
                ] as const
              ).map(([testId, label, value, key]) => (
                <div
                  key={key}
                  className="AppSettings__group"
                  data-testid={testId}
                >
                  <h3 className="AppSettings__section">{t(label)}</h3>
                  <RadioGroup
                    name={testId}
                    value={value}
                    onChange={(next) => {
                      switch (key) {
                        case "fingerModeDefaultButton":
                          setAppState({ fingerModeDefaultButton: next });
                          break;
                        case "fingerModeLgButton":
                          setAppState({ fingerModeLgButton: next });
                          break;
                        case "fingerModeMenuItem":
                          setAppState({ fingerModeMenuItem: next });
                          break;
                        case "fingerModeMenuGap":
                          setAppState({ fingerModeMenuGap: next });
                          break;
                        case "fingerModeScaleHandle":
                          setAppState({ fingerModeScaleHandle: next });
                          break;
                        case "fingerModeRotateHandle":
                          setAppState({ fingerModeRotateHandle: next });
                          break;
                      }
                    }}
                    choices={sizeChoices}
                  />
                </div>
              ))}
            </>
          )}
          {category === "about" && <AboutPane />}
        </div>
      </div>
    </Dialog>
  );
};

const AboutPane = () => {
  const { t } = useI18n();

  return (
    <div data-testid="settings-about">
      <p className="AppSettings__sentence" data-testid="settings-about-name">
        Excalidraw
      </p>
      <p className="AppSettings__sentence" data-testid="settings-about-fork">
        {t("labels.aboutFork")}
      </p>
      <p className="AppSettings__sentence" data-testid="settings-about-version">
        {t("stats.version")}: {getVersion()}
      </p>
      <a
        className="AppSettings__link"
        data-testid="settings-about-repo"
        href="https://github.com/yiming/excalidraw"
      >
        {t("labels.aboutRepository")}
      </a>
    </div>
  );
};

const ThanksPane = () => {
  const { t } = useI18n();
  const signedIn = isExcalidrawPlusSignedUser;
  const plusHref = `${
    import.meta.env.VITE_APP_PLUS_LP
  }/plus?utm_source=excalidraw&utm_medium=app&utm_content=settings`;
  const signHref = `${import.meta.env.VITE_APP_PLUS_APP}${
    signedIn ? "" : "/sign-up"
  }?utm_source=signin&utm_medium=app&utm_content=settings`;

  return (
    <div data-testid="settings-thanks">
      <p
        className="AppSettings__sentence"
        data-testid="settings-thanks-sentence"
      >
        {t("labels.specialThanksSentence")}
      </p>
      <div className="AppSettings__links">
        <a className="AppSettings__link" href={plusHref}>
          Excalidraw+
        </a>
        <a
          className="AppSettings__link"
          href="https://github.com/excalidraw/excalidraw"
        >
          GitHub
        </a>
        <a className="AppSettings__link" href="https://x.com/excalidraw">
          {t("labels.followUs")}
        </a>
        <a className="AppSettings__link" href="https://discord.gg/UexuTaE">
          {t("labels.discordChat")}
        </a>
        <a className="AppSettings__link" href={signHref}>
          {signedIn ? t("labels.signIn") : t("labels.signUp")}
        </a>
      </div>
    </div>
  );
};
