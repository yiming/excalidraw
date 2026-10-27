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
import {
  checkIcon,
  DeviceDesktopIcon,
  DiscordIcon,
  emptyIcon,
  fingerIcon,
  GithubIcon,
  loginIcon,
  MoonIcon,
  PlusPromoIcon,
  SunIcon,
  XBrandIcon,
} from "@excalidraw/excalidraw/components/icons";
import { RadioGroup } from "@excalidraw/excalidraw/components/RadioGroup";
import { Switch } from "@excalidraw/excalidraw/components/Switch";
import { getDropdownMenuItemClassName } from "@excalidraw/excalidraw/components/dropdownMenu/common";
import DropdownMenuGroup from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuGroup";
import MenuItemContent from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuItemContent";
import DropdownMenuItemContentRadio from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenuItemContentRadio";
import { useUIAppState } from "@excalidraw/excalidraw/context/ui-appState";
import { useI18n } from "@excalidraw/excalidraw/i18n";
import { resolveInputDevice } from "@excalidraw/excalidraw/appState";

import type { Theme } from "@excalidraw/element/types";
import type { InputDevice } from "@excalidraw/excalidraw/types";

import { LanguageList } from "../app-language/LanguageList";
import { isExcalidrawPlusSignedUser } from "../app_constants";

import "./AppSettings.scss";

import type { JSX } from "react";

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

/** Same shell as a dropdown menu, without Radix, so it can live in the dialog. */
const MenuShell = ({ children }: { children: React.ReactNode }) => (
  <div className="dropdown-menu">
    <div className="dropdown-menu-container">{children}</div>
  </div>
);

