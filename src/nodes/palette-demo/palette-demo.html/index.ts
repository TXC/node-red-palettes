import type { EditorRED } from "node-red";

declare const RED: EditorRED;

RED.nodes.registerType("palette-demo", {
  category: "function",
  color: "#a6bbcf",
  defaults: { name: { value: "" } },
  inputs: 1,
  outputs: 1,
  icon: "font-awesome/fa-cube",
  label() {
    return this.name || "palette-demo";
  },
});
