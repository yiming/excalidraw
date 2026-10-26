# Spec Delta

## Purpose

提供一頁沿用 Excalidraw 視覺的設定。致謝連結集中在 Special Thanks To。主題與語系在同一頁，手指模式的開關與各項尺寸放在它們下面。

## ADDED Requirements

### Requirement: Settings shell is Modal and Dialog

設定頁 MUST 用 `Modal` 與 `Dialog`，MUST NOT 用固定全螢幕 div。左上角 SHALL 是返回按鈕。返回 MUST NOT 是 Close 按鈕，也 MUST NOT 是左側清單裡的一項。頁面 MUST 渲染在 `.excalidraw` 容器內，讓主題 token 生效。

#### Scenario: Back button is at the top left

- **WHEN** 使用者開啟設定
- **THEN** 左上角有返回按鈕，頁面上沒有 Close，左側清單裡也沒有返回或 Close

#### Scenario: The page sits inside the editor container

- **WHEN** 使用者開啟設定
- **THEN** 設定頁在 `.excalidraw` 容器內，亮色與暗色都使用該容器的 CSS 變數

### Requirement: Settings entry between Help and Reset canvas

漢堡選單 SHALL 有「設定」項目，位置在說明（Help）之下、重設畫布（Reset canvas）之上。選擇它 SHALL 開啟設定頁。

#### Scenario: Open settings from the menu

- **WHEN** 使用者在漢堡選單於說明與重設畫布之間選擇「設定」
- **THEN** 設定頁開啟

### Requirement: No single-option sub-pages

設定 MUST NOT 為只有一個選項的項目另開子頁。主題與語系 SHALL 在同一頁。手指模式開關列與各尺寸選擇 SHALL 在這一頁、主題與語系的下面。主題、語系、手指模式 MUST NOT 各自佔一頁。

#### Scenario: Theme and language share one page

- **WHEN** 使用者開啟設定並查看主題
- **THEN** 同一頁也能看到語系，而且沒有單獨的主題子頁或語系子頁

#### Scenario: Finger mode options sit below theme and language

- **WHEN** 使用者打開主題與語系那一頁
- **THEN** 手指模式的開關列與各尺寸選擇都在主題與語系的下面

### Requirement: Category order

左側清單順序 SHALL 為 Special Thanks To、偏好設定、主題與語系、關於。合併頁的名稱 SHALL 用 `labels.themeAndLanguage`。返回按鈕的可見文字 SHALL 用 `buttons.back`。清單 MUST NOT 再有 Close。

#### Scenario: The list order is thanks, preferences, theme and language, about

- **WHEN** 使用者開啟設定
- **THEN** 左側依序是這四項，沒有主題子頁、語系子頁、手指模式子頁或 Close

#### Scenario: The back button uses the back label

- **WHEN** 使用者開啟設定
- **THEN** 左上角按鈕的文字來自 `buttons.back`，不是 Close

### Requirement: About section

設定 SHALL 有「關於」區段。這個區段 MUST NOT 包含 Excalidraw+、GitHub、追蹤我們、Discord、Sign up。

#### Scenario: About is present

- **WHEN** 使用者開啟設定
- **THEN** 可以看到「關於」區段

#### Scenario: About omits the credit links

- **WHEN** 使用者查看「關於」
- **THEN** 那裡沒有 Excalidraw+、GitHub、追蹤我們、Discord、Sign up

### Requirement: Settings category rows match menu items

類別列 SHALL 沿用 `.dropdown-menu-item` 的樣式，包含 `--border-radius-md`、hover 時的 `--button-hover-bg`、選中時的 `--color-primary-light`，以及 `--text-primary-color`。

#### Scenario: Selected category uses the menu item treatment

- **WHEN** 使用者在設定的類別列選中一項
- **THEN** 該列使用 `.dropdown-menu-item` 的選中樣式，而不是另一套背景

### Requirement: Boolean rows use the menu checkbox

偏好設定裡的開關 SHALL 沿用主選單的核取列：`dropdown-menu-item`，勾選時是 `checkIcon`，未勾選時是 `emptyIcon`。這與 `DropdownMenuItemCheckbox` 的標記相同。`ToggleRow`（只改背景的 `button[aria-pressed]`）與自製的 `Switch` 列 MUST NOT 再使用。手指模式那一列的版面見下一條需求，仍只用 `Switch`。

#### Scenario: A preference toggle shows the menu checkbox

- **WHEN** 使用者查看偏好設定裡的一項開關
- **THEN** 左側是勾選圖示或空白圖示，右側是標籤，不是 `Switch`，也不是只改變背景色的按鈕