const PreferenceCheckbox = ({
  checked,
  label,
  testId,
  onToggle,
}: {
  checked: boolean;
  label: string;
  testId: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    className={getDropdownMenuItemClassName()}
    role="menuitemcheckbox"
    aria-checked={checked}
    data-testid={testId}
    onClick={onToggle}
  >
    <MenuItemContent icon={checked ? checkIcon : emptyIcon}>
      {label}
    </MenuItemContent>
  </button>
);

const SettingsLink = ({
  href,
  icon,
  children,
  testId,
}: {
  href: string;
  icon?: JSX.Element;
  children: React.ReactNode;
  testId?: string;
}) => (
  <a
    className={getDropdownMenuItemClassName()}
    href={href}
    data-testid={testId}
  >
    <MenuItemContent icon={icon}>{children}</MenuItemContent>
  </a>
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
    ariaLabel: sizeLabel(tier, t),
  }));

  const preferences: Array<{
    testId: string;
    checked: boolean;
    label: string;
    onToggle: () => void;
  }> = [
    {
      testId: "settings-tool-lock",
      checked: appState.activeTool.locked,
      label: t("labels.preferences_toolLock"),
      onToggle: () => app.toggleLock(),
    },
    {
      testId: "settings-objects-snap",
      checked: appState.objectsSnapModeEnabled,
      label: t("buttons.objectsSnapMode"),
      onToggle: () => run(actionToggleObjectsSnapMode),
    },
    {
      testId: "settings-grid",
      checked: appState.gridModeEnabled,
      label: t("labels.toggleGrid"),
      onToggle: () => run(actionToggleGridMode),
    },
    {
      testId: "settings-zen",
      checked: appState.zenModeEnabled,
      label: t("buttons.zenMode"),
      onToggle: () => run(actionToggleZenMode),
    },
  ];

  if (actionManager.isActionEnabled(actionToggleViewMode)) {
    preferences.push({
      testId: "settings-view-mode",
      checked: appState.viewModeEnabled,
      label: t("labels.viewMode"),
      onToggle: () => run(actionToggleViewMode),
    });
  }

  preferences.push(
    {
      testId: "settings-stats",
      checked: appState.stats.open,
      label: t("stats.fullTitle"),
      onToggle: () => run(actionToggleStats),
    },
    {
      testId: "settings-arrow-binding",
      checked: appState.bindingPreference === "enabled",
      label: t("labels.arrowBinding"),
      onToggle: () => run(actionToggleArrowBinding),
    },
    {
      testId: "settings-midpoint",
      checked: appState.isMidpointSnappingEnabled,
      label: t("labels.midpointSnapping"),
      onToggle: () => run(actionToggleMidpointSnapping),
    },
    {
      testId: "settings-hints",
      checked: appState.showHints,
      label: t("labels.showHints"),
      onToggle: () => run(actionToggleShowHints),
    },
  );

  const changeTheme = (value: Theme | "system") => {
    if (appProps.onThemeChange) {
      appProps.onThemeChange(value);
      return;
    }
    console.warn(
      "AppSettings: props.onThemeChange must be defined to change the theme.",
    );
  };

  return (
    <Dialog
      className={clsx(
        "AppSettings",
        appState.fingerMode && "excalidraw--finger-targets",
      )}
      size="wide"
      onCloseRequest={close}
      title={
        <span className="dropdown-menu">
          <button
            type="button"
            className={getDropdownMenuItemClassName()}
            data-testid="settings-back"
            onClick={close}
          >
            <MenuItemContent>{t("buttons.back")}</MenuItemContent>
          </button>
        </span>
      }
    >
      <div
        className="AppSettings__layout"
        data-testid="settings-dialog"
        style={fingerModeStyle(appState) ?? undefined}
      >
        <div className="AppSettings__list" data-testid="settings-category-list">
          <MenuShell>
            {CATEGORIES.map((id) => (
              <button
                key={id}
                type="button"
                className={getDropdownMenuItemClassName("", category === id)}
                aria-current={category === id ? "true" : undefined}
                data-testid={`settings-category-${id}`}
                onClick={() => setCategory(id)}
              >
                <MenuItemContent>{categoryLabel(id)}</MenuItemContent>
              </button>
            ))}
          </MenuShell>
        </div>
        <div className="AppSettings__detail" data-testid="settings-detail">
          {category === "thanks" && <ThanksPane />}
          {category === "preferences" && (
            <MenuShell>
              <DropdownMenuItemContentRadio<"contain" | "overlap">
                name="settings-box-selection"
                icon={emptyIcon}
                value={appState.boxSelectionMode}
                onChange={(value) => setAppState({ boxSelectionMode: value })}
                choices={[
                  {
                    value: "contain",
                    label: t("labels.boxSelectionContain"),
                    ariaLabel: t("labels.boxSelectionContain"),
                  },
                  {
                    value: "overlap",
                    label: t("labels.boxSelectionOverlap"),
                    ariaLabel: t("labels.boxSelectionOverlap"),
                  },
                ]}
              >
                {t("labels.boxSelectionMode")}
              </DropdownMenuItemContentRadio>
              <DropdownMenuItemContentRadio<Exclude<InputDevice, "auto">>
                name="settings-input-device"
                icon={emptyIcon}
                value={resolveInputDevice(appState.inputDevice)}
                onChange={(value) => setAppState({ inputDevice: value })}
                choices={[
                  {
                    value: "trackpad",
                    label: t("labels.inputDeviceTrackpad"),
                    ariaLabel: t("labels.inputDeviceTrackpad"),
                  },
                  {
                    value: "mouse",
                    label: t("labels.inputDeviceMouse"),
                    ariaLabel: t("labels.inputDeviceMouse"),
                  },
                ]}
              >
                {t("labels.inputDevice")}
              </DropdownMenuItemContentRadio>
              {preferences.map((item) => (
                <PreferenceCheckbox key={item.testId} {...item} />
              ))}
            </MenuShell>
          )}
          {category === "themeLanguage" && (
            <MenuShell>
              <DropdownMenuItemContentRadio<Theme | "system">
                name="settings-theme"
                value={theme}
                onChange={changeTheme}
                choices={[
                  {
                    value: THEME.LIGHT,
                    label: SunIcon,
                    ariaLabel: t("buttons.lightMode"),
                  },
                  {
                    value: THEME.DARK,
                    label: MoonIcon,
                    ariaLabel: t("buttons.darkMode"),
                  },
                  {
                    value: "system",
                    label: DeviceDesktopIcon,
                    ariaLabel: t("buttons.systemMode"),
                  },
                ]}
              >
                {t("labels.theme")}
              </DropdownMenuItemContentRadio>
              <DropdownMenuGroup title={t("labels.language")}>
                <LanguageList />
              </DropdownMenuGroup>
              <button
                type="button"
                className={getDropdownMenuItemClassName()}
                data-testid="settings-finger-mode"
                onClick={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest(".Switch")) {
                    return;
                  }
                  setAppState({ fingerMode: !appState.fingerMode });
                }}
              >
                <MenuItemContent
                  icon={fingerIcon}
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
                        name="settings-finger-mode"
                        checked={appState.fingerMode}
                        title={t("labels.fingerMode")}
                        onChange={(value) => setAppState({ fingerMode: value })}
                      />
                    </span>
                  }
                >
                  {t("labels.fingerMode")}
                </MenuItemContent>
              </button>
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
                <div key={key} data-testid={testId}>
                  <DropdownMenuGroup title={t(label)}>
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
                  </DropdownMenuGroup>
                </div>
              ))}
            </MenuShell>
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
      <p className="excalidraw__paragraph" data-testid="settings-about-name">
        Excalidraw
      </p>
      <p className="excalidraw__paragraph" data-testid="settings-about-fork">
        {t("labels.aboutFork")}
      </p>
      <p className="excalidraw__paragraph" data-testid="settings-about-version">
        {t("stats.version")}: {getVersion()}
      </p>
      <MenuShell>
        <SettingsLink
          testId="settings-about-repo"
          href="https://github.com/yiming/excalidraw"
          icon={GithubIcon}
        >
          {t("labels.aboutRepository")}
        </SettingsLink>
      </MenuShell>
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
        className="excalidraw__paragraph"
        data-testid="settings-thanks-sentence"
      >
        {t("labels.specialThanksSentence")}
      </p>
      <MenuShell>
        <SettingsLink href={plusHref} icon={PlusPromoIcon}>
          Excalidraw+
        </SettingsLink>
        <SettingsLink
          href="https://github.com/excalidraw/excalidraw"
          icon={GithubIcon}
        >
          GitHub
        </SettingsLink>
        <SettingsLink href="https://x.com/excalidraw" icon={XBrandIcon}>
          {t("labels.followUs")}
        </SettingsLink>
        <SettingsLink href="https://discord.gg/UexuTaE" icon={DiscordIcon}>
          {t("labels.discordChat")}
        </SettingsLink>
        <SettingsLink href={signHref} icon={loginIcon}>
          {signedIn ? t("labels.signIn") : t("labels.signUp")}
        </SettingsLink>
      </MenuShell>
    </div>
  );
};
