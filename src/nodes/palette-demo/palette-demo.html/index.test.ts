import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it, vi } from "vitest";

// index.ts runs in the browser against a global `RED`; fake just what it uses.
const registerType = vi.fn();
vi.stubGlobal("RED", { nodes: { registerType } });

const html = (file: string) =>
  readFileSync(new URL(file, import.meta.url), "utf8");

describe("palette-demo editor", () => {
  let type: string;
  let def: { label: (this: { name?: string }) => string };

  // Keep the call: Vitest clears mock history before each test.
  beforeAll(async () => {
    await import("./index");
    [type, def] = registerType.mock.calls[0];
  });

  it("registers the node type", () => {
    expect(type).toBe("palette-demo");
    expect(def).toMatchObject({ category: "function", inputs: 1, outputs: 1 });
  });

  it("labels the node with its name, or the type when unnamed", () => {
    expect(def.label.call({ name: "my demo" })).toBe("my demo");
    expect(def.label.call({ name: "" })).toBe("palette-demo");
  });

  // Node-RED links these templates to the node by type name.
  it("ties the edit form and help text to the node type", () => {
    expect(html("editor.html")).toContain('data-template-name="palette-demo"');
    expect(html("help.html")).toContain('data-help-name="palette-demo"');
  });
});