### Requirement: Single choices use the menu radio

框選方式、輸入裝置與主題 SHALL 使用 `DropdownMenuItemContentRadio`（列上的標籤加上 `RadioGroup`）。主題的三個選項 SHALL 是主選單同一組圖示：`SunIcon`、`MoonIcon`、`DeviceDesktopIcon`，並用既有的淺色、深色、系統模式字串當 `aria-label`。手指模式每一項的小、中、大、特大 SHALL 使用 `RadioGroup`，沒有對應的主選單控制項。

#### Scenario: Theme uses the icon radio

- **WHEN** 使用者在合併頁上看主題
- **THEN** 主題列是 `DropdownMenuItemContentRadio`，三個選項是太陽、月亮與桌面圖示，不是文字按鈕

#### Scenario: Each finger mode item has its own radio group

- **WHEN** 使用者查看手指模式的尺寸選擇
- **THEN** 一般按鈕、大按鈕、選單項目高度、選單項目間距、縮放控制點、旋轉控制點各有一個 `RadioGroup`，預設都是大

### Requirement: Section headers use the menu group title

區段標題 MUST NOT 使用帶框線的 fieldset，也 MUST NOT 自訂另一套標題色。語言與手指模式各尺寸的標題 SHALL 使用 `.dropdown-menu-group-title`。

#### Scenario: A section title has no fieldset border

- **WHEN** 使用者看到設定裡的區段標題
- **THEN** 標題是 `.dropdown-menu-group-title`，沒有 fieldset 框線

### Requirement: Settings chrome uses design tokens

設定頁樣式 MUST NOT 寫死 hex 或 px。圓角 SHALL 用 `--border-radius-md`，間距 SHALL 用 `--space-factor`，輸入控制 SHALL 用 `--input-*`，表面 SHALL 用 `--island-bg-color`，字型 SHALL 用 `--ui-font`。在 `.excalidraw--finger-targets` 底下，列的 `min-height` SHALL 為 `var(--finger-menu-item-height, 2rem)`。亮色與暗色 MUST 都只靠這些 CSS 變數。

#### Scenario: Rows follow the finger menu height variable

- **WHEN** 編輯器帶有 `.excalidraw--finger-targets`，使用者開啟設定
- **THEN** 設定列的最小高度是 `var(--finger-menu-item-height, 2rem)`，不是寫死的 44px

#### Scenario: Dark theme uses the same variables

- **WHEN** 使用者在暗色主題開啟設定
- **THEN** 背景、文字、框線與主色來自 `.excalidraw.theme--dark` 的 CSS 變數，樣式裡沒有寫死的 hex

### Requirement: Finger mode row in settings

設定頁的手指模式開關 SHALL 與三點選單同一版面。左側 SHALL 是手指圖示，且 MUST NOT 有勾選。中間 SHALL 只有「手指模式」。右側 SHALL 只有 `Switch`。該列 MUST NOT 顯示快捷鍵、副標、「開」「關」文字或其他說明。開關在各尺寸選擇之上。各尺寸項的值與「觸控時隱藏快捷鍵提示」SHALL 依 `add-finger-mode` 的 `finger-mode` 規格。

#### Scenario: Settings finger row is icon, label, and state

- **WHEN** 使用者在設定頁看到手指模式開關
- **THEN** 左是手指圖示、中是「手指模式」、右是 `Switch`，沒有勾選、快捷鍵、副標或說明

#### Scenario: The settings row shows off

- **WHEN** 手指模式為關，使用者查看設定頁的這一列
- **THEN** 右側的 `Switch` 為關

### Requirement: About category describes this fork

關於類別 SHALL 顯示應用名稱、說明這是 Excalidraw 的 iPad 友善分支、沿用既有版本資訊，以及這個分支的儲存庫連結。關於 MUST NOT 包含 Special Thanks To 的五個致謝連結。

#### Scenario: About shows the fork

- **WHEN** 使用者選擇關於
- **THEN** 頁面有應用名稱、iPad 友善分支的說明、版本，以及此分支儲存庫的連結，且沒有 Excalidraw+、Discord 或 Sign up

### Requirement: Credit links live only on Special Thanks To

名為 Special Thanks To 的頁面 SHALL 包含這五個連結，且 MUST NOT 刪除：Excalidraw+、GitHub、追蹤我們、Discord、Sign up。同一頁 SHALL 有一句感謝 Excalidraw 原作者的普通文字，並 MUST NOT 另加 GitHub 網址。這五個連結 MUST NOT 出現在漢堡選單、右上角宣傳列，或任何其他設定區段（包含關於）。連結 SHALL 是顏色為 `--color-primary` 的文字連結。

