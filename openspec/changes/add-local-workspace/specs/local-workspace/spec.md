# Spec Delta

## Purpose

開發目標第 3 項：選單裡的 Workspace 只使用瀏覽器本地儲存。兩個檔案，每個檔案最多 10 頁，計入的頁數合計最多 20 頁。無限畫布的頁暫時不計入這 20 頁。

## ADDED Requirements

### Requirement: Workspace matches the slide spec

選單 SHALL 有 Workspace，可以開啟檔案與新建檔案。畫布 MUST NOT 再提供這兩個動作。這與 `add-multipage-slides` 相同。新建時 SHALL 選擇無限畫布或 slide。slide 的紙張尺寸、頁數、背景色與檔名 SHALL 依該規格，本需求不另定。

#### Scenario: The menu entry opens or creates a file

- **WHEN** 使用者從選單進入 Workspace
- **THEN** 可以開啟檔案或新建檔案

#### Scenario: The canvas does not open or create files

- **WHEN** 使用者在畫布上尋找開啟檔案或新建檔案
- **THEN** 畫布沒有這兩個動作

#### Scenario: A new slide uses the goal-2 details

- **WHEN** 使用者新建 slide
- **THEN** 紙張尺寸、頁數、背景色與檔名依多頁 slide 規格

### Requirement: Files stay on local browser storage

這個目標的檔案 SHALL 存在瀏覽器本地。本目標 MUST NOT 包含 Google Drive，也 MUST NOT 包含「移到 Drive」。

#### Scenario: Drive is not available

- **WHEN** 使用者使用這個 Workspace
- **THEN** 沒有 Google Drive，也沒有「移到 Drive」

### Requirement: Open save and export are not moved yet

開啟、儲存、匯出是否移進 Workspace，本目標 MUST NOT 決定。該決定 SHALL 等看過 Workspace 介面之後。

#### Scenario: Those actions stay undecided

- **WHEN** 使用者查看這個目標的 Workspace
- **THEN** 規格沒有把開啟、儲存、匯出移進 Workspace

### Requirement: Local storage holds two files and twenty pages

計入的檔案 MUST NOT 超過 2 個。每個檔案 MUST NOT 超過 10 頁。計入的頁數合計 MUST NOT 超過 20。無限畫布的頁暫時 MUST NOT 計入這 20 頁。這是暫時決定，以後再審查。已滿時 SHALL 提示使用者刪除或匯出。無限畫布的檔案是否計入這 2 個檔，本需求不決定。

#### Scenario: Two files of ten pages fill the total

- **WHEN** 本地有兩個各 10 頁的 slide 檔
- **THEN** 計入的頁數是 20

#### Scenario: An eleventh page is over the per-file limit

- **WHEN** 一個檔案已有 10 頁
- **THEN** 第 11 頁超過該檔上限

#### Scenario: An infinite canvas page is outside the total for now

- **WHEN** 本地有一個無限畫布
- **THEN** 它的頁不計入合計 20 頁，此計算以後再審查

#### Scenario: A full library prompts delete or export

- **WHEN** 本地儲存已滿
- **THEN** 提示刪除或匯出，且不提供 Google Drive
