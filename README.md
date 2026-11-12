# Node-RED Palette Template

A GitHub template for building your own Node-RED nodes in TypeScript.

It comes with the build, tests, linting and automatic npm releases already
set up, so you can start on the node itself.

## What you get

- TypeScript for both halves of a node: the part that runs inside
  Node-RED, and the part that runs in the editor in the browser.
- A Vite build that turns each node into the two files Node-RED expects.
- Tests with [Vitest](https://vitest.dev) and
  [node-red-node-test-helper][test-helper].
- ESLint and Prettier.
- GitHub Actions that check every pull request, scan the code with CodeQL,
  and release to npm when you merge to `main`.

## Getting started

You need Node.js 22 or newer and [pnpm](https://pnpm.io).

1. On GitHub, click **Use this template** to create your repository.
2. Clone it and run `pnpm install`.
3. Make it yours (see below).
4. Add your first node. [src/nodes/README.md](src/nodes/README.md)
   explains how.

## Make it yours

After creating your repository, change these:

| File                            | What to change                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `package.json`                  | `name`, `description`, `author`, `repository`, `keywords`, and the node list (see below).     |
| `.github/workflows/release.yml` | `package-name` in the last step: your npm package name.                                       |
| `LICENSE`                       | The copyright holder.                                                                         |
| `README.md`                     | Replace this file with documentation for your node.                                           |
| `.vscode/settings.json`         | The spell-checker word list. It still holds words from another project.                       |

In `package.json`, the `node-red.nodes` list, `main` and `types` all point
to the `palette-demo` example node. Replace it with your own node.

**Package name.** Node-RED asks new packages to use a scoped name
(`@you/node-red-something`) or the `node-red-contrib-` prefix. Keep
`node-red` in `keywords`; that is how the
[Node-RED flow library](https://flows.nodered.org) finds your package.

## Development

| Command             | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `pnpm build`        | Production build into `dist/`, minified.                        |
| `pnpm build:dev`    | Development build, not minified.                                |
| `pnpm build:debug`  | Minified build with source maps.                                |
| `pnpm package`      | Build, then pack into a `.tgz` you can install in Node-RED.     |
| `pnpm test`         | Run the tests once.                                             |
| `pnpm test:watch`   | Run the tests on every change.                                  |
| `pnpm lint`         | Check the code with ESLint. `pnpm lint:fix` fixes what it can.  |
| `pnpm format`       | Format the code with Prettier.                                  |

### Trying your node in Node-RED

Build first, then install the project into your Node-RED user folder
(usually `~/.node-red`) and restart Node-RED:

```sh
pnpm build
cd ~/.node-red
npm install /path/to/your/repository
```

This links to your working copy, so after the next `pnpm build` you only
need to restart Node-RED.

## Releasing

Every merge to `main` can publish a new version. You never set the version
number yourself: [semantic-release](https://semantic-release.gitbook.io)
works it out from the commit messages, which must follow
[Conventional Commits](https://www.conventionalcommits.org):

| Commit message starts with                   | Release            |
| -------------------------------------------- | ------------------ |
| `fix:`                                       | Patch (`1.0.1`)    |
| `feat:`                                      | Minor (`1.1.0`)    |
| A `BREAKING CHANGE:` footer, or `feat!:`     | Major (`2.0.0`)    |
| Anything else (`chore:`, `docs:`, ...)       | No release         |

A release updates `package.json` and `CHANGELOG.md`, publishes to npm,
creates a GitHub release, and asks the Node-RED flow library to refresh
its entry.

Before the first release:

- Add an npm access token as the repository secret `NPM_TOKEN`. Once you
  have set up [npm trusted publishing][trusted-publishing] for the
  package, you can remove the token.
- If `main` is protected, allow GitHub Actions to push to it. The release
  commits the new version back to `main`.

## Project layout

```text
.
├── src/nodes/      Your nodes, one folder each
├── examples/       Example flows, shown in Node-RED's import menu
├── dist/           Build output (not committed)
├── .github/        Pull request checks, CodeQL and release workflows
└── vite.config.ts  Build setup
```

## License

[MIT](LICENSE)

[test-helper]: https://github.com/node-red/node-red-node-test-helper
[trusted-publishing]: https://docs.npmjs.com/trusted-publishers
