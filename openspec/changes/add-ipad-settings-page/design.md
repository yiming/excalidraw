# Design

## Context

- 主選單在 `excalidraw-app/components/AppMainMenu.tsx`（app 層，與上游合併的風險較低）。
- 偏好設定子選單是 `packages/excalidraw/components/main-menu/DefaultItems.tsx` 的 `Preferences`，內含框選、輸入裝置、工具鎖、對齊、格線、Zen、檢視、元素屬性、箭頭綁定、中點對齊、顯示提示。
- Excalidraw+ 與註冊連結使用 `.env.production` 的 `VITE_APP_PLUS_LP`（`https://plus.excalidraw.com`）與 `VITE_APP_PLUS_APP`（`https://app.excalidraw.com`）。註冊路徑是 `app.excalidraw.com/sign-up`。
- 同一個連結在 `excplus-auth` cookie 存在時顯示 Sign in，否則顯示 Sign up。這個 cookie 不會出現在 `yiming.github.io`，所以 Pages 上只會看到 Sign up。
- 設定存在 localStorage `excalidraw-state`（`APP_STATE_STORAGE_CONF` 裡 `browser: true` 的欄位）。主題鍵是 `excalidraw-theme`。`penMode` 已是 `browser: true`。
- `packages/excalidraw/types.ts` 的 `openDialog` 已有未使用的 `"settings"`，可以沿用。
- zh-TW 缺少或空白的字串包括 Input／Trackpad／Mouse（`labels.inputDevice`、`inputDeviceTrackpad`、`inputDeviceMouse`）、Show hints（`labels.showHints`）、Sign up（`labels.signUp` 為空）。`labels.signIn` 也是空的。
- 三點選單是工具列的 extra tools（`toolBar.extraTools`）。
- 右上角宣傳是 `excalidraw-app/App.tsx` 裡 `.excalidraw-ui-top-right` 的 `ExcalidrawPlusPromoBanner`。
- 選單裡的 GitHub 連結目前指向 `https://github.com/excalidraw/excalidraw`（`DefaultItems.tsx` 的 `Socials`）。

## Goals / Non-Goals

**Goals:**

- 全螢幕設定頁，左側類別、右側內容。
- 把上游致謝連結集中到 Special Thanks To，並在說明與重設畫布之間放「設定」。
- 「手指模式」類別承載細節選項。ON／OFF 只留在三點選單。

**Non-Goals:**

- 不新增設定頁與選單整理以外的功能。
- 不改變被移項目的既有行為。
- 不刪除 Excalidraw+、GitHub、追蹤我們、Discord、Sign up。
- 不把這五個連結放進關於或其他類別，也不另做第二個致謝頁。
- 不另加一條 GitHub 網址；致謝句是普通文字，出處用頁上既有的 GitHub 連結。
- 不改命令面板、歡迎畫面、側欄裡既有的 Excalidraw+ 出現位置。這次指定的是漢堡選單與右上角宣傳列。
- 不在本變更實作 finger mode 的主行為。主提案在 `finger-mode` 分支，以後可能自帶這份變更的版本。
- 不把 Canvas 背景移出漢堡選單。

## Decisions

- 版面比照 iPad 設定 app：左清單、右內容。
- 窄寬度可以改成先清單、再內容。這是設計考量，不是本變更已鎖定的行為。
- 左側清單包含：Special Thanks To（標籤原樣，只佔一個項目）、關於、手指模式、偏好設定、主題、語系。
- Special Thanks To 這一頁的上游連結只有下面五個，不刪除：
  - Excalidraw+
  - GitHub（既有連結，指向 `https://github.com/excalidraw/excalidraw`）
  - 追蹤我們（Follow us）
  - Discord
  - Sign up（同一項在已登入時顯示 Sign in，仍是這一個連結，不是第六個）
- 同一頁有一句感謝 Excalidraw 原作者的普通文字。不再另加 GitHub 網址，上面的 GitHub 連結就是出處。
- 關於與其他類別都不放這五個連結。
- 這五個連結離開漢堡選單，也離開右上角宣傳列。
- 偏好設定、主題、語系各自留在自己的類別。
- 漢堡選單沒有這些連結，只留即時操作，例如開啟、儲存、匯出、即時協作、命令面板、搜尋、說明、重設畫布。開發用的 Visual Debug 不在搬移清單，維持原處。
- 「設定」放在說明下面、重設畫布上面。
- finger mode 是兩層，已決定，不再是開放問題：
  - 三點「更多工具」選單只放 ON／OFF 開關。
  - 開啟後，細節放在設定頁的「手指模式」（左清單、右內容）。
  - 尺寸是一個四段選項，同時管一般按鈕（`--default-button-size`）、大按鈕（`--lg-button-size`）、選單項目與變形控制點（handles）。段位名稱在兩種語系都用：小（Small）、中（Medium）、大（Large）、特大（Extra Large）。預設是大，不是特大，也不是上游的小。順序是一般按鈕、大按鈕、選單項目高度、選單項目間距、變形控制點：
    - 小：32px（2rem）／36px（2.25rem）／32px（2rem）／1px／8px。這就是上游現值，不覆寫。
    - 中：36／39／36／4／20px。
    - 大（預設）：40／42／40／6／32px。
    - 特大：44／44／至少 44／8／44px（控制點落在 40–44px）。
  - 間距算法：一般按鈕與選單高度從 32px 到 44px，每段加 4px。大按鈕從 36px 每段加 3px 到 42px，最後收到 44px 的觸控目標。控制點從上游繪製用的 8px 到 44px，每段加 12px（8、20、32、44）。
  - 段位存在 `browser: true` 的 appState。畫面上的放大只在筆模式開啟且主要指標為粗指標（`pointer: coarse`）時生效。精細指標與筆模式關閉時維持上游尺寸，桌面滑鼠不跟著變大。
  - 其他同類的手指操作選項，具體清單尚未列完。四段尺寸本身已決定，不再是「要不要放大」。
  - 這些細節依賴設定頁（目標第一）。偏好設定在搬移後也位於設定頁內。研究時曾建議把開關放進偏好設定（有勾選、切換後不關閉、`penMode` 會持久化），三點選單則是選了就關、沒有勾選狀態。使用者已決定開關仍放三點選單，尺寸段位才進設定頁。
  - 不採用上游未合併的嵌入端 API（`UIOptions.canvasHandleScale`）。控制點變大是這個段位，不是宿主倍率。

## Risks / Trade-offs

- 開放問題：Canvas 背景是否以後也移入設定頁。現在留在漢堡選單。
- 已決定：Excalidraw+ 與 Sign up 不刪除，與 GitHub、追蹤我們、Discord 一起只放在 Special Thanks To。本變更是搬移，不是整項移除。
- 尺寸段位已決定為小、中、大、特大，預設大。不再把「是否放大」留成未定清單。
- 開放問題：「手指模式」除了這四段尺寸之外，還有哪些同類選項。中與大的像素已決定，不再未定。
- 偏好設定目前在函式庫選單，搬到 app 的設定頁時要保持勾選與即時生效，避免改成另一套儲存。
