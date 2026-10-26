# Spec Delta

## Purpose

定義筆模式底下筆、手指與滑鼠怎麼分工，讓手指只移動畫面，筆繼續畫，兩者同時碰到螢幕時不弄亂平移、縮放或筆畫。

## ADDED Requirements

### Requirement: First pen contact enables pen mode

系統 SHALL 在尚未偵測到筆時，於第一個 `pointerType` 為 `pen` 的指標按下開啟 `penMode` 與 `penDetected`。使用者之後 SHALL 仍可手動關掉筆模式。

#### Scenario: Apple Pencil touches the canvas

- **WHEN** `penDetected` 為 false，且一支筆在畫布上按下
- **THEN** `penMode` 為 true，且 `penDetected` 為 true

### Requirement: Finger does not edit while pen mode is on

`penMode` 為 true 時，`pointerType` 為 `touch` 的指標 SHALL NOT 對任何工具建立、選取、拖曳、縮放或編輯物件。這包含選取、套索、文字與圖片。滑鼠與筆 SHALL 維持原本的工具行為。

#### Scenario: Finger drags a selected element

- **WHEN** 筆模式開啟、選取工具作用中，手指拖曳已選取的物件
- **THEN** 該物件的位置與尺寸不變

#### Scenario: Finger uses freedraw, text, lasso, or image

- **WHEN** 筆模式開啟，且目前工具是自由畫筆、文字、套索或圖片，手指在畫布上按下並拖曳
- **THEN** 不產生新物件，也不進入文字編輯

#### Scenario: Mouse still draws in pen mode

- **WHEN** 筆模式開啟，滑鼠用矩形工具拖曳
- **THEN** 產生一個矩形

### Requirement: One finger pans in pen mode

`penMode` 為 true、沒有筆按在畫布上、且只有一根手指時，該手指的拖曳 SHALL 平移畫布。

#### Scenario: Single finger drag

- **WHEN** 筆模式開啟，一根手指在畫布上拖曳
- **THEN** 畫布的捲動位置改變

### Requirement: Two fingers pinch-zoom in pen mode

`penMode` 為 true 時，兩根手指 SHALL 能捏合縮放畫布，包含目前工具是自由畫筆。手勢中的指標若包含筆，系統 SHALL NOT 因該手勢改變縮放。

#### Scenario: Pinch with the freedraw tool

- **WHEN** 筆模式開啟、自由畫筆作用中，兩根手指撐開
- **THEN** 畫布縮放變大

#### Scenario: Pen is among the gesture pointers

- **WHEN** 目前手勢的指標類型包含 `pen`
- **THEN** 捏合縮放係數為 1

### Requirement: Pen mode toggle lives in extra tools

系統 SHALL 在三點「更多工具」選單中提供筆模式開關，與雷射筆、畫框同一層。開關 SHALL 在尚未偵測到筆時就能操作，並 SHALL 顯示目前是開或關。開關 SHALL 切換既有的 `penMode`，不得另建一套模式狀態。

#### Scenario: Toggle before a pen is detected

- **WHEN** `penDetected` 為 false，使用者在更多工具選單啟動筆模式項目
- **THEN** `penMode` 變為 true，且該項目顯示為開啟

#### Scenario: Toggle off

- **WHEN** `penMode` 為 true，使用者再啟動同一個項目
- **THEN** `penMode` 變為 false，且該項目顯示為關閉

### Requirement: Pen and finger may touch together

手指先按下時，接著按下的筆 SHALL 仍能畫完一筆，且筆畫期間畫布縮放 SHALL NOT 改變；筆抬起後 SHALL 還能再畫下一筆。筆模式開啟且筆正按著時，後到的觸控 SHALL NOT 結束或改寫進行中的自由畫筆。

#### Scenario: Finger is already down

- **WHEN** 筆模式開啟，手指按著，筆再畫出一筆然後抬起
- **THEN** 這一筆被提交，畫布縮放不變，且下一筆仍可畫

#### Scenario: Palm lands during a pen stroke

- **WHEN** 筆模式開啟，筆正在畫自由畫筆，手指按下、移動再抬起
- **THEN** 筆畫保持進行中，手指不新增點，筆抬起後只提交這一筆

### Requirement: Second touch outside pen mode still aborts a short stroke

`penMode` 為 false 時，自由畫筆進行中若再來一根手指，系統 SHALL 維持中止過短筆畫的行為。筆模式關閉時，手指 SHALL 仍能用工具畫圖。

#### Scenario: Short freedraw and a second finger

- **WHEN** 筆模式關閉，過短的自由畫筆還在進行，第二根手指按下
- **THEN** 這筆進行中的自由畫筆被捨棄

#### Scenario: Finger draws while pen mode is off

- **WHEN** 筆模式關閉，手指用矩形工具拖曳
- **THEN** 產生一個矩形
