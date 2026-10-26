# Spec Delta

## Purpose

開發目標第 2 項只涵蓋 slide 的檔案結構：Workspace、頁面，以及換頁列與 page manager。

## ADDED Requirements

### Requirement: Workspace opens and creates files

選單 SHALL 有「Workspace」。Workspace 裡 SHALL 可以開啟檔案與新建檔案。畫布本身 MUST NOT 再提供開啟檔案或新建檔案。

#### Scenario: Workspace is in the menu

- **WHEN** 使用者打開選單
- **THEN** 看得到「Workspace」

#### Scenario: Workspace can open or create

- **WHEN** 使用者進入 Workspace
- **THEN** 可以開啟檔案，也可以新建檔案

#### Scenario: The canvas no longer opens or creates files

- **WHEN** 使用者在畫布上尋找開啟檔案或新建檔案
- **THEN** 畫布沒有這兩個動作

### Requirement: New file type is infinite canvas or slide

新建檔案時，使用者 SHALL 選擇類型。類型 SHALL 是無限畫布或 slide。無限畫布 MUST 與今天的畫布相同。slide SHALL 是 PowerPoint 風格。

#### Scenario: The two types are offered

- **WHEN** 使用者新建檔案
- **THEN** 可以選無限畫布或 slide

#### Scenario: Infinite canvas matches today

- **WHEN** 使用者選擇無限畫布
- **THEN** 得到的畫布與今天的無限畫布相同

### Requirement: Slide paper size is chosen from the stated list

選擇 slide 時，使用者 SHALL 從下列紙張尺寸選一個：

- 16:9 橫式
- 16:9 直式
- 4:3 橫式
- 4:3 直式
- A4 橫式
- A4 直式

清單 MUST NOT 包含 iPad 螢幕尺寸。

#### Scenario: Slide creation offers only those sizes

- **WHEN** 使用者新建檔案並選擇 slide
- **THEN** 紙張尺寸只從上面六項裡選

#### Scenario: iPad screen size is absent

- **WHEN** 使用者在選擇紙張尺寸
- **THEN** 選項裡沒有 iPad 螢幕尺寸

### Requirement: Initial page count has a fixed range

新建 slide 時，使用者 SHALL 選擇起始頁數。頁數 MUST 至少為 1，至多為 10。預設 SHALL 為 10。無限畫布 MUST NOT 提供頁數選擇。

#### Scenario: Default page count is ten

- **WHEN** 使用者建立 slide 且尚未改頁數
- **THEN** 起始頁數是 10

#### Scenario: The count stays inside one to ten

- **WHEN** 使用者選擇 slide 的起始頁數
- **THEN** 只能選 1 到 10

#### Scenario: Infinite canvas has no page-count choice

- **WHEN** 使用者建立無限畫布
- **THEN** 沒有起始頁數的選項

### Requirement: Each page has its own background

每一頁 SHALL 有自己的背景色。修改一頁的背景色 MUST NOT 改到其他頁。新建檔案 SHALL 使用預設背景色。

#### Scenario: One page changes alone

- **WHEN** 使用者修改其中一頁的背景色
- **THEN** 其他頁的背景色不變

#### Scenario: A new file starts from the default

- **WHEN** 使用者新建檔案且尚未改背景色
- **THEN** 頁面使用預設背景色

### Requirement: Paper size is locked after creation

slide 的紙張尺寸在檔案建立後 MUST NOT 再改變。

#### Scenario: Size stays as chosen

- **WHEN** slide 檔已經建立
- **THEN** 它的紙張尺寸與建立時的選擇相同，不能改成另一種

### Requirement: A file name is entered

新建檔案時，使用者 SHALL 輸入檔名。選擇檔案位置 MUST NOT 屬於這個目標。

#### Scenario: The name is entered at creation

- **WHEN** 使用者新建檔案
- **THEN** 要輸入檔名

#### Scenario: Location is outside this goal

- **WHEN** 使用者新建檔案
- **THEN** 這個目標不要求選擇檔案位置

### Requirement: A page size means multi-page

有頁面尺寸的檔案 SHALL 一律是多頁。無限畫布 SHALL 永遠是單頁，而且 MUST NOT 有換頁列。

#### Scenario: A sized file is multi-page

- **WHEN** 檔案有頁面尺寸
- **THEN** 它是多頁檔

#### Scenario: An infinite canvas is one page without a pager

