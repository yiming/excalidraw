# Design

## Context

- 這是開發目標第 2 項。設定頁與手指模式的規格在 `add-ipad-settings-page` 與 `add-finger-mode`。
- 本檔只記錄已寫明的範圍、參考、限制，以及尚未決定的問題。參考不是設計決定。

## Goals / Non-Goals

**Goals:**

- 選單有「Workspace」，可開啟檔案與新建檔案。畫布上不再做這兩件事。
- 新建時選無限畫布或 slide。slide 再選紙張尺寸與起始頁數。新建時還要選背景色並輸入檔名。
- 有頁面尺寸的檔案是多頁。無限畫布是單頁。尺寸在建立後鎖定。
- 右下角換頁列取代勾選（盾牌）按鈕。盾牌的安全／加密資訊改到設定的關於。問號按鈕與左下角的縮放百分比、重做、復原保留。

**Non-Goals:**

- 不在這個目標裡選擇檔案位置。那是以後的事。
- 不把研究裡的做法收成設計。跨頁補間是否要做，見待確認問題。

## 參考

這些只是參考，不是本目標已採用的設計。

- Excalidraw Smart Presentation（https://github.com/excalidraw-smart-presentation/excalidraw-smart-presentation.github.io）。研究筆記：多頁／投影片研究（2026-10-27）。它用 frame 當投影片，跨頁元素用 `customData` 裡的名字配對，頁與頁之間有平滑過渡。
- excalidraw-claymate（https://github.com/dai-shi/excalidraw-claymate）。同一份研究。它是一頁一個 scene。
- 上游 PR #12157（https://github.com/excalidraw/excalidraw/pull/12157）。研究筆記：Excalidraw+ 簡報尺寸（2026-10-27）。它的尺寸預設有 16:9、4:3、16:10、tablet、phone，並有直式／橫式切換。那些預設不是本目標的紙張清單。

## 限制

- 不要在動畫的每一幀更新 scene。那會灌爆 undo，並觸發同步與存檔。
- 不要做出原版 Excalidraw 打不開的檔案格式。

## 待確認問題

- 開啟、儲存、匯出是否以後也移進 Workspace。這次不決定。
- 跨頁補間是否屬於這個目標。上面的平滑過渡只是參考。
- 每個紙張尺寸的實際寬高，以及「iPad 螢幕尺寸」指哪一種 iPad。PR #12157 的像素不是決定。
- 一頁在檔案裡是一個 scene，還是同一個 scene 裡的一個 frame。兩種都只是參考。
- 刪除頁面的操作放在哪。規格只要求之後可以刪除。換頁列列出的是上一頁、下一頁、新增頁、頁碼下拉。
- 起始頁數的下限與上限。
- 在第一頁按上一頁，或在最後一頁按下一頁時怎麼辦。
- 之後修改背景色的入口在哪。
- 無限畫布新建時要不要選起始頁數。它已定義為單頁。
- 無限畫布開啟時，右下角要不要顯示換頁列。勾選（盾牌）按鈕則離開該位置。
