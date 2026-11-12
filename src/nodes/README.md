# Nodes

Each node has its own folder here. A node has two halves:

- the **runtime**, which runs inside Node-RED and handles messages, and
- the **editor**, which runs in the browser and defines how the node looks
  in the palette and in its edit dialog.

## Layout

`<type>` is the node's type name, for example `my-node`.

```text
src/nodes/
├── shared/types.ts         Types used by more than one node
└── <type>/
    ├── <type>.ts           Runtime
    ├── <type>.test.ts      Tests
    ├── modules/            Optional helpers for the runtime
    └── <type>.html/        Editor
        ├── index.ts        Registers the node in the editor
        ├── editor.html     The edit dialog
        └── help.html       The help text in the sidebar
```

The type name must be identical everywhere: the folder, the file names,
both `registerType` calls, the `data-template-name` and `data-help-name`
attributes, and the key in `package.json`.

## Adding a node

1. Create the folder and files shown above. The examples below are a
   working starting point.
2. Add the node to `package.json`. The build only builds nodes listed here:

   ```json
   "node-red": {
     "nodes": {
       "my-node": "./dist/nodes/my-node/my-node.js"
     }
   }
   ```

3. Run `pnpm build`. You get two files in `dist/nodes/my-node/`:
   `my-node.js` for the runtime, and `my-node.html` for the editor.

### Runtime: `my-node/my-node.ts`

Node-RED loads this file and calls its default export.

```ts
import type { Node, NodeDef, NodeInitializer } from 'node-red';

const nodeInit: NodeInitializer = (RED) => {
  function MyNode(this: Node, config: NodeDef) {
    RED.nodes.createNode(this, config);
    this.on('input', (msg, send, done) => {
      send(msg);
      done();
    });
  }
  RED.nodes.registerType('my-node', MyNode);
};

export default nodeInit;
```

### Editor: `my-node/my-node.html/`

`index.ts` registers the node with the editor:

```ts
import type { EditorRED } from 'node-red';

declare const RED: EditorRED;

RED.nodes.registerType('my-node', {
  category: 'function',
  color: '#a6bbcf',
  defaults: { name: { value: '' } },
  inputs: 1,
  outputs: 1,
  icon: 'font-awesome/fa-cube',
  label() {
    return this.name || 'my-node';
  },
});
```

`editor.html` is the edit dialog. An input with the id `node-input-<name>`
is tied to the setting `<name>` in `defaults`:

```html
<script type="text/html" data-template-name="my-node">
  <div class="form-row">
    <label for="node-input-name"><i class="fa fa-tag"></i> Name</label>
    <input type="text" id="node-input-name" placeholder="Name" />
  </div>
</script>
```

`help.html` is shown in the editor's help sidebar:

```html
<script type="text/html" data-help-name="my-node">
  <p>What the node does, what it expects and what it sends.</p>
</script>
```

The build wraps the compiled `index.ts` in a `<script>` tag and appends
every `.html` file in the folder. The names `editor.html` and `help.html`
are only a convention.

## Testing

Put tests next to the code, ending in `.test.ts`. To run a node inside a
real Node-RED runtime, use [node-red-node-test-helper][test-helper].

[test-helper]: https://github.com/node-red/node-red-node-test-helper

## Further reading

- [Creating Nodes](https://nodered.org/docs/creating-nodes/) in the
  Node-RED documentation.
- [Packaging](https://nodered.org/docs/creating-nodes/packaging) covers
  naming, `package.json` and publishing.
