# Design

## Context

- 主選單在 `excalidraw-app/components/AppMainMenu.tsx`。
- 偏好設定的項目來自 `packages/excalidraw/components/main-menu/DefaultItems.tsx` 的 `Preferences`。
- 設定頁在 `excalidraw-app/components/AppSettings.tsx`。外殼是 `Modal` 與 `Dialog`，不再用固定全螢幕 div 或 `ToggleRow`。
- 設計 token 在 `packages/excalidraw/css/theme.scss` 與 `styles.scss`。可重用的元件在 `packages/excalidraw/components/`：`Modal`、`Dialog`、`Switch`、`RadioGroup`，以及 `dropdownMenu/DropdownMenu.scss` 的 `.dropdown-menu-item`。
- 亮色值寫在 `.excalidraw`，暗色覆寫在 `.excalidraw.theme--dark`。頁面必須畫在 `.excalidraw` 裡面，變數才會生效。
- Excalidraw+ 與註冊連結使用 `VITE_APP_PLUS_LP` 與 `VITE_APP_PLUS_APP`。`excplus-auth` cookie 在 `yiming.github.io` 不存在，Pages 上這一項顯示 Sign up。
- 設定存在 localStorage `excalidraw-state`。主題鍵是 `excalidraw-theme`。
- 選單裡既有的 GitHub 連結指向 `https://github.com/excalidraw/excalidraw`。搬進 Special Thanks To 的就是這個連結。

## Goals / Non-Goals

**Goals:**

- 用 `Modal` 與 `Dialog` 做設定頁，左上角返回。
- 主題與語系同一頁，手指模式選項在下面。
- 視覺跟 Excalidraw 既有元件與 CSS 變數一致，亮色與暗色都成立。
- 致謝連結只放在名為 Special Thanks To 的那一頁。
- 新字串有 zh-TW 與 zh-CN。

**Non-Goals:**

- 不新增設定頁、選單整理與手指模式選項以外的功能。
- 不刪除 Excalidraw+、GitHub、追蹤我們、Discord、Sign up。
- 不把這五個連結放進關於或其他類別，也不另加 GitHub 網址。
- 不改命令面板、歡迎畫面、側欄裡既有的 Excalidraw+ 出現位置。這次指定的是漢堡選單與右上角宣傳列。
- 不把 Canvas 背景移出漢堡選單。
- 不在本變更定義手指模式的放大規則。規則在 `add-finger-mode`。
- 不改畫布手勢。

## Decisions

- 外殼是 `Modal` 加 `Dialog`。左上角是返回按鈕。不用現在的全螢幕 div，也不用 Close，返回也不是左側清單的一項。
- 沒有單一選項子頁。主題與語系合併成一頁。手指模式開關列與各尺寸選擇放在這一頁、主題與語系的下面。不再為主題、語系或手指模式各做一頁。
- 偏好設定仍是自己的一區，因為它有多個既有項目。行為與儲存維持搬移前。
- 設定有「關於」區段。五個致謝連結不放在這裡。
- 類別列沿用 `.dropdown-menu-item`：圓角 `--border-radius-md`，hover 用 `--button-hover-bg`，選中用 `--color-primary-light`，字色 `--text-primary-color`。
- 偏好設定裡的開關是標籤在左、`Switch` 在右。拿掉 `ToggleRow`。
- 單選（框選方式、輸入裝置、主題）以及每一項的小、中、大、特大都用 `RadioGroup`。
- 手指模式那一列不走一般開關的「只剩標籤與 Switch」。它是左手指圖示、中「手指模式」、右 `Switch`。見 `add-finger-mode`。開關在各尺寸選擇之上。
- 區段標題不用帶框線的 fieldset。字級約 0.875rem、粗體、顏色 `--color-gray-60`。
- Special Thanks To 的連結是 `--color-primary` 的文字連結。感謝句是普通內文，顏色 `--text-primary-color`。
- 列高在 `.excalidraw--finger-targets` 下用 `min-height: var(--finger-menu-item-height, 2rem)`。不把 44px 寫進設定頁樣式。
- 設定頁樣式不寫死 hex 或 px。間距用 `calc(var(--space-factor) * n)`，並使用 `--border-radius-md`、`--input-bg-color`、`--input-border-color`、`--island-bg-color`、`--ui-font`。尺寸檔位的像素是行為數值，放在 `add-finger-mode`，不是設定頁樣式裡的魔術數字。
- 亮色與暗色只靠這些 CSS 變數。頁面渲染在 `.excalidraw` 容器內。
- Special Thanks To 的標籤在英文是這幾個字，不多不少。五個連結與感謝句維持原決定。
- 漢堡選單在說明與重設畫布之間放「設定」。即時操作與 Canvas 背景留在漢堡選單。
- 左側清單名稱用 `labels.themeAndLanguage`（Theme and language／主題與語系／主题和语言）。
- 關於顯示應用名稱、iPad 友善分支說明、版本，以及 `https://github.com/yiming/excalidraw`。
- 返回按鈕文字用 `buttons.back`（Back／返回／返回）。
- 清單順序是 Special Thanks To、偏好設定、主題與語系、關於。
- `Dialog` 的 portal 根節點帶有 `.excalidraw`，暗色時再加上 `theme--dark`。手指模式的 CSS 變數寫在設定頁自己的節點上，因為 portal 繼承不到編輯器根節點的變數。

## Risks / Trade-offs

- 設定頁在 portal 裡。主題變數靠 portal 根節點的 `.excalidraw`，不靠編輯器那一個節點。
