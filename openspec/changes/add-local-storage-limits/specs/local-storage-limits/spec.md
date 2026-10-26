# Spec Delta

## Purpose

先以第二階段 2a 限制檔案瀏覽器的本地儲存，最多 5 個檔案且合計最多 20 頁。2b 在存檔後提供「移到 Google Drive」，完成後移除本地複本並釋出名額；達到上限時與刪除並列。

## ADDED Requirements

### Requirement: At most five local files

本地儲存的檔案數 MUST NOT 超過 5。此上限與總頁數上限 SHALL 同時生效。2a 與 2b SHALL 都遵守它。

#### Scenario: A fifth file is allowed

- **WHEN** 本地已有 4 個檔案，且合計頁數加上新檔後仍不超過 20
- **THEN** 可以建立第 5 個檔案

#### Scenario: A sixth file is refused in phase 2a

- **WHEN** 處於 2a，本地已有 5 個檔案，且使用者要新建檔案
- **THEN** 不建立該檔案，並提示刪除檔案或頁面，或匯出成檔案（例如 `.excalidraw`），且不提供 Google Drive

### Requirement: At most twenty pages in total

所有本地檔案的頁數合計 MUST NOT 超過 20。此上限與檔案數上限 SHALL 同時生效。2a 與 2b SHALL 都遵守它。

#### Scenario: Combinations inside both limits

- **WHEN** 本地是 5 個檔各 4 頁，或 2 個檔各 10 頁，或 1 個檔 20 頁
- **THEN** 這些組合可以存在

#### Scenario: Another page at twenty is refused in phase 2a

- **WHEN** 處於 2a，合計已有 20 頁，且使用者要新增一頁
- **THEN** 不新增該頁，並提示刪除檔案或頁面，或匯出成檔案（例如 `.excalidraw`），且不提供 Google Drive

### Requirement: The limits apply together

檔案數少於 5 時，頁數合計仍 MUST NOT 超過 20。頁數合計少於 20 時，檔案數仍 MUST NOT 超過 5。

#### Scenario: One file stops at twenty pages

- **WHEN** 處於 2a，只有 1 個檔案且已有 20 頁，使用者要再新增一頁
- **THEN** 不新增該頁，並提示刪除或匯出成檔案，且不提供 Google Drive

#### Scenario: Five small files stop at five files

- **WHEN** 處於 2a，已有 5 個檔案且合計頁數少於 20，使用者要新建檔案
- **THEN** 不建立該檔案，並提示刪除或匯出成檔案，且不提供 Google Drive

### Requirement: Phase 2b limit prompt offers move beside delete

2b MUST 排在 2a 之後。達到上限時，2b 的提示 SHALL 在刪除之外提供「移到 Google Drive」，並 MUST NOT 放寬 5 個檔或合計 20 頁。2a MUST NOT 提供這一項。2a 的匯出成檔案仍可使用。

#### Scenario: The limit prompt offers move in phase 2b

- **WHEN** 處於 2b，且新建檔案或新增一頁會超過任一上限
- **THEN** 不建立該檔或該頁，提示提供刪除以及「移到 Google Drive」

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
- **THEN** 本地不再有該檔，它的檔案名額與頁數不再計入 5 個檔與合計 20 頁

#### Scenario: Phase 2a does not offer move after save

- **WHEN** 處於 2a，且一個檔案已經存進本地
- **THEN** 不提供「移到 Google Drive」
