# Proposal

## Why

- iPad 上的漢堡選單把連結、偏好、主題、語系和即時操作混在一起。
- 設定頁要沿用 Excalidraw 既有的視覺，並把手指模式的各項尺寸放進同一套頁面。

## What Changes

- 設定頁外殼用 `Modal` 加 `Dialog`，不再用固定的全螢幕 div。左上角是返回按鈕，不是 Close，也不是清單裡的一項。
- 不為只有單一選項的項目另開子頁。主題與語系合併成一頁，手指模式的選項放在它們下面。
- 手指模式在這一頁有一列開關，版面與三點選單相同：左手指圖示、中「手指模式」、右 `Switch` 或「開」「關」。沒有勾選、快捷鍵、副標或說明。各尺寸項各自用 `RadioGroup` 選小、中、大、特大，預設大。像素與行為見 `add-finger-mode`。
- 設定有「關於」區段。
- 左側有一個項目，標籤原樣為 Special Thanks To。Excalidraw+、GitHub、追蹤我們、Discord、Sign up 只放在這一頁，是搬移，不是刪除。頁上有一句感謝 Excalidraw 原作者的文字，不另加 GitHub 網址。
- 視覺用既有設計 token 與元件。研究結論見 design.md。
- 新字串要有 zh-TW 與 zh-CN 譯文。鍵名見規格。

## Capabilities

### New Capabilities

- `ipad-settings-page`：iPad 風格設定頁、選單整理，以及手指模式選項在頁面上的位置。

### Modified Capabilities

- 無。`openspec/specs/` 還沒有既有能力。

## Impact

- 應用選單在 `excalidraw-app`，偏好項目在 `packages/excalidraw` 的主選單。
- 不改各項既有設定的行為。手指模式的放大規則在 `add-finger-mode`。
- 不改畫布手勢。
