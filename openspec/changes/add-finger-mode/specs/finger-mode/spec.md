# Spec Delta

## Purpose

手指模式只把列出的介面元素放大，方便手指點按，並在觸控時隱藏快捷鍵提示。

## ADDED Requirements

### Requirement: Finger mode enlarges only the listed elements

手指模式 SHALL 只放大一般按鈕、大按鈕、選單項目高度、選單項目間距、縮放控制點與旋轉控制點。每一項 MUST 有自己的小、中、大、特大選擇，預設 MUST 為大。小 MUST 為該項的上游尺寸。手指模式為關時，這些元素 SHALL 維持上游尺寸。本變更 MUST NOT 加入清單以外的設定或行為。

#### Scenario: Default tier of each item is large

- **WHEN** 使用者還沒有改過任何一項手指模式尺寸
- **THEN** 每一項選中的都是大，而不是小或特大

#### Scenario: One item changes alone

- **WHEN** 手指模式為開，使用者只把選單項目間距改成中
- **THEN** 選單項目間距用中的值，其他項仍停在自己的選擇

#### Scenario: Off keeps upstream sizes

- **WHEN** 手指模式為關，且某一項已選成大或特大
- **THEN** 該項仍用上游尺寸，不套用大或特大

### Requirement: Known per-item pixel values

一般按鈕、大按鈕、選單項目高度、選單項目間距與縮放控制點在手指模式開啟時 SHALL 使用該項自己的段位。像素 SHALL 為：

- 一般按鈕：小 32、中 36、大 40、特大 44
- 大按鈕：小 36、中 39、大 42、特大 44
- 選單項目高度：小 32、中 36、大 40、特大至少 44
- 選單項目間距：小 1、中 4、大 6、特大 8
- 縮放控制點：小 8、中 20、大 32、特大 44

小 SHALL 等於上游原本尺寸。

#### Scenario: Large default button and menu height

- **WHEN** 手指模式為開，一般按鈕與選單項目高度都是大
- **THEN** 一般按鈕為 40px，選單項目高度為 40px

#### Scenario: Extra large menu height and gap

- **WHEN** 手指模式為開，選單項目高度與間距都是特大
- **THEN** 選單項目高度至少為 44px，間距為 8px

#### Scenario: Scale handle uses its own tier

- **WHEN** 手指模式為開，縮放控制點是中，一般按鈕仍是大
- **THEN** 縮放控制點為 20px，一般按鈕仍為 40px

#### Scenario: Small is the upstream size

- **WHEN** 手指模式為開，且某一項選小
- **THEN** 該項用上游尺寸：一般按鈕 32px、大按鈕 36px、選單項目高度 32px、間距 1px、縮放控制點 8px，視該項而定

### Requirement: Rotate handle is its own item

旋轉控制點 MUST 有自己的小、中、大、特大選擇，不得與縮放控制點共用一個選擇。預設 SHALL 為大。小 SHALL 為旋轉控制點的上游尺寸。

#### Scenario: Rotate handle is not the scale handle

- **WHEN** 使用者把縮放控制點改成特大
- **THEN** 旋轉控制點的選擇不變

#### Scenario: Rotate handle defaults to large

- **WHEN** 使用者還沒有改過旋轉控制點
- **THEN** 旋轉控制點選中的是大

### Requirement: Rotate handle uses the scale-handle pixels

旋轉控制點的像素 SHALL 與縮放控制點相同：小 8、中 20、大 32、特大 44。兩項的選擇 MUST 仍然分開。

#### Scenario: Large rotate handle is 32px

- **WHEN** 手指模式為開，旋轉控制點是大
- **THEN** 旋轉控制點為 32px

#### Scenario: Extra large rotate handle is 44px

- **WHEN** 手指模式為開，旋轉控制點是特大，縮放控制點仍是大
- **THEN** 旋轉控制點為 44px，縮放控制點為 32px

### Requirement: Finger mode is its own setting

手指模式 SHALL 單獨持久化，與上游 `penMode` 無關。開關 MUST NOT 改 `penMode`。手指模式為開時 SHALL 套用各項尺寸，不限觸控，也不看 `penMode`。為關時維持上游尺寸。

#### Scenario: The switch does not change pen mode

- **WHEN** 使用者打開手指模式
- **THEN** `penMode` 維持原值，尺寸仍依各項自己的選擇套用

#### Scenario: Enlargement does not wait for a coarse pointer

- **WHEN** 手指模式為開，且目前不是觸控
- **THEN** 各項仍用自己選中的尺寸

### Requirement: Finger mode does not change canvas gestures

手指模式 MUST NOT 改指標、筆或觸控的畫布行為。單指平移、筆按下時忽略手指，以及對捏合縮放的改動，都不是這個模式。這些行為 SHALL 與上游相同，上游 `penMode` 也保留。

#### Scenario: One finger does not pan because finger mode is on

- **WHEN** 手指模式為開，上游筆模式為開，工具是自由畫
- **THEN** 單指拖曳不因此平移畫布，也不因此畫出筆畫

#### Scenario: Pinch zoom stays upstream

- **WHEN** 手指模式為開，上游筆模式為開，工具是自由畫，使用者雙指捏合
- **THEN** 縮放與上游筆模式相同，不因手指模式改變

### Requirement: Shortcut hints hide on touch

手指模式為開且目前是觸控時，系統 SHALL 隱藏快捷鍵提示。手指模式為關時，快捷鍵提示 SHALL 維持上游。這個行為 MUST NOT 做成另一個設定項。

#### Scenario: Touch hides shortcut hints

- **WHEN** 手指模式為開，且使用者以觸控操作
- **THEN** 畫面上的快捷鍵提示被隱藏

#### Scenario: Off leaves shortcut hints as upstream

- **WHEN** 手指模式為關
- **THEN** 快捷鍵提示與上游相同

### Requirement: Finger mode row shows icon, label, and on or off

三點「更多工具」選單與設定頁 SHALL 各有一列手指模式開關，兩列版面相同。左側 SHALL 是手指圖示，且 MUST NOT 有勾選。中間的標籤 SHALL 只有「手指模式」，MUST NOT 是「手指平移與縮放」或 “Pen mode - finger pans and zooms”。右側 SHALL 只有 Excalidraw 的 `Switch`。該列 MUST NOT 再顯示快捷鍵、副標、「開」「關」文字或其他說明。

#### Scenario: Three-dot row has no checkmark and no shortcut

- **WHEN** 使用者打開三點「更多工具」
- **THEN** 手指模式列的左是手指圖示、中是「手指模式」、右是 `Switch`，沒有勾選，也沒有快捷鍵

#### Scenario: Settings row matches the menu row

- **WHEN** 使用者在設定頁看到手指模式開關
- **THEN** 這一列同樣是左手指圖示、中「手指模式」、右是 `Switch`，沒有勾選、快捷鍵、副標或說明

#### Scenario: The row shows the current state

- **WHEN** 手指模式為開，使用者看三點選單或設定頁的這一列
- **THEN** 右側的 `Switch` 為開

#### Scenario: Turning it off updates the indicator

- **WHEN** 手指模式為開，使用者從這一列把它關掉
- **THEN** 右側的 `Switch` 改為關，標籤仍是「手指模式」
