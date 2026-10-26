import { useEffect, useState } from "react";

import { THEME } from "@excalidraw/common";
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
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";
import { useI18n } from "@excalidraw/excalidraw/i18n";
import { resolveInputDevice } from "@excalidraw/excalidraw/appState";
import {
  FINGER_MODE_SIZE_TIERS,
  type FingerModeSizeTier,
} from "@excalidraw/excalidraw/components/penModePointer";

import type { Theme } from "@excalidraw/element/types";

import { LanguageList } from "../app-language/LanguageList";
import { isExcalidrawPlusSignedUser } from "../app_constants";

import "./AppSettings.scss";

const CATEGORIES = [
  "thanks",
  "preferences",
  "theme",
  "language",
  "finger",
] as const;

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

const ToggleRow = ({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    className="AppSettings__row"
    aria-pressed={checked}
    onClick={onToggle}
  >
    {label}
  </button>
);

export const AppSettings = ({ theme }: { theme: Theme | "system" }) => {
  const { t } = useI18n();
  const app = useApp();
  const appProps = useAppProps();
  const appState = useUIAppState();
  const setAppState = useExcalidrawSetAppState();
  const actionManager = useExcalidrawActionManager();
  const open = appState.openDialog?.name === "settings";
  const [category, setCategory] = useState<Category>("preferences");
  const [narrow, setNarrow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const view = app.ownerWindow;
    const query = view.matchMedia("(max-width: 720px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [app]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAppState({ openDialog: null });
      }
    };
    app.ownerWindow.addEventListener("keydown", onKeyDown);
    return () => app.ownerWindow.removeEventListener("keydown", onKeyDown);
  }, [app, open, setAppState]);

  if (!open) {
    return null;
  }

  const close = () => setAppState({ openDialog: null });
  const choose = (next: Category) => {
    setCategory(next);
    if (narrow) {
      setShowDetail(true);
    }
  };
  const showList = !narrow || !showDetail;
  const showPane = !narrow || showDetail;

  const categoryLabel = (id: Category) => {
    if (id === "thanks") {
      return "Special Thanks To";
    }
    if (id === "preferences") {
      return t("labels.preferences");
    }
    if (id === "theme") {
      return t("labels.theme");
    }
    if (id === "language") {
      return t("labels.language");
    }
    return t("labels.fingerMode");
  };

  const run = (action: Parameters<typeof actionManager.executeAction>[0]) => {
    actionManager.executeAction(action);
  };

  return (
    <div
      className={narrow ? "AppSettings AppSettings--narrow" : "AppSettings"}
      role="dialog"
      aria-modal="true"
      aria-label={t("labels.settings")}
      data-testid="settings-dialog"
    >
      {showList && (
        <div className="AppSettings__list" data-testid="settings-category-list">
          <h2 className="AppSettings__title">{t("labels.settings")}</h2>
          {CATEGORIES.map((id) => (
            <button
              key={id}
              type="button"
              className={
                category === id
                  ? "AppSettings__category AppSettings__category--selected"
                  : "AppSettings__category"
              }
              aria-current={category === id}
              data-testid={`settings-category-${id}`}
              onClick={() => choose(id)}
            >
              {categoryLabel(id)}
            </button>
          ))}
          <button type="button" className="AppSettings__back" onClick={close}>
            {t("buttons.close")}
          </button>
        </div>
      )}
      {showPane && (
        <div className="AppSettings__detail" data-testid="settings-detail">
          {narrow && (
            <button
              type="button"
              className="AppSettings__back"
              onClick={() => setShowDetail(false)}
            >
              {t("labels.settings")}
            </button>
          )}
          <h2 className="AppSettings__title">{categoryLabel(category)}</h2>
          {category === "thanks" && <ThanksPane />}
          {category === "preferences" && (
            <div className="AppSettings__group">
              <fieldset className="AppSettings__group">
                <legend>{t("labels.boxSelectionMode")}</legend>
                {(
                  [
                    ["contain", t("labels.boxSelectionContain")],
                    ["overlap", t("labels.boxSelectionOverlap")],
                  ] as const
                ).map(([value, label]) => (
                  <ToggleRow
                    key={value}
                    checked={appState.boxSelectionMode === value}
                    label={label}
                    onToggle={() => setAppState({ boxSelectionMode: value })}
                  />
                ))}
              </fieldset>
              <fieldset className="AppSettings__group">
                <legend>{t("labels.inputDevice")}</legend>
                {(
                  [
                    ["trackpad", t("labels.inputDeviceTrackpad")],
                    ["mouse", t("labels.inputDeviceMouse")],
                  ] as const
                ).map(([value, label]) => (
                  <ToggleRow
                    key={value}
                    checked={resolveInputDevice(appState.inputDevice) === value}
                    label={label}
                    onToggle={() => setAppState({ inputDevice: value })}
                  />
                ))}
              </fieldset>
              <ToggleRow
                checked={appState.activeTool.locked}
                label={t("labels.preferences_toolLock")}
                onToggle={() => app.toggleLock()}
              />
              <ToggleRow
                checked={appState.objectsSnapModeEnabled}
                label={t("buttons.objectsSnapMode")}
                onToggle={() => run(actionToggleObjectsSnapMode)}
              />
              <ToggleRow
                checked={appState.gridModeEnabled}
                label={t("labels.toggleGrid")}
                onToggle={() => run(actionToggleGridMode)}
              />
              <ToggleRow
                checked={appState.zenModeEnabled}
                label={t("buttons.zenMode")}
                onToggle={() => run(actionToggleZenMode)}
              />
              {actionManager.isActionEnabled(actionToggleViewMode) && (
                <ToggleRow
                  checked={appState.viewModeEnabled}
                  label={t("labels.viewMode")}
                  onToggle={() => run(actionToggleViewMode)}
                />
              )}
              <ToggleRow
                checked={appState.stats.open}
                label={t("stats.fullTitle")}
                onToggle={() => run(actionToggleStats)}
              />
              <ToggleRow
                checked={appState.bindingPreference === "enabled"}
                label={t("labels.arrowBinding")}
                onToggle={() => run(actionToggleArrowBinding)}
              />
              <ToggleRow
                checked={appState.isMidpointSnappingEnabled}
                label={t("labels.midpointSnapping")}
                onToggle={() => run(actionToggleMidpointSnapping)}
              />
              <ToggleRow
                checked={appState.showHints}
                label={t("labels.showHints")}
                onToggle={() => run(actionToggleShowHints)}
              />
            </div>
          )}
          {category === "theme" && (
            <div className="AppSettings__group">
              {(
                [
                  [THEME.LIGHT, t("buttons.lightMode")],
                  [THEME.DARK, t("buttons.darkMode")],
                  ["system", t("buttons.systemMode")],
                ] as const
              ).map(([value, label]) => (
                <ToggleRow
                  key={value}
                  checked={theme === value}
                  label={label}
                  onToggle={() => {
                    if (appProps.onThemeChange) {
                      appProps.onThemeChange(value);
                      return;
                    }
                    console.warn(
                      "AppSettings: props.onThemeChange must be defined to change the theme.",
                    );
                  }}
                />
              ))}
            </div>
          )}
          {category === "language" && (
            <LanguageList style={{ width: "100%", minHeight: 44 }} />
          )}
          {category === "finger" && (
            <fieldset className="AppSettings__group">
              <legend>{t("labels.fingerModeSize")}</legend>
              {FINGER_MODE_SIZE_TIERS.map((tier) => (
                <ToggleRow
                  key={tier}
                  checked={appState.fingerModeSize === tier}
                  label={sizeLabel(tier, t)}
                  onToggle={() => setAppState({ fingerModeSize: tier })}
                />
              ))}
              <ToggleRow
                checked={appState.fingerModeHideShortcuts}
                label={t("labels.fingerModeHideShortcuts")}
                onToggle={() =>
                  setAppState({
                    fingerModeHideShortcuts: !appState.fingerModeHideShortcuts,
                  })
                }
              />
            </fieldset>
          )}
        </div>
      )}
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
      <p className="AppSettings__thanks" data-testid="settings-thanks-sentence">
        {t("labels.specialThanksSentence")}
      </p>
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
  );
};
