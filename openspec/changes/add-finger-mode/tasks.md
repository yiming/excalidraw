# Tasks

## 1. 指標規則

- [ ] 1.1 新增 `penModePointer` 純函式（工具可否由手指操作、單指平移、捏合係數、同時接觸、過短筆畫中止），並以 vitest 覆蓋開／關與筆、觸控、滑鼠組合。完成時 `penModePointer` 單元測試通過。
- [ ] 1.2 筆模式的觸控在選取處理前返回，單指走 `AppPan`，雙指恢復縮放，筆按下時清掉殘留觸控並忽略後到的觸控。完成時 `penMode` 元件測試通過，且既有 `regressionTests` 的雙指案例仍通過。

## 2. 更多工具開關

- [ ] 2.1 在桌面與手機的更多工具選單加入筆模式勾選項，顯示開或關，並切換既有 `penMode`。列高跟隨設定頁尺寸段位，不寫死 44px。完成時元件測試能在選單裡打開與關閉，且 `aria-pressed` 跟著變。
- [ ] 2.2 四段尺寸（小、中、大、特大，預設大）的像素與實作任務在 `openspec/changes/add-ipad-settings-page/tasks.md` 的 3.2。本變更不把按鈕或控制點做成單一 44px。若程式裡先出現固定 44px，必須改成段位。

## 3. 靜態檢查

- [ ] 3.1 對改過的 TypeScript 跑 eslint，並對相關測試檔跑 vitest。完成時這兩項沒有新增的錯誤。
- [ ] 3.2 跑 `yarn test:typecheck`。完成時指令成功。

## Workflow follow-up

- 在 iPad 上用 Apple Pencil 與手指確認單指平移、雙指縮放，以及手掌按在進行中的筆畫上。這次不擋合併前置。
- 變更被接受後再歸檔到 `openspec/changes/archive/`，並把 delta 寫進 `openspec/specs/pen-mode-input/spec.md`。
