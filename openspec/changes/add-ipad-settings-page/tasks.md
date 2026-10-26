# Tasks

## 1. 外殼

- [x] 1.1 設定頁改為 `Modal` 加 `Dialog`。拿掉固定全螢幕 div。左上角是返回按鈕，不是 Close，也不是清單項目。
- [x] 1.2 沿用 `openDialog` 的 `"settings"`，不另開一種對話框名稱。
- [x] 1.3 頁面渲染在 `.excalidraw` 裡面，亮色與暗色都只靠 CSS 變數。

## 2. 頁面結構

- [x] 2.1 主題與語系合併成一頁。手指模式開關列與各尺寸選擇放在它們下面。不再為主題、語系或手指模式各開一頁。
- [x] 2.2 設定有「關於」區段。Excalidraw+、GitHub、追蹤我們、Discord、Sign up 不放在這個區段。
- [x] 2.3 有一個項目的標籤原樣是 Special Thanks To。

## 3. 漢堡選單

- [x] 3.1 在說明與重設畫布之間加入「設定」。
- [x] 3.2 漢堡選單與右上角宣傳列都拿掉 Excalidraw+、GitHub、追蹤我們、Discord、Sign up／Sign in。連結不刪除，改放在 Special Thanks To。
- [x] 3.3 偏好設定、主題、語系離開漢堡選單。即時操作與 Canvas 背景留在漢堡選單。

## 4. Special Thanks To

- [x] 4.1 這一頁的連結是 Excalidraw+、GitHub、追蹤我們、Discord、Sign up。同一頁有一句感謝 Excalidraw 原作者的文字。不另加 GitHub 網址。
- [x] 4.2 這些連結改成 `--color-primary` 的文字連結。

## 5. 手指模式選項

- [x] 5.1 設定頁的手指模式列與三點選單相同：左手指圖示、中「手指模式」、右 `Switch`。沒有勾選、快捷鍵、副標或說明。
- [x] 5.2 一般按鈕、大按鈕、選單項目高度、選單項目間距、縮放控制點、旋轉控制點各自用 `RadioGroup` 選小、中、大、特大，預設大。像素見 `add-finger-mode`。

## 6. 視覺

- [x] 6.1 類別列沿用 `.dropdown-menu-item`。
- [x] 6.2 偏好設定的開關改為標籤在左、`Switch` 在右。拿掉 `ToggleRow`。
- [x] 6.3 單選設定也用 `RadioGroup`。
- [x] 6.4 區段標題不要 fieldset 框線。約 0.875rem、粗體、`--color-gray-60`。
- [x] 6.5 `.excalidraw--finger-targets` 下的列使用 `min-height: var(--finger-menu-item-height, 2rem)`。
- [x] 6.6 設定頁樣式不寫死 hex 或 px，改用 `--border-radius-md`、`--space-factor`、`--input-*`、`--island-bg-color`、`--ui-font`。

## 7. 語系

- [x] 7.1 規格列出的鍵在 `zh-TW.json` 與 `zh-CN.json` 都有譯文。
