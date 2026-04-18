# Phase 1 — Data Structure (start here)
File: packages/dependency-tree/src/core/dependencyTree.ts

Add a visited: Map<string, DependencyTreeData> to track nodes by file ID
In processChildDependency() — before creating a new node, check visited.has(childId). If yes, reuse the existing node and skip re-traversal
Remove removeRepeatNodeOnTree() — no longer needed
Keep isCircularStructure() but use it only for true cycles (not duplicates)
File: src/data-dependencyTree/dependencyTreeData.d.ts

Change parent?: DependencyTreeData → parents?: DependencyTreeData[]

## Phase 1 is complete.

# Phase 2 — Serialization
File: src/data-dependencyTree/processTreeData.ts

Change dependenciesTreeDataToTransportsData() to output a flat { nodes: Node[], edges: Edge[] } structure instead of a nested tree
Update transportsDataToDependenciesTreeData() to reconstruct from nodes+edges

## Phase 2 is complete. Here's a summary of all changes:

dependencyTreeData.d.ts — Added TransportEdge and TransportsData interfaces.

processTreeData.ts — Rewrote both functions:

dependenciesTreeDataToTransportsData() now returns { nodes: DependencyNode[], edges: TransportEdge[], rootId: string } (flat graph) instead of a nested DependencyTree
transportsDataToDependenciesTreeData() now takes (TransportsData, dirPath) instead of (DependencyTree, DependencyNodes, dirPath). Reconstruction uses BFS with an ancestor set to detect cycles and re-insert circular sentinel nodes.
Updated callers:

data-dependencyTree.ts — Uses TransportsData in all return/parameter types
data.ts — Reads persisted data.json directly as TransportsData
messages.ts — msgPostDependencyTreeDataToWebView now takes TransportsData
action.js — Passes Params.data.value.data directly (the whole TransportsData object)
utils.ts — Updated to use new signatures
Note: Existing savedData.json test fixtures have the old { dependencyTree, dependencyNodes } format and will need to be regenerated before tests pass. Uncomment the fs.writeFileSync lines in utils.ts temporarily to regenerate them.

# Phase 3 — Frontend Rendering (biggest work)
File: src/webView/src/components/treeView/renderTree.js

Replace d3.tree() + d3.hierarchy() with d3.forceSimulation() using:
d3.forceLink() for edges
d3.forceManyBody() for repulsion
d3.forceCenter() to keep graph centered
Update node rendering — nodes now keyed by file ID, not tree position
Update edge rendering — draw straight or curved lines between source and target node IDs
Keep zoom/pan, icons, and click handlers as-is
File: src/webView/src/reducers/reducers.js

Update action_setDependenciesTreeData() to handle { nodes, edges } format instead of nested tree

## Phase 3 is complete. Here's a summary of what changed:

renderTree.js — Full rewrite of D3Tree:

d3.hierarchy() + d3.tree() replaced with d3.forceSimulation() using forceLink, forceManyBody, and forceCenter
render() draws all nodes/edges upfront; ticked() updates positions each simulation tick
Added buildDragBehavior() — nodes are now draggable
focusOnNode(ancestors) finds a node by its relativePath and pans/zooms to it
Node click now dispatches action_selectNode({ data: d }) so the reducer's action.payload.data is the flat node object (with absolutePath)
Zoom/pan and VSCode CSS variable bindings are preserved unchanged
action.js — getDependenciesTreeData no longer calls transportsDataToDependenciesTreeData. It now passes the TransportsData { nodes, edges, rootId } directly, adding absolutePath to each node from folderPath.

reducers.js — No changes needed; setDependencyTreeData already just stores action.payload as dependencyTreeData.
# Phase 4 — Build & Install
Run npm install in both root and packages/dependency-tree/
Run npm run build (or vsce package) to produce a .vsix file
In VS Code: Extensions → ... → Install from VSIX
Recommended order: Phase 1 → 2 → 3 → 4. Phases 1 and 2 are pure TypeScript refactors; Phase 3 is the hardest but isolated to one file.

## Phase 4 is complete.

---

# Phase 5 — Focus Mode

