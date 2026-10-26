# 2026-10-26 整理（Part 1）

這是文件整理，不是實作。架構同意之前不寫功能程式。

相關紀錄：[`journal/2026-10-26.md`](../journal/2026-10-26.md)、[`docs/README.md`](./README.md)。

## Goals

做一個適合 iPad 的 Excalidraw fork。

- Apple Pencil 的壓力與傾斜。
- 簡易的動畫編輯與播放。
- iPad 與桌面同步，供線上教學使用：iPad 當白板，筆電分享螢幕。
- 分頁／投影片（paging／slides）。這是開發目標第 2 項，規格在 `openspec/changes/add-multipage-slides/`。
- 開發方式走 GitHub：只用分支，不直接改 `master`；每個正式變更用 OpenSpec 記錄；角色為 architect、implementer、tester、recorder。

## Design principles

- 簡單不可退讓。這是課堂白板，操作不可以變複雜。
- iPad 上的 Apple Pencil 與手指優先。桌面可用，但 iPad 體驗優先。
- 互動保持少：直接畫、簡單手勢、選項少。
- 動畫 PoC 遵守同一套規則，只用 Apple Pencil 與手指。
- Excalidraw 本身要做必要的 iPad 調整。
- 介面上不放進階選單。

## Advanced features

底層資料庫保留 Flash 等級的能力。畫面上只露出約 5 個基本選項（觸控與 Apple Pencil）。這是參考值，不是固定數量。

進階用法只透過 AI，可以打字或用語音。AI 產生動作呼叫腳本（action-calling scripts），再記成時間軸（timeline）與關鍵影格（keyframes）。

時間軸、圖層、關鍵影格與屬性可以有一個唯讀檢視器。它只在 beta 提供，正式版拿掉，而且不能用來編輯。

## Animation approach

不做逐格動畫（frame-by-frame）。關鍵影格是藏起來的底層機制。

路徑用 A–B–C 點。移動、縮放、旋轉由這些點之間自動補間（auto-tweening）。折線再平滑成曲線。

拖曳錄製（drag-to-record）時，手勢路徑會簡化成動畫路徑。

投影片借鏡 PowerPoint：每一頁是一個大的關鍵影格，頁與頁之間可以補間。這和 Flash 的場景不同；Flash 的場景之間不能補間。

預設動作只提供簡單選項，例如 Zoom In、Slide In／Slide Out。
