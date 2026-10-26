# Tasks

## 1. 設定頁

- [x] 1.1 用全螢幕設定頁呈現左清單、右內容。寬度 720px 以下改成先清單、再內容。
- [x] 1.2 沿用 `openDialog` 的 `"settings"`。
- [x] 1.3 類別包含 Special Thanks To、偏好設定、主題、語系、手指模式。

## 2. 漢堡選單

- [x] 2.1 在說明與重設畫布之間加入「設定」。
- [x] 2.2 移出 Excalidraw+、GitHub、追蹤我們、Discord、Sign up／Sign in、偏好設定全部項目、主題、語系。這五個連結只留在 Special Thanks To。右上角宣傳與歡迎畫面的註冊連結一併移走。
- [x] 2.3 即時操作與 Canvas 背景留在漢堡選單。

## 3. 手指模式類別

- [x] 3.1 設定頁加入「手指模式」，不放 ON／OFF 開關。
- [x] 3.2 尺寸為四段，預設大。沒有把按鈕或控制點寫死成單一 44px。段位是小、中、大、特大。
  - 小：一般按鈕 32px、大按鈕 36px、選單項目高 32px、間距 1px、控制點 8px。
  - 中：一般按鈕 36px、大按鈕 39px、選單項目高 36px、間距 4px、控制點 20px。
  - 大（預設）：一般按鈕 40px、大按鈕 42px、選單項目高 40px、間距 6px、控制點 32px。
  - 特大：一般按鈕與大按鈕 44px、選單項目高至少 44px、間距 8px、控制點 44px。
  - 實作依段位取值，預設大。沒有把尺寸寫死成 44px。
- [x] 3.3 三點選單的開關在 `add-finger-mode`。選單裡只有開關，尺寸段位在本設定頁。

## 4. 行為與字串

- [x] 4.1 被移項目的行為與儲存維持不變（`excalidraw-state`、`excalidraw-theme`）。尺寸段位同樣是 `browser: true`。
- [x] 4.2 補上缺少的 zh-TW：Input、Trackpad、Mouse、Show hints、Sign up、Sign in，以及設定頁與尺寸段位字串。
- [x] 4.3 Excalidraw+ 與 Sign up 沒有刪除，只從漢堡選單、右上角與歡迎畫面移到 Special Thanks To。感謝句是純文字，不另加 GitHub 連結。
