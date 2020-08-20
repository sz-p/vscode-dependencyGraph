import * as d3 from 'd3';
import { zoom, getTreeData, getDOMRect, getPath } from './treeHandle';
const CIRCLE_R = 8;
const PADDING = {
	LEFT: 100,
	RIGHT: 100,
	BOTTOM: 20,
	TOP: 20
};
const NODE_TEXT_OFFSET_X = 13;

function renderTreeView(dom, width, height, treeData) {
	const svgBox = d3.select(dom).append('svg').attr('width', width).attr('height', height);
	const svg = svgBox.append('g').attr('transform', 'translate(' + PADDING.LEFT + ',' + PADDING.TOP + ')');

	svgBox.call(zoom(svg));

	const links = svg
		.selectAll('.link')
		.data(treeData.descendants().slice(1))
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('d', (d) => getPath(d));

	const nodes = svg
		.selectAll('.node')
		.data(treeData.descendants())
		.enter()
		.append('g')
		.attr('class', 'node')
		.attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')');

	nodes.append('circle').attr('r', CIRCLE_R);

	nodes
		.append('text')
		.style('text-anchor', (d) => {
			return d.children ? 'end' : 'start';
		})
		.attr('x', (d) => {
			return d.children ? -NODE_TEXT_OFFSET_X : NODE_TEXT_OFFSET_X;
		})
		.text((d) => d.data.name);
}
export const renderTree = function(dom, data) {
	const { width, height } = getDOMRect(dom);
	const treeData = getTreeData(data, width, height, PADDING);
	renderTreeView(dom, width, height, treeData);
};
