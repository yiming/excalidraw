# Proposal

## Why

- 檔案瀏覽器／工作區先做本地儲存。Google Drive 排在後面。
- 本地不能無限累積檔案與頁面。這次只記錄政策，不實作。

## What Changes

- 順序是 2a 然後 2b。2a 是本地檔案庫。2b 才是 Google Drive。
- 本地儲存最多 5 個檔案，且所有檔案合計最多 20 頁。兩個上限一起生效。2a 與 2b 都沿用這組上限。
- 允許的例子：5 個檔各 4 頁、2 個檔各 10 頁、1 個檔 20 頁。
- 達到上限時（例如新建檔案或新增一頁）不新增該檔或該頁，並提示刪除或匯出。
- 2a 的匯出是匯出成檔案，例如下載 `.excalidraw`。2a 沒有 Google Drive。
- 2b 在 2a 之後。檔案存進本地後提供「移到 Google Drive」。這是先本地、後 Drive 的標準流程。
- 完成「移到 Google Drive」後，移除本地複本，並釋出該檔佔用的檔案名額與頁數。
- 2b 達到上限時，提示在刪除之外提供「移到 Google Drive」。2a 沒有這個選項。
- 不改現有單張畫布的儲存行為。檔案瀏覽器尚未存在。

## Capabilities

### New Capabilities

- `local-storage-limits`：未來檔案瀏覽器的本地檔案數與總頁數上限。2a 提示刪除或匯出成檔案；2b 才提供「移到 Google Drive」，完成後釋出本地名額。

### Modified Capabilities

- 無。`openspec/specs/` 還沒有既有能力。

## Impact

- 2a 只影響本地檔案庫。2b 才提供「移到 Google Drive」，並在上限提示中與刪除並列。
- 移動會釋出本地名額，但不取消 5 個檔與合計 20 頁的上限。
- 本變更沒有實作任務在進行。
