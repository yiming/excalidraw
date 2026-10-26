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

### Requirement: Finger-mode size uses four tiers

設定頁 SHALL 有「手指模式」類別，以一個尺寸選項同時控制按鈕、選單項目與變形控制點。段位 SHALL 為小、中、大、特大。預設 SHALL 為大。該類別 MUST NOT 包含 ON／OFF 開關。小 SHALL 維持上游尺寸。特大的按鈕 SHALL 為 44px，選單項目高度 SHALL 至少 44px，控制點 SHALL 為 44px。

#### Scenario: Toggle is only in the more-tools menu

- **WHEN** 使用者打開三點「更多工具」選單
- **THEN** finger mode 的控制只有 ON／OFF 開關，沒有尺寸段位

#### Scenario: Default tier is Large

- **WHEN** 使用者尚未改過手指模式尺寸，並在設定頁打開「手指模式」
- **THEN** 選中的段位是大，且沒有 ON／OFF 開關

#### Scenario: Small keeps upstream sizes

- **WHEN** 段位是小，且筆模式開啟、主要指標為粗指標
- **THEN** 一般按鈕為 32px、大按鈕為 36px、選單項目高度為 32px 且間距為 1px、變形控制點為 8px

#### Scenario: Medium sizes

- **WHEN** 段位是中，且筆模式開啟、主要指標為粗指標
- **THEN** 一般按鈕為 36px、大按鈕為 39px、選單項目高度為 36px 且間距為 4px、變形控制點為 20px

#### Scenario: Large sizes

- **WHEN** 段位是大，且筆模式開啟、主要指標為粗指標
- **THEN** 一般按鈕為 40px、大按鈕為 42px、選單項目高度為 40px 且間距為 6px、變形控制點為 32px

#### Scenario: Extra large is the 44px target

- **WHEN** 段位是特大，且筆模式開啟、主要指標為粗指標
- **THEN** 一般按鈕與大按鈕皆為 44px、選單項目高度至少為 44px 且間距為 8px、變形控制點為 44px

#### Scenario: Fine pointer keeps upstream sizes

- **WHEN** 儲存的段位是大或特大，但筆模式為關閉，或主要指標不是粗指標
- **THEN** 按鈕、選單項目與變形控制點維持上游尺寸
