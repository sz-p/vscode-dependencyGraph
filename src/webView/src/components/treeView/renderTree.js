import * as d3 from "d3";
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

  render() {
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
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };
    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };
    const dragEnded = (d) => {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
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
    this.initSimulation();
  }

  update() {
    if (this.simulation) {
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