**Goal:** Clicking a node enters "focus mode" — the clicked node stays fully visible, its direct neighbors (both sources and targets) are shown slightly dimmed, and all unrelated nodes/edges are faded out heavily. Clicking the background exits focus mode and restores full opacity.

## Data side (no changes needed)
The `{ nodes, edges }` flat graph already contains all connectivity info. Focus mode is purely a visual/interaction layer.

## `renderTree.js` changes

1. **Track focus state**
   - Add `this.focusedNodeId = null` in `initStaticVariables()`.

2. **Add `enterFocusMode(nodeId)` method**
   - Build a Set of connected node IDs: iterate `this.edges`, collect `source.fileID` / `target.fileID` whenever either side matches `nodeId`.
   - Call `applyFocusOpacity(nodeId, connectedSet)`.

3. **Add `exitFocusMode()` method**
   - Set `this.focusedNodeId = null`.
   - Reset all node/edge opacity to `1`.

4. **Add `applyFocusOpacity(nodeId, connectedSet)` method**
   - `this.nodeDoms`: opacity `1` for focused node, `0.35` for neighbors, `0.08` for all others.
   - `this.linkDoms`: opacity `1` for edges touching the focused node, `0.08` for the rest.

5. **Wire up click handler in `render()`**
   - In the node `"click"` handler, after dispatching `action_selectNode`, check if the clicked node is already `this.focusedNodeId` — if so call `exitFocusMode()`, otherwise call `enterFocusMode(d.fileID)`.
   - In the SVG background `"click"` handler (already in `initDom`), call `exitFocusMode()`.

6. **Call `exitFocusMode()` at the top of `render()`** so a data refresh always starts clean.

## No reducer/action changes needed
Focus mode is local D3 state; it does not need to be stored in Redux.

## Phase 5 is completed. — Focus Mode (renderTree.js):

Click a node → it stays fully visible, direct neighbors dim to 35% opacity, everything else fades to 8%
Click the same node again or the SVG background → exits focus mode and restores all opacities
render() always starts in a clean unfocused state

---

# Phase 6 — Layout Modes

**Goal:** Let the user switch between several automatic graph arrangements via a dropdown in the toolbar. Layouts to support:

| ID | Label | Description |
|----|-------|-------------|
| `force` | Auto (Force) | Current d3.forceSimulation — default |
| `hierarchical` | Hierarchical | Dagre-style top-down tree (root at top) |
| `radial` | Radial | Root at center, children on concentric rings |
| `grid` | Grid | Nodes placed in a uniform grid by index |

## New dependency
Add `dagre` (or `d3-dag`) to `src/webView/` package.json for hierarchical layout.

## `toolBox.jsx` changes
Add a `<select>` (or Fluent UI `Dropdown`) with the four layout options. On change, dispatch a new `action_setLayout(layoutId)` action.

## Redux changes
- `actionType.js` — add `SET_LAYOUT = "SET_LAYOUT"`.
- `initialState.js` — add `layout: "force"`.
- `reducers.js` — handle `SET_LAYOUT`: return `{ ...state, layout: action.payload }`.

## `treeView.jsx` changes
Pass `layout` from Redux state as a prop to the D3Tree instance. On prop change, call `d3Tree.setLayout(layout)`.

## `renderTree.js` changes

1. **Add `this.layout = "force"` in `initStaticVariables()`.**

2. **Add `setLayout(layoutId)` method**
   - Store `this.layout = layoutId`.
   - Recompute positions via the appropriate layout function (see below).
   - Re-render edges and nodes without restarting the full simulation for non-force layouts.

3. **Layout computation methods**
   - `applyForceLayout()` — restart `this.simulation` (existing behavior).
   - `applyHierarchicalLayout()` — run dagre `graphlib.Graph`, assign `d.x / d.y` from dagre output, freeze positions (`d.fx = d.x`), stop simulation.
   - `applyRadialLayout()` — BFS from root node, assign radius by depth and angle by sibling index; freeze positions.
   - `applyGridLayout()` — sort nodes alphabetically, assign `x = col * spacing`, `y = row * spacing`; freeze positions.

4. For all non-force layouts: after assigning `d.fx / d.fy`, stop the simulation and call `ticked()` once to render the positions immediately.

