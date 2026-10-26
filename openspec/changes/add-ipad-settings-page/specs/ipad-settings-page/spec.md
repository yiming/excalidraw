# Spec Delta

## Purpose

提供一頁 iPad 風格的全螢幕設定，把上游致謝連結集中到 Special Thanks To，並用「手指模式」類別承接 finger mode 的細節選項。

## ADDED Requirements

### Requirement: Full-screen settings layout

設定頁 MUST 以全螢幕顯示。寬版面 SHALL 為左側類別清單、右側該類別的內容。

#### Scenario: Wide layout

- **WHEN** 使用者開啟設定且寬度足夠並排
- **THEN** 左側是類別清單，右側是所選類別的內容

### Requirement: Settings entry between Help and Reset canvas

漢堡選單 SHALL 有「設定」項目，位置在說明（Help）之下、重設畫布（Reset canvas）之上。選擇它 SHALL 開啟設定頁。

#### Scenario: Open settings from the menu

- **WHEN** 使用者在漢堡選單於說明與重設畫布之間選擇「設定」
- **THEN** 設定頁開啟

### Requirement: Settings category list

左側清單 SHALL 包含 Special Thanks To、關於、手指模式、偏好設定、主題、語系。Special Thanks To MUST 只佔一個項目，標籤文字 SHALL 原樣為 Special Thanks To。

#### Scenario: Left list includes one Special Thanks To entry

- **WHEN** 使用者開啟設定頁
- **THEN** 左側清單有一個 Special Thanks To，並且有關於、手指模式、偏好設定、主題、語系

### Requirement: Credit links live only on Special Thanks To

Special Thanks To 的右側 SHALL 包含這五個連結，且 MUST NOT 刪除：Excalidraw+、GitHub、追蹤我們、Discord、Sign up。同一頁 SHALL 有一句感謝 Excalidraw 原作者的普通文字，並 MUST NOT 另加 GitHub 網址；既有的 GitHub 連結就是出處。這五個連結 MUST NOT 出現在漢堡選單、右上角宣傳列，或任何其他設定類別（包含關於）。

#### Scenario: The page shows five links and a plain thank-you sentence

- **WHEN** 使用者選擇 Special Thanks To
- **THEN** 頁面有 Excalidraw+、GitHub、追蹤我們、Discord、Sign up，以及一句感謝原作者的文字，且沒有第二個 GitHub 網址

#### Scenario: Other categories omit the credit links

- **WHEN** 使用者選擇關於，或 Special Thanks To 以外的類別
- **THEN** 該類別沒有 Excalidraw+、GitHub、追蹤我們、Discord、Sign up

#### Scenario: Hamburger menu and top promo omit the links

- **WHEN** 使用者打開漢堡選單，或查看右上角宣傳列
- **THEN** 那裡沒有這五個連結，而連結仍可在 Special Thanks To 開啟

### Requirement: Preferences theme and language leave the hamburger menu

偏好設定的全部項目、主題、語系 SHALL 離開漢堡選單，並出現在設定頁各自的類別。

#### Scenario: Preferences theme and language are in settings

- **WHEN** 使用者開啟設定頁
- **THEN** 可以在對應類別找到偏好設定的全部既有項目、主題與語系

### Requirement: Hamburger menu keeps immediate operations

漢堡選單 SHALL 保留即時操作項目，包含說明與重設畫布。Canvas 背景 SHALL 留在漢堡選單。

#### Scenario: Reset canvas stays put

- **WHEN** 使用者打開漢堡選單
- **THEN** 重設畫布仍在選單中，且位於「設定」之下

#### Scenario: Canvas background stays in the menu

- **WHEN** 使用者打開漢堡選單
- **THEN** Canvas 背景仍在這個選單，而不在設定頁

### Requirement: Moved settings keep their behavior

移入設定頁的每個既有設定 SHALL 保持搬移前的行為與持久化結果。本變更 MUST NOT 新增設定頁與選單整理以外的功能。

#### Scenario: A moved preference still persists

- **WHEN** 使用者在設定頁變更一項原本屬於偏好設定的選項
- **THEN** 該選項的效果與搬移前相同，並仍寫入原本的本地儲存

### Requirement: Finger-mode details live in settings

設定頁 SHALL 有「手指模式」類別，用來控制細節選項。該類別 MUST NOT 包含 ON／OFF 開關。開關 SHALL 只出現在三點「更多工具」選單，且該選單項目只是開關。細節選項 SHALL 包含：是否放大按鈕、是否放大物件與變形控制點。其他同類選項可以之後加入，但不得取代這兩項。

#### Scenario: Toggle is only in the more-tools menu

- **WHEN** 使用者打開三點「更多工具」選單
- **THEN** finger mode 的控制只有 ON／OFF 開關，沒有放大按鈕或控制點的細節

#### Scenario: Details are in the settings category

- **WHEN** finger mode 為開啟且使用者在設定頁選擇「手指模式」
- **THEN** 右側提供是否放大按鈕、是否放大物件與變形控制點，且沒有 ON／OFF 開關
