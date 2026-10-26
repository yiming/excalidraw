# .claude/

這個 fork 的 Claude Code 專案設定。Subagent 放在 `agents/`，以後的 commands、skills、hooks 各自留有空目錄。

## 角色

| 檔案 | 名稱 | 做什麼 |
| --- | --- | --- |
| `agents/architect.md` | architect | 定義 Apple Pencil 與動畫功能的整體計畫與架構 |
| `agents/implementer.md` | implementer | 在 `poc/` 寫概念驗證；架構同意後才在功能分支寫主線 |
| `agents/tester.md` | tester | 跑驗證，並在這個 fork 開 GitHub issue |
| `agents/recorder.md` | recorder | 維護 `openspec/changes/` 與 `openspec/specs/` |

每個 agent 是一個 Markdown 檔：最上面是 YAML frontmatter（`name`、`description`、`tools`），接著是系統提示。

## 交接

1. `architect` 讀 `journal/`、`docs/` 與現有 `openspec/`，提出架構。架構同意之前，沒有人寫功能程式。
2. `recorder` 把同意的範圍寫進 `openspec/changes/`。完成並歸檔時，才更新 `openspec/specs/`。
3. `implementer` 依該變更在 `poc/<name>/` 做獨立小專案，分支使用 `poc/<name>`。要進主線時另開功能分支，不直接改 `master`。
4. `tester` 驗證 PoC 或該分支，失敗就在 `yiming/excalidraw` 開 issue。
5. `recorder` 把結果寫回 OpenSpec。若結果和計畫不符，回到 `architect` 修計畫，再決定要不要繼續寫程式。

`poc/` 是可執行的實驗，`openspec/` 是該不該做、做成什麼的正式紀錄。實驗沒有對應的 OpenSpec 變更，就不帶進主線。

## 保留目錄

- `commands/`：以後的 slash commands
- `skills/`：以後的 skills
- `hooks/`：以後的 hooks

三個目錄現在只有說明用的 README。
