# Design

## Context

- 主選單在 `excalidraw-app/components/AppMainMenu.tsx`。
- 偏好設定的項目來自 `packages/excalidraw/components/main-menu/DefaultItems.tsx` 的 `Preferences`。
- 現有設定頁是 `excalidraw-app/components/AppSettings.tsx` 的固定全螢幕 div。類別把主題、語系、手指模式拆開。開關是 `ToggleRow`（`button[aria-pressed]`，只改背景）。尺寸是一個四段選擇，不是一項一個。清單底部有 Close。沒有「關於」。
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
- 手指模式那一列不走一般開關的「只剩標籤與 Switch」。它是左手指圖示、中「手指模式」、右 `Switch` 或「開」「關」。見 `add-finger-mode`。
- 區段標題不用帶框線的 fieldset。字級約 0.875rem、粗體、顏色 `--color-gray-60`。
- Special Thanks To 的連結是 `--color-primary` 的文字連結。感謝句是普通內文，顏色 `--text-primary-color`。
- 列高在 `.excalidraw--finger-targets` 下用 `min-height: var(--finger-menu-item-height, 2rem)`。不把 44px 寫進設定頁樣式。
- 設定頁樣式不寫死 hex 或 px。間距用 `calc(var(--space-factor) * n)`，並使用 `--border-radius-md`、`--input-bg-color`、`--input-border-color`、`--island-bg-color`、`--ui-font`。尺寸檔位的像素是行為數值，放在 `add-finger-mode`，不是設定頁樣式裡的魔術數字。
- 亮色與暗色只靠這些 CSS 變數。頁面渲染在 `.excalidraw` 容器內。
- Special Thanks To 的標籤在英文是這幾個字，不多不少。五個連結與感謝句維持原決定。
- 漢堡選單在說明與重設畫布之間放「設定」。即時操作與 Canvas 背景留在漢堡選單。

## Risks / Trade-offs

- `Modal` 是否把內容 portal 到 `.excalidraw` 內，要在實作時確認。沒有確認前，不能假設暗色變數會自動套上。
- 合併頁在左側清單用什麼名稱，關於區段裡放什麼，返回按鈕的文字，都還沒有指定。見 Open questions。

## Open questions

- 主題與語系合併後，左側清單上這一頁的名稱。規格只要求它們在同一頁，手指模式選項在下面。
- 「關於」除了區段標題以外顯示什麼。五個致謝連結已經排除。
- 返回按鈕的可見文字。位置已定在左上角。
- 手指模式開關列與各尺寸選擇的上下順序。兩者都在主題與語系下面。
- 與 `add-finger-mode` 相同、這裡不另做決定的項目：已合併程式裡的畫布手勢要不要改回上游、開關是否獨立於 `penMode`、放大是否只在觸控時生效、旋轉控制點缺少的像素、既有第五欄是否就是縮放控制點。
