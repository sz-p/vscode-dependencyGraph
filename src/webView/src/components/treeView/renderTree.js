import * as d3 from 'd3';
import { throttle } from '../../utils/utils';

const diagonal = function(s, d) {
	const path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;

	return path;
};

const collapse = function(d) {
	if (d.children) {
		d._children = d.children;
		d._children.forEach(collapse);
		d.children = null;
	}
};

export class D3Tree {
	constructor() {
		this.initStaticVariables();
	}
	initStaticVariables() {
		this.PADDING = {
			LEFT: 100,
			RIGHT: 100,
			BOTTOM: 20,
			TOP: 20
		};
		this.DEPTH_LENGTH = 200;
		this.NODE_TEXT_OFFSET_X = 13;
		this.DURATION_TIME = 750;
		this.CLICK_DALEY = 500;
		this.ICON_SIZE = 22;
		this.NODE_SIZE = {
			width: 100,
			height: 200
		};
		this.NODE_HIGHLIGHT_COLOR = getComputedStyle(document.documentElement).getPropertyValue(
			'--vscode-editorLightBulb-foreground'
		);
		this.DEFAULT_TEXT_COLOR = getComputedStyle(document.documentElement).getPropertyValue(
			'--vscode-editor-foreground'
		);
		this.options = {
			PADDING: this.PADDING,
			DEPTH_LENGTH: this.DEPTH_LENGTH,
			NODE_TEXT_OFFSET_X: this.NODE_TEXT_OFFSET_X,
			DURATION_TIME: this.DURATION_TIME,
			CLICK_DALEY: this.CLICK_DALEY,
			ICON_SIZE: this.ICON_SIZE
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
			this.svgBox = d3.select(this.dom).append('svg').attr('width', this.width).attr('height', this.height);
		}
		if (!this.svg) {
			this.svg = this.svgBox
				.append('g')
				.attr('transform', 'translate(' + this.PADDING.LEFT + ',' + this.PADDING.TOP + this.height / 2 + ')');
		}
	}
	initZoom() {
		if (!this.zoom) {
			const zoomed = () => {
				const transform = d3.event.transform;
				this.svg.attr('transform', transform);
			};
			this.zoom = d3.zoom();
			this.zoom.on('zoom', zoomed);
			this.svgBox.call(this.zoom).on('dblclick.zoom', null);
			this.svgBox.call(this.zoom.translateBy, this.PADDING.LEFT, this.height / 2 - this.PADDING.TOP);
		}
	}
	initLayout() {
		if (!this.treemap) {
			this.treemap = d3.tree().nodeSize([ this.NODE_SIZE.width, this.NODE_SIZE.height ]);
		}
	}
	getData(data) {
		this.data = data;
	}
	getAssetsBaseURL(assetsBaseURL) {
		this.options.ASSETS_BASE_URL = this.ASSETS_BASE_URL = assetsBaseURL;
	}
	initRoot() {
		this.root = d3.hierarchy(this.data, (d) => d.children);
		this.root.x0 = 0;
		this.root.y0 = 0;
		this.root.children.forEach(collapse);
	}
	init(dom, data, assetsBaseURL) {
		this.initDom(dom);
		this.initZoom();
		this.getData(data);
		this.getAssetsBaseURL(assetsBaseURL);
		this.initLayout();
		this.setIDInTreeNode();
		this.initRoot();
		this.update();
	}
	setIDInTreeNode() {
		const stack = [ this.data ];
		while (stack.length) {
			const node = stack.pop();
			const id = node.ancestors.concat(node.absolutePath).join();
			node.id = id;
			if (node.children && node.children.length) {
				stack.push(...node.children);
			}
		}
	}
	getNodesLinksData() {
		this.treeNodes = this.treeData.descendants();
		this.treeLinks = this.treeData.descendants().slice(1);
	}
	getNodes() {
		this.nodesData = this.svg.selectAll('g.node').data(this.treeNodes, (d) => {
			return 'node_' + d.data.id;
		});
	}
	appendNodeDom(source) {
		const x = source ? source.y0 : this.root.y0;
		const y = source ? source.x0 : this.root.x0;
		this.nodeDom = this.nodesData
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', () => `translate(${x},${y})`)
			.style('cursor', () => 'pointer');
	}
	appendNodeIcon() {
		this.nodeDom
			.append('svg:image')
			.attr('class', 'node')
			.attr('xlink:href', (d) => {
				return this.ASSETS_BASE_URL + '/icons/' + d.data.type + '.svg';
			})
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 0)
			.attr('height', 0);
	}
	appendNodeName() {
		this.nodeDom
			.append('text')
			.style('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
			.attr('x', (d) => (d.children || d._children ? -this.NODE_TEXT_OFFSET_X : this.NODE_TEXT_OFFSET_X))
			.text((d) => d.data.name)
			.style('fill-opacity', 0);
	}
	appendNodeArrowButton() {
		this.nodeDom
			.select(function(d) {
				if (d.children || d._children) {
					return this;
				}
			})
			.append('svg:image')
			.attr('class', 'arrowButton')
			.attr('xlink:href', (d) => {
				return this.ASSETS_BASE_URL + '/webview/arrow.svg';
			})
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 0)
			.attr('height', 0)
			.style('transform', (d) => {
				return d.children ? 'rotate(180deg)' : 'rotate(0deg)';
			})
			.on('click', throttle(this.clickNodeArrowButton(), this.CLICK_DALEY));
	}
	nodesEnter() {
		this.nodeEnter = this.nodeDom.merge(this.nodesData);
	}
	enterArrowButton() {
		this.nodeEnter
			.select('image.arrowButton')
			.transition()
			.duration(this.DURATION_TIME)
			.attr('x', () => +this.ICON_SIZE / 2)
			.attr('y', () => -this.ICON_SIZE / 2)
			.attr('width', this.ICON_SIZE)
			.attr('height', this.ICON_SIZE)
			.style('transform', (d) => (d.children ? 'rotate(180deg)' : 'rotate(0deg)'));
	}
	enterNodeIcon() {
		this.nodeEnter
			.select('image.node')
			.transition()
			.duration(this.DURATION_TIME)
			.attr('x', () => -this.ICON_SIZE / 2)
			.attr('y', () => -this.ICON_SIZE / 2)
			.attr('width', this.ICON_SIZE)
			.attr('height', this.ICON_SIZE);
	}
	enterNodeName() {
		this.nodeEnter.select('text').transition().duration(this.DURATION_TIME).style('fill-opacity', 1);
		this.nodeEnter
			.transition()
			.duration(this.DURATION_TIME)
			.attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')')
			.style('fill-opacity', 1);
	}
	nodesExit(source) {
		const x = source ? source.y : this.root.y0;
		const y = source ? source.x : this.root.x0;
		this.nodeExit = this.nodesData
			.exit()
			.transition()
			.duration(this.DURATION_TIME)
			.attr('transform', () => `translate(${x},${y})`)
			.remove();
	}
	nodesExitIcon() {
		this.nodeExit.select('image').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', 0);
	}
	nodesExitName() {
		this.nodeExit.select('text').style('fill-opacity', 0);
	}
	nodesExitArrowButton() {
		this.nodeExit
			.select('image.arrowButton')
			.transition()
			.duration(this.DURATION_TIME)
			.style('transform', (d) => (d.children ? 'rotate(180deg)' : 'rotate(0deg)'));
	}
	getLinks() {
		this.linksData = this.svg.selectAll('path.link').data(this.treeLinks, (d) => {
			return 'link_' + d.data.id;
		});
	}
	appendLinkDom(source) {
		const x = source ? source.x0 : this.root.x0;
		const y = source ? source.y0 : this.root.y0;
		this.linkDom = this.linksData.enter().insert('path', 'g').attr('class', 'link').attr('d', (d) => {
			const o = { x, y };
			return diagonal(o, o);
		});
	}
	linksEnter() {
		this.linkEnter = this.linkDom.merge(this.linksData);
		this.linkEnter.transition().duration(this.DURATION_TIME).attr('d', (d) => diagonal(d, d.parent));
	}
	linksExit(source) {
		const x = source ? source.x : this.root.x0;
		const y = source ? source.y : this.root.y0;
		this.linksData
			.exit()
			.transition()
			.duration(this.DURATION_TIME)
			.attr('d', function(d) {
				const o = { x, y };
				return diagonal(o, o);
			})
			.remove();
	}
	update(source) {
		this.treeData = this.treemap(this.root);
		this.getNodesLinksData();

		this.getNodes();
		this.appendNodeDom(source);
		this.appendNodeIcon();
		this.appendNodeName();
		this.appendNodeArrowButton();

		this.nodesEnter();
		this.enterNodeIcon();
		this.enterNodeName();
		this.enterArrowButton();

		this.nodesExit(source);
		this.nodesExitIcon();
		this.nodesExitName();
		this.nodesExitArrowButton();

		this.getLinks();
		this.appendLinkDom(source);
		this.linksEnter();
		this.linksExit(source);

		this.stashPositions();
	}
	stashPositions() {
		this.treeNodes.forEach((d) => {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}
	clickNodeArrowButton() {
		return (d) => {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			this.update(d);
		};
	}
	openToNode(data) {
		if (!data.ancestors) console.log('error');
		let temp = this.root;
		let updateSource = null;
		let updateTarget = null;
		data.ancestors.push(data.absolutePath);
		// find child by node's ancestors
		for (let i = 0; i < data.ancestors.length; i++) {
			// children is not hash table so here is a loop
			if (temp && !temp.children) {
				if (!updateSource) {
					updateSource = temp;
				}
				updateTarget = temp;
				let tempChildren = temp.children;
				temp.children = temp._children;
				temp._children = tempChildren;
			}
			for (let j = 0; j < temp.children.length; j++) {
				if (temp.children[j].data.absolutePath === data.ancestors[i]) {
					temp = temp.children[j];
					updateTarget = temp;
					if (temp && !temp.children) {
						if (!updateSource) {
							updateSource = temp;
						}
						let tempChildren = temp.children;
						temp.children = temp._children;
						temp._children = tempChildren;
					}
					break;
				}
			}
		}
		if (updateSource) {
			this.update(null, updateSource);
		}
		return updateTarget;
	}
	hightLightFocusNode(nodeData) {
		d3
			.selectAll('text')
			.select(function(d, i) {
				if (!nodeData) {
					if (i == 0) return this;
				} else {
					if (d.data.id === nodeData.data.id) {
						return this;
					}
				}
			})
			.style('fill', (d) => {
				return this.NODE_HIGHLIGHT_COLOR;
			})
			.style('fill-opacity', (d) => {
				return 1;
			})
			.transition()
			.duration(this.DURATION_TIME * 2)
			.style('fill', (d) => {
				return this.DEFAULT_TEXT_COLOR;
			});
	}
	focusOnNode(data) {
		const updateTarget = this.openToNode(data);
		let transformToNode = undefined;
		let transformX = undefined;
		let transformY = undefined;
		if (updateTarget) {
			transformX = -updateTarget.y - this.PADDING.LEFT + this.width / 2;
			transformY = -updateTarget.x - this.PADDING.TOP + this.height / 2;
		} else {
			transformX = this.PADDING.LEFT;
			transformY = this.height / 2 - this.PADDING.TOP;
		}
		transformToNode = d3.zoomIdentity.translate(transformX, transformY).scale(1);
		this.hightLightFocusNode(updateTarget);
		this.svgBox.transition().duration(750).call(this.zoom.transform, transformToNode);
	}
}
