import type { EventEmitter } from "node:events";
import type { NodeMessage } from "node-red";
import testHelper, { type TestFlows } from "node-red-node-test-helper";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import paletteDemo from "./palette-demo";

// n1 is the node under test; n2 is a helper node that catches its output.
const flows: TestFlows = [
  { id: "n1", type: "palette-demo", name: "demo", wires: [["n2"]] },
  { id: "n2", type: "helper" },
];

// Vitest has no `done` callback, so wrap the helper's callbacks in promises.
const load = (f: TestFlows) =>
  new Promise<void>((resolve) => testHelper.load(paletteDemo, f, resolve));

// Sends `msg` into n1 and resolves with the message n2 receives.
const roundTrip = (msg: NodeMessage) => {
  // Cast: Node's typings only list "input"/"close", not the helper's events.
  const n2 = testHelper.getNode("n2") as EventEmitter;
  const received = new Promise<NodeMessage>((r) => n2.once("input", r));
  testHelper.getNode("n1").receive(msg);
  return received;
};

describe("palette-demo node", () => {
  beforeEach(() => new Promise<void>((r) => testHelper.startServer(r)));

  afterEach(async () => {
    await testHelper.unload();
    await new Promise<void>((r) => testHelper.stopServer(r));
  });

  it("is loaded with its name", async () => {
    await load(flows);
    expect(testHelper.getNode("n1").name).toBe("demo");
  });

  it("passes the message through unchanged", async () => {
    await load(flows);
    const msg = await roundTrip({ topic: "greeting", payload: "hello" });
    expect(msg).toMatchObject({ topic: "greeting", payload: "hello" });
  });
});
