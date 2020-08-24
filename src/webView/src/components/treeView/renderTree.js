import * as d3 from 'd3';

import { getDOMRect, zoom, updateTree, treeLayout, collapse } from './treeMethods';
const CIRCLE_R = 8;
const PADDING = {
	LEFT: 100,
	RIGHT: 100,
	BOTTOM: 20,
	TOP: 20
};
const DEPTH_LENGTH = 200;
const NODE_TEXT_OFFSET_X = 13;
const DURATION_TIME = 750;
const CLICK_DALEY = 500;
export const renderTree = function(dom, data) {
	const { width, height } = getDOMRect(dom);
	const options = {
		width,
		height,
		CIRCLE_R,
		PADDING,
		DEPTH_LENGTH,
		NODE_TEXT_OFFSET_X,
		DURATION_TIME,
		CLICK_DALEY
	};
	const svgBox = d3.select(dom).append('svg').attr('width', width).attr('height', height);
	const svg = svgBox.append('g').attr('transform', 'translate(' + PADDING.LEFT + ',' + PADDING.TOP + ')');

	svgBox.call(zoom(svg));

	const treemap = treeLayout(width, height, PADDING);

	const root = d3.hierarchy(data, (d) => d.children);
	root.x0 = height / 2;
	root.y0 = 0;

	root.children.forEach(collapse);

	updateTree(svg, root, treemap, root, options);
};