#### Scenario: The page name is exact

- **WHEN** 使用者開啟設定並看到致謝頁
- **THEN** 該頁名稱是 Special Thanks To

#### Scenario: The page shows five links and a thank-you sentence

- **WHEN** 使用者選擇 Special Thanks To
- **THEN** 頁面有 Excalidraw+、GitHub、追蹤我們、Discord、Sign up，以及一句感謝原作者的文字，且沒有第二個 GitHub 網址

#### Scenario: Credit links are primary text links

- **WHEN** 使用者查看 Special Thanks To 的連結
- **THEN** 它們是 `--color-primary` 的文字連結，不是與類別列相同的按鈕列

#### Scenario: Hamburger menu and top promo omit the links

- **WHEN** 使用者打開漢堡選單，或查看右上角宣傳列
- **THEN** 那裡沒有這五個連結，而連結仍可在 Special Thanks To 開啟

### Requirement: Preferences theme and language leave the hamburger menu

偏好設定的全部項目、主題、語系 SHALL 離開漢堡選單，並出現在設定頁。主題與語系在合併後的那一頁，不各佔一頁。

#### Scenario: Preferences theme and language are in settings

- **WHEN** 使用者開啟設定頁
- **THEN** 可以找到偏好設定的全部既有項目，以及同一頁上的主題與語系

### Requirement: Hamburger menu keeps immediate operations

漢堡選單 SHALL 保留即時操作項目，包含說明與重設畫布。Canvas 背景 SHALL 留在漢堡選單。

#### Scenario: Reset canvas stays put

- **WHEN** 使用者打開漢堡選單
- **THEN** 重設畫布仍在選單中，且位於「設定」之下

#### Scenario: Canvas background stays in the menu

- **WHEN** 使用者打開漢堡選單
- **THEN** Canvas 背景仍在這個選單，而不在設定頁

### Requirement: Moved settings keep their behavior

移入設定頁的每個既有設定 SHALL 保持搬移前的行為與持久化結果。本變更 MUST NOT 新增設定頁、選單整理與手指模式選項以外的功能。

#### Scenario: A moved preference still persists

- **WHEN** 使用者在設定頁變更一項原本屬於偏好設定的選項
- **THEN** 該選項的效果與搬移前相同，並仍寫入原本的本地儲存

### Requirement: Plus and sign-up links are moved not removed

Excalidraw+ 與 Sign up 連結 SHALL 被搬到 Special Thanks To。本變更 MUST NOT 刪除這兩個連結。

#### Scenario: Links remain reachable

- **WHEN** 使用者開啟 Special Thanks To
- **THEN** Excalidraw+ 與 Sign up 連結仍可使用，目的地與搬移前相同

### Requirement: Chinese locales include the new strings

`zh-TW.json` 與 `zh-CN.json` SHALL 為每個新介面字串提供譯文。`labels.fingerMode` 的繁體中文 SHALL 是「手指模式」。`labels.specialThanksTo` 的英文 SHALL 正好是 Special Thanks To。

#### Scenario: Both Chinese files translate the page and section titles

- **WHEN** 查看 zh-TW 與 zh-CN
- **THEN** `labels.specialThanksTo`、`labels.specialThanksSentence`、`labels.about`、`labels.fingerMode` 在兩個檔裡都有譯文

#### Scenario: Both Chinese files translate the size labels

- **WHEN** 查看 zh-TW 與 zh-CN
- **THEN** `labels.fingerModeSizeSmall`、`labels.fingerModeSizeMedium`、`labels.fingerModeSizeLarge`、`labels.fingerModeSizeExtraLarge` 在兩個檔裡都有譯文

#### Scenario: Both Chinese files translate the per-item names

- **WHEN** 查看 zh-TW 與 zh-CN
- **THEN** `labels.fingerModeDefaultButton`、`labels.fingerModeLargeButton`、`labels.fingerModeMenuItemHeight`、`labels.fingerModeMenuItemGap`、`labels.fingerModeScaleHandle`、`labels.fingerModeRotateHandle` 在兩個檔裡都有譯文

#### Scenario: The merged page and the back button are translated

- **WHEN** 查看 zh-TW 與 zh-CN
- **THEN** `labels.themeAndLanguage` 與 `buttons.back` 在兩個檔裡都有譯文

#### Scenario: The thanks title has a Chinese translation

- **WHEN** 介面語系是 zh-TW 或 zh-CN
- **THEN** `labels.specialThanksTo` 顯示該語系的譯文，英文語系則顯示 Special Thanks To
