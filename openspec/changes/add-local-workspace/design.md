# Design

## Context

- 這是開發目標第 3 項。
- Workspace 的入口，以及新建無限畫布或 slide 的細節，以 `add-multipage-slides` 為準。本檔不另寫一套。
- 5 個檔與合計 20 頁的數字，既有紀錄在 `add-local-storage-limits`。該變更還寫了提示時機與「移到 Google Drive」。那些不是這個目標的決定。

## Goals / Non-Goals

**Goals:**

- 檔案存在瀏覽器本地。
- 選單的 Workspace 可開啟檔案與新建檔案。
- 新建類型與 slide 的紙張、頁數、背景色、檔名沿用目標第 2 項。
- 本地最多 5 個檔，合計最多 20 頁。已滿時提示刪除或匯出。

**Non-Goals:**

- 沒有 Google Drive。
- 沒有「移到 Drive」。
- 不在這裡決定 localStorage 或 IndexedDB。
- 不在這裡決定開啟、儲存、匯出是否移進 Workspace。

## 延後項目

- 開啟、儲存、匯出是否移進 Workspace：先擱置，等看過 Workspace 介面再決定。與目標第 2 項相同。
- Google Drive 與「移到 Drive」以後再做，不在這個目標。

## 待確認問題

- 目標第 2 項的 slide 起始頁數是最少 1、最多 20、預設 10。單一 slide 檔不會超過本地合計 20 頁。兩個預設各 10 頁的 slide 檔會把合計 20 頁用完。這兩個上限要怎麼一起用，尚未決定。
- 無限畫布如何計入合計 20 頁。目標第 2 項說它是單頁。
- 本地儲存用 localStorage 還是 IndexedDB。
- 「已滿」提示在新建、加頁或其他時機出現，以及提示怎麼說。`add-local-storage-limits` 已寫新建與加頁時的提示。這裡不把那段當成決定。