- **WHEN** 檔案是無限畫布
- **THEN** 它是單頁，沒有頁面尺寸，也沒有換頁列

### Requirement: Terminology uses slide or page

頁面的用語 SHALL 是 slide 或 page。本目標 MUST NOT 把頁面叫作 scene。每一頁是一個 slide。使用者原話是「一檔一頁 slide，不叫 scene，用 slide 或 page」。

#### Scenario: The visible wording avoids scene

- **WHEN** 這個目標描述頁面
- **THEN** 用 slide 或 page，不用 scene

### Requirement: Pager sits beside the zoom control

多頁 slide 的換頁列 SHALL 在左下角、縮放百分比旁邊。換頁列 SHALL 包含上一頁、下一頁、新增頁，以及選擇頁碼的下拉。下拉 MUST 只顯示數字。在第一頁按上一頁，或在最後一頁按下一頁，SHALL 循環到另一端。縮放百分比、重做、復原 SHALL 維持現有行為。換頁列 MUST NOT 放在右下角。

#### Scenario: The pager is next to zoom

- **WHEN** 使用者打開多頁 slide
- **THEN** 換頁列在左下角、縮放百分比旁邊，而不是在右下角

#### Scenario: The dropdown shows numbers only

- **WHEN** 使用者打開頁碼下拉
- **THEN** 裡面只有頁碼數字

#### Scenario: Previous and next wrap

- **WHEN** 使用者在第一頁按上一頁，或在最後一頁按下一頁
- **THEN** 頁面循環到另一端

#### Scenario: Zoom redo and undo stay as they are

- **WHEN** 使用者看左下角的縮放百分比、重做、復原
- **THEN** 這三項的行為與現在相同

### Requirement: Page manager slides in from the right

page manager SHALL 從換頁列打開。依最新指示，它 SHALL 從右側滑入，風格與現有右上角滑入面板相同。裡面 SHALL 可以編輯標題、刪除、調整順序、新增。它 SHALL 可以在縮圖檢視與標題清單之間切換。

#### Scenario: The pager opens the page manager

- **WHEN** 使用者從換頁列打開 page manager
- **THEN** 面板從右側滑入

#### Scenario: The manager edits order and titles

- **WHEN** 使用者在 page manager 裡操作
- **THEN** 可以改標題、刪除、調順序、新增

#### Scenario: The view can switch

- **WHEN** 使用者切換 page manager 的檢視
- **THEN** 可以在縮圖檢視與標題清單之間換

### Requirement: Long-press opens a title popup

長按換頁列 SHALL 打開輸入標題的彈出。這個彈出 SHALL 包含刪除頁面。

#### Scenario: The popup accepts a title and can delete

- **WHEN** 使用者長按換頁列
- **THEN** 出現輸入標題的彈出，而且可以刪除頁面

### Requirement: Shield information moves to About

勾選（盾牌）所代表的安全／加密資訊 SHALL 改到設定頁的關於。問號（說明）按鈕 SHALL 保留。無限畫布開啟時，右下角 MUST NOT 放置任何東西。

#### Scenario: About shows the former shield information

- **WHEN** 使用者打開設定頁的關於
- **THEN** 看得到原本勾選（盾牌）按鈕上的安全／加密資訊

#### Scenario: Help stays

- **WHEN** 使用者看畫布上的控制
- **THEN** 問號（說明）按鈕還在

#### Scenario: Infinite canvas leaves the bottom-right empty

- **WHEN** 使用者打開無限畫布
- **THEN** 右下角沒有放上控制

### Requirement: Keyboard shortcuts cover page actions

有外接鍵盤的 iPad SHALL 能用快捷鍵做換頁、加頁，以及同類的頁面操作。

#### Scenario: An attached keyboard can change pages

- **WHEN** 使用者在多頁 slide 上使用接上鍵盤的 iPad
- **THEN** 可以用鍵盤換頁與加頁

### Requirement: This goal is file structure only

本目標 SHALL 只涵蓋檔案結構。跨頁動畫 MUST NOT 屬於本目標。本目標 MUST NOT 產生原版 Excalidraw 無法打開的檔案格式。

#### Scenario: Cross-page animation is absent

- **WHEN** 使用者使用這個目標的 slide 檔
- **THEN** 沒有跨頁動畫

#### Scenario: Plain Excalidraw can still open the file

- **WHEN** 這個目標寫出檔案
- **THEN** 檔案格式仍是原版 Excalidraw 打得開的
