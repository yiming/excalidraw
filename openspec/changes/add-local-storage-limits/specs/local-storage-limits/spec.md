# Spec Delta

## Purpose

先以第二階段 2a 限制檔案瀏覽器的本地儲存：最多 2 個檔案，每個檔案最多 10 頁，計入的頁數合計最多 20 頁。無限畫布的頁暫時不計入這 20 頁。2b 在存檔後提供「移到 Google Drive」，完成後移除本地複本並釋出名額；達到上限時與刪除並列。

## ADDED Requirements

### Requirement: At most two local files

計入檔數的本地檔案 MUST NOT 超過 2。此上限與每個檔案最多 10 頁、計入頁數合計最多 20 SHALL 同時生效。2a 與 2b SHALL 都遵守它。無限畫布的檔案是否計入這 2 個檔，本需求不決定。

#### Scenario: A second file is allowed

- **WHEN** 本地已有 1 個計入檔數的檔案，新檔與既有檔各自不超過 10 頁，且計入的頁數合計仍不超過 20
- **THEN** 可以建立第 2 個檔案

#### Scenario: A third counted file warns without blocking in phase 2a

- **WHEN** 處於 2a，本地已有 2 個計入檔數的檔案，且使用者要新建另一個計入檔數的檔案
- **THEN** 不擋住該動作，並顯示軟警告，讓使用者選擇刪除舊檔或匯出成檔案（例如 `.excalidraw`），且不提供 Google Drive

### Requirement: At most ten pages per file and twenty counted pages

每個檔案的頁數 MUST NOT 超過 10。計入合計的頁數 MUST NOT 超過 20。無限畫布的頁暫時 MUST NOT 計入這 20 頁。這是暫時決定，以後再審查。2a 與 2b SHALL 都遵守這些上限。

#### Scenario: Two full files stay inside the total

- **WHEN** 本地是 2 個檔各 10 頁
- **THEN** 這個組合可以存在

#### Scenario: An eleventh page in one file warns without blocking in phase 2a

- **WHEN** 處於 2a，一個檔案已有 10 頁，且使用者要再新增一頁
- **THEN** 不擋住該動作，並顯示軟警告，讓使用者選擇刪除舊檔或匯出成檔案（例如 `.excalidraw`），且不提供 Google Drive

#### Scenario: A twenty-first counted page warns without blocking in phase 2a

- **WHEN** 處於 2a，計入的頁數合計已有 20，且使用者要再新增一頁計入的頁
- **THEN** 不擋住該動作，並顯示軟警告，讓使用者選擇刪除舊檔或匯出成檔案（例如 `.excalidraw`），且不提供 Google Drive

#### Scenario: An infinite canvas page is not counted yet

- **WHEN** 本地有一個無限畫布
- **THEN** 它的頁不計入合計 20 頁

### Requirement: The limits apply together

檔案數少於 2 時，每個檔案仍 MUST NOT 超過 10 頁，計入的頁數合計仍 MUST NOT 超過 20。計入的頁數合計少於 20 時，計入檔數的檔案仍 MUST NOT 超過 2。

#### Scenario: One file at ten pages warns without blocking

- **WHEN** 處於 2a，只有 1 個檔案且已有 10 頁，使用者要再新增一頁
- **THEN** 不擋住該動作，並顯示軟警告，讓使用者選擇刪除舊檔或匯出成檔案，且不提供 Google Drive

#### Scenario: Two small files warn without blocking

- **WHEN** 處於 2a，已有 2 個計入檔數的檔案且計入的頁數合計少於 20，使用者要新建另一個計入檔數的檔案
- **THEN** 不擋住該動作，並顯示軟警告，讓使用者選擇刪除舊檔或匯出成檔案，且不提供 Google Drive

### Requirement: Phase 2b limit prompt offers move beside delete

2b MUST 排在 2a 之後。達到上限時，2b 的提示 SHALL 在刪除之外提供「移到 Google Drive」，並 MUST NOT 放寬 2 個檔、每個檔案 10 頁，或計入合計 20 頁。2a MUST NOT 提供這一項。2a 的匯出成檔案仍可使用。

#### Scenario: The limit prompt offers move in phase 2b

- **WHEN** 處於 2b，且新建檔案或新增一頁會超過任一上限
- **THEN** 不擋住該動作，並顯示軟警告，提示提供刪除以及「移到 Google Drive」

#### Scenario: Phase 2a has no move option

- **WHEN** 處於 2a，且新建檔案或新增一頁會超過任一上限
- **THEN** 提示可以刪除或匯出成檔案，且沒有「移到 Google Drive」

### Requirement: Move to Google Drive is the standard 2b workflow

檔案存進本地之後，2b SHALL 提供「移到 Google Drive」。這是先本地、後 Drive 的標準流程。完成後 SHALL 把該檔從本地移到 Google Drive、移除本地複本，並釋出它佔用的檔案名額與頁數。2a MUST NOT 提供這個選項。

#### Scenario: Offer move after a local save

- **WHEN** 處於 2b，且一個檔案已經存進本地
- **THEN** 提供「移到 Google Drive」

#### Scenario: A completed move frees the local slot

- **WHEN** 使用者對一個本地檔案完成「移到 Google Drive」
- **THEN** 本地不再有該檔，它的檔案名額與頁數不再計入 2 個檔、每個檔案 10 頁與計入合計 20 頁

#### Scenario: Phase 2a does not offer move after save

- **WHEN** 處於 2a，且一個檔案已經存進本地
- **THEN** 不提供「移到 Google Drive」
