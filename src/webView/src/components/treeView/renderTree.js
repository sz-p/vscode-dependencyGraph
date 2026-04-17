import * as d3 from "d3";
import * as dagre from "dagre";
import { throttle, isMac } from "../../utils/utils";
import { store } from "../../reducers/store";
import { action_selectNode } from "../../actions/action";
import { msgWebViewLog } from "../../utils/messages";

export class D3Tree {
  constructor(newWindow) {
    if (newWindow) {
      this.window = newWindow;
      this.isBrowser = false;
    } else {
      this.window = window;
      this.isBrowser = true;
    }
    this.initStaticVariables();
  }

  resize() {
    if (!this.dom) return;
    const { width, height } = this.dom.getClientRects()[0];
    this.width = width;
    this.height = height;
    this.svgBox.attr("width", this.width).attr("height", this.height);
    if (this.simulation) {
      this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2));
      this.simulation.alpha(0.3).restart();
    }
  }

  initStaticVariables() {
    this.PADDING = {
      LEFT: 100,
      RIGHT: 100,
      BOTTOM: 20,
      TOP: 20,
    };
    this.DEPTH_LENGTH = 200;
    this.NODE_TEXT_OFFSET_X = 13;
    this.DURATION_TIME = 750;
    this.CLICK_DALEY = 500;
    this.ICON_SIZE = 22;

    this.NODE_HIGHLIGHT_COLOR = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-editorLightBulb-foreground");
    this.DEFAULT_TEXT_COLOR = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-editor-foreground");
    this.DEFAULT_IGNORED_TEXT_COLOR = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-gitDecoration-ignoredResourceForeground");
    this.DEFAULT_FONT_FAMILY = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-font-family");
    this.DEFAULT_FONT_WEIGHT = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-font-weight");
    this.DEFAULT_FONT_SIZE = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-font-size");
    this.DEFAULT_CHECKBOX_BORDER = this.window
      .getComputedStyle(this.window.document.documentElement)
      .getPropertyValue("--vscode-checkbox-border");

    this.options = {
      PADDING: this.PADDING,
      DEPTH_LENGTH: this.DEPTH_LENGTH,
      NODE_TEXT_OFFSET_X: this.NODE_TEXT_OFFSET_X,
      DURATION_TIME: this.DURATION_TIME,
      CLICK_DALEY: this.CLICK_DALEY,
      ICON_SIZE: this.ICON_SIZE,
    };

    this.focusedNodeId = null;
    this.layout = "force";
  }

  initDom(dom) {
    if (!this.dom) {
      const { width, height } = dom.getClientRects()[0];
      this.dom = dom;
      this.options.width = this.width = width;
      this.options.height = this.height = height;
    }
    if (!this.svgBox) {
      this.svgBox = d3
        .select(this.dom)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("id", "treeViewSvgBox")
        .on("click", () => {
          store.dispatch(action_selectNode({}));
          this.exitFocusMode();
        });
    }
    if (!this.svg) {
      this.svg = this.svgBox.append("g").attr("id", "treeViewSvg");
    }
  }

  initZoomForMac() {
    if (!this.zoom && this.isBrowser) {
      let currentX = this.width / 2;
      let currentY = this.height / 2;
      let currentScale = 1;
      const scaleExtent = [0.1, 4];
      this.svg.attr("transform", `translate(${currentX},${currentY}) scale(1)`);

      this.zoom = d3.zoom();
      this.svgBox.on(".zoom", null);

      this.svgBox.on("wheel", function () {
        d3.event.preventDefault();
        if (d3.event.ctrlKey || d3.event.metaKey) {
          const zoomFactor = 1 - d3.event.deltaY * 0.02;
          const newScale = currentScale * zoomFactor;

          if (newScale >= scaleExtent[0] && newScale <= scaleExtent[1]) {
            const transformOriginX = d3.event.offsetX;
            const transformOriginY = d3.event.offsetY;

            const dx = ((transformOriginX - currentX) / currentScale) * 0.5;
            const dy = ((transformOriginY - currentY) / currentScale) * 0.5;

            const deltaScale = currentScale - newScale;

            currentX = currentX + dx * deltaScale;
            currentY = currentY + dy * deltaScale;

            currentScale = newScale;
          }
        } else {
          currentX -= d3.event.deltaX * 0.5;
          currentY -= d3.event.deltaY * 0.5;
        }
        d3.select(this)
          .select("g")
          .attr(
            "transform",
            `translate(${currentX},${currentY}) scale(${currentScale})`
          );
      });
    }
  }

  initZoomForWin() {
    if (!this.zoom && this.isBrowser) {
      const zoomed = () => {
        const transform = d3.event.transform;
        this.svg.attr("transform", transform);
      };
      this.zoom = d3.zoom();
      this.zoom.on("zoom", zoomed);
      this.svgBox.call(this.zoom).on("dblclick.zoom", null);
    }
  }

  initZoom() {
    const isOnMac = isMac();
    if (isOnMac) {
      this.initZoomForMac();
    } else {
      this.initZoomForWin();
    }
  }

  getData(data) {
    // data is { nodes, edges, rootId } from TransportsData
    this.rootId = data.rootId;
    this.nodes = data.nodes.map((n) => Object.assign({}, n));
    this.edges = data.edges.map((e) => Object.assign({}, e));
    this.nodeMap = new Map(this.nodes.map((n) => [n.fileID, n]));
  }

  getAssetsBaseURL(assetsBaseURL) {
    this.options.ASSETS_BASE_URL = this.ASSETS_BASE_URL = assetsBaseURL;
  }

  getActiveThemeKind(activeThemeKind) {
    this.activeThemeKind = activeThemeKind
      ? activeThemeKind.toLocaleLowerCase()
      : "dark";
  }

  // ── Phase 5: Focus Mode ──────────────────────────────────────────────────────

  exitFocusMode() {
    this.focusedNodeId = null;
    if (this.nodeDoms) this.nodeDoms.attr("opacity", 1);
    if (this.linkDoms) this.linkDoms.attr("opacity", 1);
  }

  enterFocusMode(nodeId) {
    this.focusedNodeId = nodeId;
    const connectedSet = new Set();
    this.edges.forEach((e) => {
      const srcId = e.source.fileID !== undefined ? e.source.fileID : e.source;
      const tgtId = e.target.fileID !== undefined ? e.target.fileID : e.target;
      if (srcId === nodeId || tgtId === nodeId) {
        connectedSet.add(srcId);
        connectedSet.add(tgtId);
      }
    });
    this.applyFocusOpacity(nodeId, connectedSet);
  }

  applyFocusOpacity(nodeId, connectedSet) {
    this.nodeDoms.attr("opacity", (d) => {
      if (d.fileID === nodeId) return 1;
      if (connectedSet.has(d.fileID)) return 0.35;
      return 0.08;
    });
    this.linkDoms.attr("opacity", (d) => {
      const srcId = d.source.fileID !== undefined ? d.source.fileID : d.source;
      const tgtId = d.target.fileID !== undefined ? d.target.fileID : d.target;
      return srcId === nodeId || tgtId === nodeId ? 1 : 0.08;
    });
  }

  // ── Phase 6: Layout Modes ────────────────────────────────────────────────────

  setLayout(layoutId) {
    this.layout = layoutId;
    if (!this.nodes || !this.linkDoms || !this.nodeDoms) return;
    switch (layoutId) {
      case "hierarchical":
        this.applyHierarchicalLayout();
        break;
      case "radial":
        this.applyRadialLayout();
        break;
      case "grid":
        this.applyGridLayout();
        break;
      default:
        this.applyForceLayout();
        break;
    }
  }

  applyForceLayout() {
    this.nodes.forEach((d) => { d.fx = null; d.fy = null; });
    this.initSimulation();
  }

  applyHierarchicalLayout() {
    if (this.simulation) this.simulation.stop();

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "TB", ranksep: 120, nodesep: 80 });
    g.setDefaultEdgeLabel(() => ({}));

    this.nodes.forEach((n) => g.setNode(n.fileID, { width: 120, height: 40 }));
    this.edges.forEach((e) => {
      const src = e.source.fileID !== undefined ? e.source.fileID : e.source;
      const tgt = e.target.fileID !== undefined ? e.target.fileID : e.target;
      g.setEdge(src, tgt);
    });

    dagre.layout(g);

    const offsetX = this.width / 2 - g.graph().width / 2;
    const offsetY = this.PADDING.TOP;
    this.nodes.forEach((n) => {
      const pos = g.node(n.fileID);
      if (pos) {
        n.fx = pos.x + offsetX;
        n.fy = pos.y + offsetY;
        n.x = n.fx;
        n.y = n.fy;
      }
    });
    this.ticked();
  }

  applyRadialLayout() {
    if (this.simulation) this.simulation.stop();

    const levelMap = new Map();
    const visited = new Set();
    const queue = [this.rootId];
    levelMap.set(this.rootId, 0);
    visited.add(this.rootId);

    const adjacency = new Map();
    this.edges.forEach((e) => {
      const src = e.source.fileID !== undefined ? e.source.fileID : e.source;
      const tgt = e.target.fileID !== undefined ? e.target.fileID : e.target;
      if (!adjacency.has(src)) adjacency.set(src, []);
      adjacency.get(src).push(tgt);
    });

    while (queue.length) {
      const current = queue.shift();
      const children = adjacency.get(current) || [];
      children.forEach((child) => {
        if (!visited.has(child)) {
          visited.add(child);
          levelMap.set(child, (levelMap.get(current) || 0) + 1);
          queue.push(child);
        }
      });
    }

    const maxDepth = Math.max(...levelMap.values(), 0);
    const radiusStep = Math.min(this.width, this.height) / (2 * (maxDepth + 1));
    const byLevel = new Map();
    levelMap.forEach((level, id) => {
      if (!byLevel.has(level)) byLevel.set(level, []);
      byLevel.get(level).push(id);
    });

    const cx = this.width / 2;
    const cy = this.height / 2;

    this.nodes.forEach((n) => {
      const level = levelMap.has(n.fileID) ? levelMap.get(n.fileID) : maxDepth + 1;
      if (level === 0) {
        n.fx = cx;
        n.fy = cy;
      } else {
        const peers = byLevel.get(level) || [n.fileID];
        const idx = peers.indexOf(n.fileID);
        const angle = (2 * Math.PI * idx) / peers.length - Math.PI / 2;
        const radius = level * radiusStep;
        n.fx = cx + radius * Math.cos(angle);
        n.fy = cy + radius * Math.sin(angle);
      }
      n.x = n.fx;
      n.y = n.fy;
    });
    this.ticked();
  }

  applyGridLayout() {
    if (this.simulation) this.simulation.stop();

    const sorted = [...this.nodes].sort((a, b) =>
      (a.relativePath || "").localeCompare(b.relativePath || "")
    );
    const cols = Math.ceil(Math.sqrt(sorted.length));
    const spacingX = Math.min(180, (this.width - this.PADDING.LEFT - this.PADDING.RIGHT) / cols);
    const spacingY = 100;

    sorted.forEach((n, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      n.fx = this.PADDING.LEFT + col * spacingX + spacingX / 2;
      n.fy = this.PADDING.TOP + row * spacingY + spacingY / 2;
      n.x = n.fx;
      n.y = n.fy;
    });
    this.ticked();
  }

  // ────────────────────────────────────────────────────────────────────────────

  render() {
    this.exitFocusMode();
    this.svg.selectAll("*").remove();

    // Links layer (behind nodes)
    this.linkDoms = this.svg
      .append("g")
      .attr("class", "links")
      .selectAll("line.link")
      .data(this.edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", this.DEFAULT_CHECKBOX_BORDER)
      .attr("stroke-width", 1);

    // Nodes layer
    this.nodeDoms = this.svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g.node")
      .data(this.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("cursor", "pointer")
      .on("click", (d) => {
        d3.event.stopPropagation();
        store.dispatch(action_selectNode({ data: d }));
        if (this.focusedNodeId === d.fileID) {
          this.exitFocusMode();
        } else {
          this.enterFocusMode(d.fileID);
        }
      })
      .call(this.buildDragBehavior());

    // File type icon
    this.nodeDoms
      .append("svg:image")
      .attr("class", "image")
      .attr("xlink:href", (d) => `${this.ASSETS_BASE_URL}/icons/${d.type}.svg`)
      .attr("x", -this.ICON_SIZE / 2)
      .attr("y", -this.ICON_SIZE / 2)
      .attr("width", this.ICON_SIZE)
      .attr("height", this.ICON_SIZE);

    // Tooltip
    this.nodeDoms.append("title").text((d) => d.relativePath?.replace(/\\/g, "/"));

    // Node label
    const textDom = this.nodeDoms
      .append("text")
      .attr("dominant-baseline", "middle")
      .attr("x", this.NODE_TEXT_OFFSET_X)
      .attr("fill", this.DEFAULT_TEXT_COLOR)
      .attr("font-family", this.DEFAULT_FONT_FAMILY)
      .attr("font-weight", this.DEFAULT_FONT_WEIGHT)
      .attr("font-size", this.DEFAULT_FONT_SIZE);

    // Dim parent folder prefix for index files
    textDom
      .append("tspan")
      .attr("fill", this.DEFAULT_IGNORED_TEXT_COLOR)
      .text((d) => {
        const nameWithoutExt = d.name.replace(d.extension, "");
        const parts = d.relativePath.replace(/\\/g, "/").split("/");
        parts.pop();
        const parentDir = parts.pop();
        return nameWithoutExt === "index" && parentDir ? parentDir + "/" : "";
      });

    textDom.append("tspan").text((d) => d.name);
  }

  buildDragBehavior() {
    const dragStarted = (d) => {
      if (!d3.event.active && this.layout === "force") {
        this.simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };
    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };
    const dragEnded = (d) => {
      if (!d3.event.active && this.layout === "force") {
        this.simulation.alphaTarget(0);
      }
    };
    return d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }

  initSimulation() {
    if (this.simulation) this.simulation.stop();

    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3.forceLink(this.edges).id((d) => d.fileID).distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .on("tick", () => this.ticked());
  }

  ticked() {
    this.linkDoms
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    this.nodeDoms.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  init(dom, data, assetsBaseURL, activeThemeKind) {
    this.initDom(dom);
    this.initZoom();
    this.getData(data);
    this.getAssetsBaseURL(assetsBaseURL);
    this.getActiveThemeKind(activeThemeKind);
    this.render();
    if (this.layout === "force") {
      this.initSimulation();
    } else {
      this.setLayout(this.layout);
    }
  }

  update() {
    if (this.layout === "force" && this.simulation) {
      this.simulation.alpha(0.3).restart();
    }
  }

  hightLightFocusNode(nodeData) {
    d3.selectAll("g.node text")
      .select(function (d) {
        if (d && nodeData && d.fileID === nodeData.fileID) return this;
        return null;
      })
      .attr("fill", this.NODE_HIGHLIGHT_COLOR)
      .attr("fill-opacity", 1)
      .transition()
      .duration(this.DURATION_TIME * 2)
      .attr("fill", this.DEFAULT_TEXT_COLOR);
  }

  focusOnNode(ancestors) {
    if (!ancestors || !ancestors.length) {
      msgWebViewLog("error", "focusOnNode failed: no ancestors provided");
      return;
    }
    const targetPath = ancestors[ancestors.length - 1];
    const targetNode = this.nodes
      ? this.nodes.find((n) => n.relativePath === targetPath)
      : null;
    if (!targetNode) return;

    this.hightLightFocusNode(targetNode);

    if (!this.zoom || !this.isBrowser) return;
    const x = targetNode.x || 0;
    const y = targetNode.y || 0;
    const transform = d3.zoomIdentity
      .translate(this.width / 2 - x, this.height / 2 - y)
      .scale(1);
    this.svgBox.transition().duration(750).call(this.zoom.transform, transform);
  }
}
