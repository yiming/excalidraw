import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../public/sw-navigate-clients.js"),
  "utf8",
);

const loadWorker = (active: boolean) => {
  const navigated: string[] = [];
  const listeners = new Map<
    string,
    (event: { waitUntil: (p: Promise<void>) => void }) => void
  >();
  const self = {
    registration: { active: active ? {} : null },
    clients: {
      claim: async () => undefined,
      matchAll: async () => [
        {
          url: "https://yiming.github.io/excalidraw/#room=1",
          navigate: async (url: string) => {
            navigated.push(url);
          },
        },
        {
          url: "https://yiming.github.io/excalidraw/library",
          navigate: async () => {
            throw new Error("cannot navigate");
          },
        },
      ],
    },
    addEventListener: (
      type: string,
      fn: (event: { waitUntil: (p: Promise<void>) => void }) => void,
    ) => {
      listeners.set(type, fn);
    },
  };
  vm.runInNewContext(source, { self, Promise });
  return {
    navigated,
    activate: () => {
      const pending: Promise<void>[] = [];
      listeners.get("activate")?.({
        waitUntil: (promise) => {
          pending.push(promise);
        },
      });
      return Promise.all(pending);
    },
  };
};

describe("service worker update navigation", () => {
  it("reloads open windows once when a previous worker was active", async () => {
    const worker = loadWorker(true);
    await worker.activate();
    expect(worker.navigated).toEqual([
      "https://yiming.github.io/excalidraw/#room=1",
    ]);
  });

  it("does not reload windows on the first install", async () => {
    const worker = loadWorker(false);
    await worker.activate();
    expect(worker.navigated).toEqual([]);
  });
});
