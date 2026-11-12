import type { Node, NodeDef, NodeInitializer } from "node-red";

const nodeInit: NodeInitializer = (RED) => {
  function MyNode(this: Node, config: NodeDef) {
    RED.nodes.createNode(this, config);
    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }
  RED.nodes.registerType("palette-demo", MyNode);
};

export default nodeInit;
