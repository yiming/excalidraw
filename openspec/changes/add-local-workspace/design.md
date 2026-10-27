# Design

## Context

- 這是開發目標第 3 項。
- Workspace 的入口，以及新建無限畫布或 slide 的細節，以 `add-multipage-slides` 為準。本檔不另寫一套。
- 檔案數與頁數上限也寫在 `add-local-storage-limits`。「移到 Google Drive」不是這個目標的決定。

## Goals / Non-Goals

**Goals:**

- 檔案存在瀏覽器本地的 IndexedDB。
- 選單的 Workspace 可開啟檔案與新建檔案。
- 新建類型與 slide 的紙張、頁數、背景色、檔名沿用目標第 2 項。
- 本地是兩個檔案，每個檔案最多 10 頁，計入的頁數合計最多 20 頁。已滿時顯示軟警告，讓使用者選擇刪除舊檔或匯出，不擋住該動作。
- 暫時決定：無限畫布的頁目前不計入合計 20 頁。先不要那麼嚴格，以後再審查。
- 無限畫布不計入兩個檔案的上限。

**Non-Goals:**

- 沒有 Google Drive。
- 沒有「移到 Drive」。
- 不在這裡決定開啟、儲存、匯出是否移進 Workspace。

## 延後項目

- 開啟、儲存、匯出是否移進 Workspace：先擱置，等看過 Workspace 介面再決定。與目標第 2 項相同。
- Google Drive 與「移到 Drive」以後再做，不在這個目標。
