import * as d3 from 'd3';

import { getDOMRect, renderTreeView, zoom, getTreeData } from './treeMethods';
const CIRCLE_R = 8;
const PADDING = {
	LEFT: 100,
	RIGHT: 100,
	BOTTOM: 20,
	TOP: 20
};
const NODE_TEXT_OFFSET_X = 13;
const DURATION_TIME = 750;
export const renderTree = function(dom, data) {
	const { width, height } = getDOMRect(dom);

	const svgBox = d3.select(dom).append('svg').attr('width', width).attr('height', height);
	const svg = svgBox.append('g').attr('transform', 'translate(' + PADDING.LEFT + ',' + PADDING.TOP + ')');

	svgBox.call(zoom(svg));

	renderTreeView(svg, data, width, height, { CIRCLE_R, PADDING, NODE_TEXT_OFFSET_X, DURATION_TIME });
};
