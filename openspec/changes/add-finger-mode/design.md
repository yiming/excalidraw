# Design

## Context

見 `proposal.md` 的 Why。上游已經有 `penMode` 與 `penDetected`：`App.handleCanvasPointerDown` 在第一個 `pointerType === "pen"` 時把兩者設為 true，`togglePenMode` 也寫入同一組狀態。`allowOnPointerDown` 在筆模式裡仍放行選取、套索、文字與圖片的觸控。雙指縮放在自由畫筆加上筆模式時把 `scaleFactor` 寫死為 1。單指平移只存在手形工具、空白鍵與檢視模式，筆模式沒有。

`gesture.pointers` 是模組層的對照表。第二個指標按下時會先跑 missing-pointerup 清理，但清理用的是新事件的 `pointerId`，先放下的手指可能留在表裡。筆再移動時就被當成雙指手勢，這是 [excalidraw#9945](https://github.com/excalidraw/excalidraw/issues/9945) 筆卡在平移／縮放的原因。第二根手指中止過短自由畫筆是 [excalidraw#6440](https://github.com/excalidraw/excalidraw/issues/6440) 已關閉議題的既有行為。

## Goals / Non-Goals

**Goals:**

- 筆模式的手指只平移（一根）與捏合縮放（兩根）。
- 筆與手指同時接觸時，手勢表與進行中的筆畫不會卡住。
- 手動開關放在更多工具選單，並複用 `penMode`。
- 決策與指標分支可以單測，不依賴實機 iPad。

**Non-Goals:**

- 不改筆模式關閉時的觸控繪圖，也不改滑鼠。
- 不新增第二套「手指模式」狀態、不改場景檔、不做壓力或傾斜。
- 不放大變形把手，不加嵌入端 API。
- 不把既有工具列上的筆模式按鈕拿掉。那個按鈕只在 `penDetected` 之後出現，拿掉會改變既有畫面。

## Decisions

### 複用 `penMode`，不另建狀態

`penMode` 的意思就是「筆在畫，手指不要誤觸」。這次要的手指行為是同一件事的完整版：誤觸從「部分工具仍可拖物件」收成「手指只移動畫面」。`penDetected` 繼續表示「看過筆，或使用者手動開過」，`togglePenMode` 本來就會把 `penDetected` 設為 true，選單才不會在手動開啟後把開關藏起來。

另建 `fingerMode` 會和自動偵測、本地還原、既有按鈕各寫一份。沒有出現必須拆開的行為，所以不拆。

### 手指能不能操作工具，收成純函式

`fingerMayUseTool`、`shouldStartSingleFingerPan`、`pinchZoomScaleFactor`、`shouldIgnoreConcurrentTouch`、`shouldReleaseTouchGestureForPen`、`shouldAbortFreedrawForExtraTouch` 放在 `packages/excalidraw/components/penModePointer.ts`。`App` 只負責呼叫與改狀態。單測鎖這些分支，元件測試鎖畫布結果。

判斷放在選取工具的 pointer down 之前。現在的 `allowOnPointerDown` 在選取處理之後，所以選取、套索仍會吃掉手指。筆模式的觸控在那之前就返回。

### 單指平移走既有 `AppPan`

對應 Obsidian Excalidraw 的 `penModeSingleFingerPanning`，以及 [excalidraw#8785](https://github.com/excalidraw/excalidraw/issues/8785)。不另寫一套捲動。`AppPan.start` 增加 `force`：筆模式、觸控、目前最多一個指標、且沒有筆按著時，用和手形工具相同的工作階段平移，並把後續 move 鎖在該 `pointerId`。第二根手指按下時，既有的 pointer down 清理會 `pan.end()`，雙指改由既有的多指手勢接手。滑鼠、手形工具、空白鍵、檢視模式的啟動條件不變。

### 雙指縮放看手勢裡有沒有筆

對應未合併的 [excalidraw#11536](https://github.com/excalidraw/excalidraw/pull/11536)，只吸收規則，不搬那份 diff。拿掉「自由畫筆且筆模式就把縮放係數設為 1」。另用一張 `pointerId → pointerType` 對照（不放進公開的 `Gesture` 值，避免改 `onPointerUpdate` 的 `pointersMap`）。係數只在對照裡有 `pen` 時為 1。平常兩根手指、筆已抬起，即使工具是自由畫筆也縮放。

### 同時接觸

- 筆按下時，若手勢表裡還有觸控，先清掉那些觸控並結束單指平移，再讓筆進入工具流程。這樣筆不會因為表裡留下的手指而一直滿足 `pointers.size > 1`（#9945）。筆模式開或關都做這一步，因為卡住發生在兩種情況；沒有手指殘留時，滑鼠與單指繪圖的路徑不變。
- 筆模式中，用同步的 `activePenPointerId` 記錄正在按下的筆。這段期間的觸控直接返回：不進手勢表、不清理筆畫、不平移。窗口上的 move／up 也在節流前記濾掉，避免手掌移動蓋掉同一幀裡已經排好的筆移動。這是 [excalidraw#12397](https://github.com/excalidraw/excalidraw/pull/12397) 的行為。原 PR 只看 `lastPointerDownWith === "pen"` 且 `newElement` 是自由畫筆；這裡放寬到「筆模式且這支筆還按著」的所有工具，因為手掌一樣會打斷選取拖曳。範圍仍只在筆模式。
- 筆模式關閉時，第二根手指碰到進行中的自由畫筆，繼續走 #6440：筆畫很短就捨棄。`shouldAbortFreedrawForExtraTouch` 在筆自己畫的那一筆上不成立，避免和上一條互相取消。

第一個筆事件的 `setState` 是非同步的。`penDetected` 仍為 false 且 `activePenPointerId` 已記下時，視為筆模式已經生效，同一筆期間的手掌不會漏判。

### 開關放在更多工具

桌面 `Toolbar` 與手機 `MobileToolbar` 的三點選單都放同一個 `PenModeMenuItem`，緊接在雷射筆之後。使用既有 `DropdownMenu.ItemCheckbox`：勾選圖示加上 `aria-pressed` 表示開或關，`selected` 用現成的選取底色。點下去 `preventDefault`，選單保持打開，手指才看得見狀態切換。列高至少 44px。文案沿用 `toolBar.penMode`，英文與繁體中文改成說明手指會平移與縮放；其他語系暫時留舊譯文。

`togglePenMode(null)` 繼續反轉 `penMode`。不新做 action。

### 上游 PR 的取捨

- **#12397（手掌不要打斷筆畫）：採納行為，自己寫。** 這就是手指／手掌友善，改動停在指標過濾，風險低。實機手寫筆仍沒測，邏輯用元件測試鎖。
- **#12146（可放大的變形把手）：只引用，不併入。** 它是嵌入端的 `UIOptions.canvasHandleScale`，預設 1、範圍 1–2，動到選取與線段把手的繪製和命中，約十幾個檔案。筆與觸控本來就有最小把手。API 名稱上游還沒定。這不是筆模式的指標規則，也不算低風險，超出「只做手指友善」的範圍。

### 長按選單

筆模式開啟時，手指長按不再打開畫布選單。手指在這個模式只平移與縮放。筆模式關閉時的長按不變。

## Risks / Trade-offs

- [筆模式使用者原本用手指拖選取物件] → 這是規格要的改變，只發生在 `penMode === true`。關掉筆模式就回到舊行為。
- [實機手掌可能被瀏覽器報成兩點觸控，或筆被報成 `touch`] → 與 #11536 相同的已知限制。筆被報成 touch 時無法區分，不在這次猜測。元件測試涵蓋我們看得到的 `pointerType`。
- [單指平移與雙指縮放交界] → 第二指按下時結束 `AppPan`，避免兩套邏輯一起改捲動。剩下的那根手指要再按下才會開始新的單指平移。
- [尚未在 iPad 上點過] → 測試用 jsdom 的 pointer 事件。實機是後續確認，不擋住這次分支。

## Migration Plan

沒有檔案或狀態遷移。`penMode` 仍寫在瀏覽器本地狀態。回退就是還原這次的指標分支與選單項目。

## Open Questions

沒有會改規格或任務拆分的未決問題。實機手感留到有 iPad 時再看，不改這次的分支。