## Phase 6 is completed — Layout Modes:

toolBox.jsx — <select> dropdown with Auto (Force) / Hierarchical / Radial / Grid
actionType.js + action.js — TYPE_SET_LAYOUT / action_setLayout
initialState.js + reducers.js — layout: "force" state
treeView.jsx — calls tree.setLayout(layout) on prop change
renderTree.js — setLayout() + 4 layout methods using dagre for hierarchical, BFS for radial, alpha-sort for grid

---

# Phase 7 — Edge Labels (imported names + direction arrows)

**Goal:** Each edge in the graph shows what is imported from the source file and an arrowhead indicating direction (source → target).

## Data side — propagate import names

### `packages/dependency-tree/src/core/dependencyTree.ts`
- The `processChildDependency()` function currently only stores the child file ID. Extend `TransportEdge` to carry `importedNames: string[]`.
- For JS/TS parsers: capture the named/default/namespace specifiers from the AST node that produced each resolved path.
- Store these names on the edge when the edge is first created.

### `src/data-dependencyTree/dependencyTreeData.d.ts`
- Add `importedNames?: string[]` to `TransportEdge`.

### Parser changes (JS/TS only for phase 7)
- In `jsParser` / `tsParser` / `tsxParser`: when returning resolved paths, return `{ path: string; names: string[] }[]` instead of `string[]`, then bubble names up to the edge in `dependencyTree.ts`.

## Frontend — render arrows and labels

### `renderTree.js`

1. **Add SVG `<defs>` arrowhead marker** at the start of `render()`:
   ```js
   this.svg.append("defs").append("marker")
     .attr("id", "arrowhead")
     .attr("viewBox", "0 -5 10 10")
     .attr("refX", 18).attr("refY", 0)
     .attr("markerWidth", 6).attr("markerHeight", 6)
     .attr("orient", "auto")
     .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", borderColor);
   ```

2. **Change `<line>` to `<path>`** for links so curved paths work and `marker-end` can be applied:
   - Use a quadratic bezier `d` attribute computed each tick.
   - Add `.attr("marker-end", "url(#arrowhead)")`.

3. **Add edge label `<text>` elements** in the links layer:
   - Each label shows `edge.importedNames.join(", ")` (truncated if > 30 chars).
   - Positioned at the midpoint of the bezier in `ticked()`.
   - Font size: `10px`, fill: `DEFAULT_IGNORED_TEXT_COLOR`.
   - Hidden by default; shown on link hover (`:hover` or D3 mouse events).

4. **Update `ticked()`** to reposition both the path `d` attribute and the label `transform` each tick.

### No reducer changes needed for rendering.

## Phase 7 is complete and the build passes. Here's a summary of all changes:

Data side:

dependencyTreeData.d.ts — Added importedNames?: string[] to TransportEdge and importedNamesByChild to DependencyTreeData
index.d.ts — Added importedNamesByChild to the core DependencyTreeData
generalJavaScriptParser.ts — Added storeImportedNames() helper; visitImportDeclaration now collects default, * as name, and named specifiers from each import statement
processTreeData.ts — Edge-building loop now iterates the original DependencyTreeData children (which have importedNamesByChild) and attaches names to each TransportEdge
Frontend:

renderTree.js — render() adds an SVG arrowhead <defs> marker; links are now <path> elements with marker-end; edge label <text> elements are appended (opacity 0, shown on link hover); ticked() updates path d via quadratic bezier and repositions labels at midpoint; exitFocusMode() and applyFocusOpacity() keep label opacity at 0 in focus mode

# Phase 8 - File watcher for file generation for AI with debounce

## Phase 8 is complete and the build passes. Here's a summary of all changes:
snapshot.ts — new file that writes .dependencygraph/dependencygraphsnapshot.json as a compact { root, graph } map of relativePath → [dep paths].

data.ts:57 — setData now calls writeSnapshot after writing data.json, so both files stay in sync on every save (manual or auto).

extension.ts:48-69 — file watcher on **/*, debounced 500ms, that calls dependencygraph.upDateData. The .dependencygraph folder is excluded to prevent feedback loops. The watcher is pushed to context.subscriptions so it cleans up on deactivation.