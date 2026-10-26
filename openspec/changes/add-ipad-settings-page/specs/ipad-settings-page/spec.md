# Spec Delta

## Purpose

提供一頁 iPad 風格的全螢幕設定，把漢堡選單裡的非即時項目移進去，並用「手指模式」類別承接 finger mode 的細節選項。

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

### Requirement: Non-immediate items leave the hamburger menu

下列項目 SHALL 離開漢堡選單，並出現在設定頁：Excalidraw+ 連結、GitHub、追蹤我們、Discord、Sign up、偏好設定的全部項目、主題、語系。Sign up 與 Sign in 是同一個項目的兩種標籤，SHALL 一起移走。

#### Scenario: Moved links are absent from the hamburger menu

- **WHEN** 使用者打開漢堡選單
- **THEN** 選單中沒有 Excalidraw+、GitHub、追蹤我們、Discord、Sign up 或 Sign in

#### Scenario: Preferences theme and language are in settings

- **WHEN** 使用者開啟設定頁
- **THEN** 可以找到偏好設定的全部既有項目、主題與語系

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

### Requirement: Plus and sign-up links are moved not removed

Excalidraw+ 與 Sign up 連結 SHALL 被搬到設定頁。本變更 MUST NOT 刪除這兩個連結。

#### Scenario: Links remain reachable

- **WHEN** 使用者開啟設定頁中對應的類別
- **THEN** Excalidraw+ 與 Sign up 連結仍可使用，目的地與搬移前相同

### Requirement: Finger-mode details live in settings

設定頁 SHALL 有「手指模式」類別，用來控制細節選項。該類別 MUST NOT 包含 ON／OFF 開關。開關 SHALL 只出現在三點「更多工具」選單，且該選單項目只是開關。細節選項 SHALL 包含：是否放大按鈕、是否放大物件與變形控制點。其他同類選項可以之後加入，但不得取代這兩項。

#### Scenario: Toggle is only in the more-tools menu

- **WHEN** 使用者打開三點「更多工具」選單
- **THEN** finger mode 的控制只有 ON／OFF 開關，沒有放大按鈕或控制點的細節

#### Scenario: Details are in the settings category

- **WHEN** finger mode 為開啟且使用者在設定頁選擇「手指模式」
- **THEN** 右側提供是否放大按鈕、是否放大物件與變形控制點，且沒有 ON／OFF 開關
