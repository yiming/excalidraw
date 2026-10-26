# Proposal

## Why

- iPad 上的漢堡選單把連結、偏好、主題、語系和即時操作混在一起，課堂白板不容易點。
- 第一優先是先有一頁完整的 iPad 風格設定，再讓 finger mode 的細節放進去。

## What Changes

- 新增全螢幕設定頁：左側類別清單，右側內容。窄螢幕是否改成先清單、再內容，只是設計考量。
- 左側清單包含一個項目，標籤原樣為 Special Thanks To。Excalidraw+、GitHub、追蹤我們（Follow us）、Discord、Sign up 只放在這一頁，不散到關於或其他類別，也不刪除。
- 這一頁另有一句感謝 Excalidraw 原作者的文字。不另加 GitHub 網址；頁上既有的 GitHub 連結就是出處。
- 這五個連結離開漢堡選單，也離開右上角宣傳列。
- 漢堡選單另外移出偏好設定（Preferences，含其全部項目）、主題（Theme）、語系（Language）。只留即時操作。在說明（Help）與重設畫布（Reset canvas）之間新增「設定」。
- 偏好設定、主題、語系各自成為左側類別。Canvas 背景（canvas background）這次留在漢堡選單。
- 設定頁另有「手指模式」類別。ON／OFF 開關只在三點「更多工具」選單。尺寸不是單一的 44px，也不是「要不要放大」的勾選，而是四段，預設是大。
- 尺寸順序是一般按鈕、大按鈕、選單項目高度、選單項目間距、變形控制點：
  - 小：32 / 36 / 32 / 1 / 8px（上游）。
  - 中：36 / 39 / 36 / 4 / 20px。
  - 大（預設）：40 / 42 / 40 / 6 / 32px。
  - 特大：44 / 44 / 至少 44 / 8 / 44px。
- 被移走的項目維持原本行為。本變更不新增設定頁與選單整理以外的功能。
- 實作在 `finger-mode` 分支。該分支以後可能自帶這份變更的版本，用語以這裡為準。

## Capabilities

### New Capabilities

- `ipad-settings-page`：iPad 風格設定頁、漢堡選單整理，以及「手指模式」細節類別。

### Modified Capabilities

- 無。`openspec/specs/` 還沒有既有能力。

## Impact

- 應用選單在 `excalidraw-app`，偏好項目在 `packages/excalidraw` 的主選單。
- 不改各項設定的既有行為，也不在本變更實作 finger mode 的主行為。
