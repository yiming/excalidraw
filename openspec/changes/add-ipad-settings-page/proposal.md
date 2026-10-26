# Proposal

## Why

- iPad 上的漢堡選單把連結、偏好、主題、語系和即時操作混在一起，課堂白板不容易點。
- 第一優先是先有一頁完整的 iPad 風格設定，再讓 finger mode 的細節放進去。

## What Changes

- 新增全螢幕設定頁：左側類別清單，右側內容。窄螢幕是否改成先清單、再內容，只是設計考量。
- 漢堡選單移出：Excalidraw+ 連結、GitHub、追蹤我們（Follow us）、Discord、Sign up、偏好設定（Preferences，含其全部項目）、主題（Theme）、語系（Language）。
- 漢堡選單留下即時操作。在說明（Help）與重設畫布（Reset canvas）之間新增「設定」。
- Canvas 背景（canvas background）這次留在漢堡選單。
- 設定頁新增「手指模式」類別，只放細節選項。ON／OFF 開關只在三點「更多工具」選單。
- 被移走的項目維持原本行為。本變更不新增設定頁與選單整理以外的功能。
- Excalidraw+ 與 Sign up 只是搬移。要不要整項拿掉，以後再決定。

## Capabilities

### New Capabilities

- `ipad-settings-page`：iPad 風格設定頁、漢堡選單整理，以及「手指模式」細節類別。

### Modified Capabilities

- 無。`openspec/specs/` 還沒有既有能力。

## Impact

- 應用選單在 `excalidraw-app`，偏好項目在 `packages/excalidraw` 的主選單。
- 不改各項設定的既有行為，也不在本變更實作 finger mode 的主行為。
