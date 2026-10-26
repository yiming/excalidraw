# Spec Delta

## Purpose

開發目標第 2 項：用 Workspace 新建無限畫布或 slide，並為有頁面尺寸的檔案提供換頁列。

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

- iPad 螢幕尺寸
- 16:9 橫式
- 16:9 直式
- 4:3 橫式
- 4:3 直式
- A4 橫式
- A4 直式

#### Scenario: Slide creation offers only those sizes

- **WHEN** 使用者新建檔案並選擇 slide
- **THEN** 紙張尺寸只從上面七項裡選

### Requirement: Page count and background are chosen and can change later

新建 slide 時，使用者 SHALL 選擇起始頁數。新建檔案時，使用者 SHALL 選擇背景色。頁面之後 SHALL 可以新增或刪除。背景色之後 SHALL 可以修改。

#### Scenario: Initial page count is chosen for a slide

- **WHEN** 使用者建立 slide 檔
- **THEN** 要先選起始頁數

#### Scenario: Pages can be added or removed later

- **WHEN** slide 檔已經建立
- **THEN** 之後仍可以加頁或刪頁

#### Scenario: Background colour is chosen for a new file

- **WHEN** 使用者新建檔案
- **THEN** 要選擇背景色

#### Scenario: Background colour can be changed later

- **WHEN** 使用者建立檔案時選了背景色
- **THEN** 之後仍可以改這個背景色

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

有頁面尺寸的檔案 SHALL 一律是多頁。無限畫布 SHALL 是單頁。

#### Scenario: A sized file is multi-page

- **WHEN** 檔案有頁面尺寸
- **THEN** 它是多頁檔

#### Scenario: An infinite canvas is one page

- **WHEN** 檔案是無限畫布
- **THEN** 它是單頁，而且沒有頁面尺寸

### Requirement: Bottom-right pager replaces the shield button

多頁檔的右下角 SHALL 有換頁列。換頁列 SHALL 包含上一頁、下一頁、新增頁，以及選擇頁碼的下拉。下拉 MUST 只顯示數字。這列 SHALL 放在現有勾選（盾牌）按鈕的位置，並取代該按鈕。

#### Scenario: The pager has the four controls

- **WHEN** 使用者打開有頁面尺寸的檔案
- **THEN** 右下角有上一頁、下一頁、新增頁，以及頁碼下拉

#### Scenario: The dropdown shows numbers only

- **WHEN** 使用者打開頁碼下拉
- **THEN** 裡面只有頁碼數字

#### Scenario: The shield button is no longer in that spot

- **WHEN** 使用者看右下角
- **THEN** 該位置是換頁列，不是勾選（盾牌）按鈕

### Requirement: Shield information moves to About

勾選（盾牌）所代表的安全／加密資訊 SHALL 改到設定頁的關於。問號（說明）按鈕 SHALL 保留。左下角的縮放百分比、重做、復原 SHALL 維持不變。

#### Scenario: About shows the former shield information

- **WHEN** 使用者打開設定頁的關於
- **THEN** 看得到原本勾選（盾牌）按鈕上的安全／加密資訊

#### Scenario: Help stays

- **WHEN** 使用者看畫布上的控制
- **THEN** 問號（說明）按鈕還在

#### Scenario: Bottom-left controls stay

- **WHEN** 使用者看左下角
- **THEN** 縮放百分比、重做、復原與現在相同

### Requirement: Animation frames and foreign files are avoided

本目標 MUST NOT 在動畫的每一幀更新 scene。本目標 MUST NOT 產生原版 Excalidraw 無法打開的檔案格式。

#### Scenario: Scene updates are not per animation frame

- **WHEN** 這個目標裡出現跨頁的畫面變化
- **THEN** 不會為了每一幀去更新 scene，因而不灌爆 undo，也不因此觸發同步或存檔

#### Scenario: Plain Excalidraw can still open the file

- **WHEN** 這個目標寫出檔案
- **THEN** 檔案格式仍是原版 Excalidraw 打得開的
