# Proposal

## Why

- 開發目標第 3 項是簡單的本地 workspace。檔案只放在瀏覽器的 IndexedDB，沒有 Google Drive。

## What Changes

- 選單有 Workspace，可以開啟檔案與新建檔案。畫布不再提供這兩個動作，與目標第 2 項 `add-multipage-slides` 相同。
- 新建時選無限畫布或 slide。slide 的紙張尺寸、頁數、背景色與檔名依該規格，這裡不另寫。
- 開啟、儲存、匯出是否移進 Workspace，等看過介面再決定。
- 本地是兩個檔案，每個檔案最多 10 頁，計入的頁數合計最多 20 頁。已滿時顯示軟警告，讓使用者選擇刪除舊檔或匯出，不擋住該動作。
- 暫時決定：無限畫布的頁目前不計入這 20 頁。先不要那麼嚴格，以後再審查。
- 無限畫布不計入兩個檔案的上限。
- Google Drive 與「移到 Drive」不在這個目標。

## Capabilities

### New Capabilities

- `local-workspace`：選單裡的本地 Workspace，以及兩個檔案、每個檔案最多 10 頁、計入合計 20 頁的上限。無限畫布的頁暫時不計入這 20 頁。

### Modified Capabilities

- 無。`openspec/specs/` 還沒有已接受的能力規格。

## Impact

- 選單中的 Workspace，以及瀏覽器本地的檔案數量。
- 不包含 Google Drive。
- 新建 slide 的細節不在本變更重寫。
