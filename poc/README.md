# poc/

獨立的概念驗證（proof of concept）放在這裡。這些小專案不以 Excalidraw 主程式為基礎，各自有自己的資料夾、套件與依賴，先單獨證明可行，再考慮帶回 `master`。

Standalone proof-of-concept projects live here. They are not part of the Excalidraw application. Each experiment has its own folder, package, and dependencies, and is proven on its own before anything is brought back to `master`.

例如動畫編輯器可以做成 `poc/animation-editor/`，而不是直接改 `packages/` 或 `excalidraw-app/`。

## 慣例 / Conventions

- 資料夾使用小寫 kebab-case，一個 PoC 一個目錄，例如 `poc/animation-editor/`。
- 每個 PoC 自備 `README.md`，至少寫明 goal（目標）、status（狀態）、how to run（如何執行）。
- 每個 PoC 自備 `package.json` 與鎖定檔，不要加進根目錄的 Yarn workspaces。
- 分支使用 `poc/` 前綴，例如 `poc/animation-editor`。不要直接在 `master` 上改。
- 主線整合要等架構同意，並另開分支。PoC 證明通過之前不要改 Excalidraw 原始碼。

## 與根目錄工具的關係 / Root tooling

建立這個目錄時核對過根設定，沒有為了 `poc/` 修改 `package.json`、`tsconfig.json`、`vitest.config.mts` 或 ESLint 設定。

- Yarn workspaces 只包含 `excalidraw-app`、`packages/*`、`examples/*`。`poc/` 不在其中。
- `tsconfig.json` 的 `include` 只有 `packages` 與 `excalidraw-app`。`yarn test:typecheck` 不會檢查這裡。
- 根目錄 ESLint（`yarn test:code`）只掃 `.js`、`.ts`、`.tsx`。目前這裡只有 Markdown，不會被掃到。
- 根目錄 Vitest 使用預設的 `**/*.{test,spec}.*`。目前沒有測試檔，所以不會被收集。

之後若某個 PoC 放入 `.js` / `.ts` / `.tsx` 或 `*.test.*`，根目錄的 `yarn test:code` 與 `yarn test` 才可能掃到它們。到那時再考慮把 `poc` 加進忽略清單。現在沒有對應檔案，所以不加。PoC 的測試應在自己的目錄執行。GitHub Actions 範本見 `.github/workflows/poc-and-pages-template.yml`。
