# docs/

這個 fork（`yiming/excalidraw`）的討論備忘。一篇一個主題，記錄背景、取捨與尚未決定的問題。

這裡不是正式規格，也不是日記：

- 有日期的討論過程與決定寫在 `journal/`。
- 要實作的規格寫在 `openspec/`。
- 可執行的實驗寫在 `poc/`。

根目錄原先沒有 `docs/`。上游的開發文件在 `dev-docs/`（其下有 `dev-docs/docs/`），那裡是 Excalidraw 本體的文件站，這個分支沒有改它。

## 最上層目錄

對過上游 `excalidraw/excalidraw` 與本 fork 的 `master`。目錄在 `ipad-features` 或今天的 PR #1 才出現，標為本 fork；上游已有的標為上游。

| 目錄 | 來源 | 用途 |
| --- | --- | --- |
| `docs/` | 本 fork | 討論備忘：本頁、REA 使用規範、2026-10-26 整理、計畫、分支與發布流程 |
| `journal/` | 本 fork | 有日期的開發日記 |
| `openspec/` | 本 fork | OpenSpec：`config.yaml`、`project.md`。`specs/` 與 `changes/` 目前只有 README 與佔位，架構同意前沒有正式規格 |
| `poc/` | 本 fork | 獨立概念驗證的說明；目前只有 README |
| `.claude/` | 本 fork | 四個角色的 agent 檔，以及留給以後的 commands、skills、hooks。`.gitignore` 已調整，才追蹤這些共用檔 |
| `.github/` | 上游 | GitHub 設定與既有 CI。本 fork 另加 `deploy-pages.yml`（PR #1，已在 `master`）與 `poc-and-pages-template.yml`（在 `ipad-features`） |
| `dev-docs/` | 上游 | 官方開發文件站，Docusaurus，約 71 個檔，含 API 文件。本分支沒有改 |
| `excalidraw-app/` | 上游 | excalidraw.com 的網頁應用 |
| `packages/` | 上游 | 核心套件：common、element、excalidraw、math、utils 等 |
| `examples/` | 上游 | 整合範例，含 Next.js 與瀏覽器 script |
| `scripts/` | 上游 | 建置、版號、語系覆蓋率與發布腳本 |
| `public/` | 上游 | 網站用的靜態檔：字型、圖示、截圖 |
| `firebase-project/` | 上游 | 協作後端的 Firebase 規則與設定 |
| `.husky/` | 上游 | Git hooks（pre-commit） |
| `.codesandbox/` | 上游 | CodeSandbox 的開發環境設定 |
