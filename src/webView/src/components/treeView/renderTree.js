import * as d3 from 'd3';

import { getDOMRect, initZoom, updateTree, treeLayout, collapse } from './treeMethods';

export class D3Tree {
	constructor() {
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
		this.options = {
			PADDING: this.PADDING,
			DEPTH_LENGTH: this.DEPTH_LENGTH,
			NODE_TEXT_OFFSET_X: this.NODE_TEXT_OFFSET_X,
			DURATION_TIME: this.DURATION_TIME,
			CLICK_DALEY: this.CLICK_DALEY,
			ICON_SIZE: this.ICON_SIZE
		};
	}
	init(dom, data) {
		const { width, height } = getDOMRect(dom);
		this.dom = dom;
		this.data = data;
		this.options.width = this.width = width;
		this.options.height = this.height = height;

		this.svgBox = d3.select(this.dom).append('svg').attr('width', this.width).attr('height', this.height);
		this.svg = this.svgBox
			.append('g')
			.attr('transform', 'translate(' + this.PADDING.LEFT + ',' + this.PADDING.TOP + ')');

		this.zoom = initZoom(this.svg, this.svgBox, this.PADDING);

		this.treemap = treeLayout(this.width, this.height, this.PADDING);

		this.root = d3.hierarchy(this.data, (d) => d.children);
		this.root.x0 = this.height / 2;
		this.root.y0 = 0;
		this.root.children.forEach(collapse);
		this.update();
	}
	update(svg, source, treemap, root, options) {
		updateTree(
			svg || this.svg,
			source || this.root,
			treemap || this.treemap,
			root || this.root,
			options || this.options
		);
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
			transformY = this.PADDING.TOP;
		}
		transformToNode = d3.zoomIdentity.translate(transformX, transformY).scale(1);

		this.svgBox.transition().duration(750).call(this.zoom.transform, transformToNode);
	}
}
