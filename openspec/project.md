# 專案

`yiming/excalidraw` 是 Excalidraw 的 fork，網站部署在 GitHub Pages：https://yiming.github.io/excalidraw/ 。預設分支是 `master`。

## 目的

做一個適合 iPad 的 Excalidraw。計畫中的能力：

- Apple Pencil：壓力、傾斜
- 簡易動畫編輯與播放
- iPad 與桌面同步（線上教學時，iPad 當白板，筆電分享螢幕）
- 分頁／投影片

## 工作方式

- 不直接改 `master`。功能與實驗都走分支。
- `poc/` 放獨立小專案，各自有套件與依賴，先單獨證明，再考慮帶回主線。PoC 分支使用 `poc/` 前綴。
- 每個正式變更在 `openspec/changes/` 建一筆紀錄，完成後才更新 `openspec/specs/`。
- 架構同意之前不寫功能程式，也不改 `packages/` 或 `excalidraw-app/`。

## 目錄

- `docs/`：討論備忘
- `journal/`：有日期的開發日記
- `openspec/`：規格與變更
- `poc/`：概念驗證
- `.claude/`：agents，以及以後的 commands、skills、hooks

OpenSpec 設定在 `openspec/config.yaml`（schema：`spec-driven`）。這裡的 `project.md` 是給人讀的專案說明；CLI 初始化時不會產生這個檔。
