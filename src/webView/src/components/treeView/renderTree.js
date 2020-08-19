import * as d3 from 'd3';

function getTreeData(data, width, height) {
	const treeData = d3.tree().size([ width, height ])(d3.hierarchy(data));
	return treeData;
}
function getDOMRect(dom) {
	return dom.getClientRects()[0];
}
function getPath(d) {
	return 'M' + d.source.x + ',' + d.source.y + 'H' + d.target.x + 'V' + d.target.y;
}
function renderTreeView(dom, width, height, treeData) {
	const svg = d3.select(dom).append('svg').attr('width', width).attr('height', height);

	const links = svg
		.selectAll('.link')
		.data(treeData.links())
		.enter()
		.append('path')
		.attr('fill', 'none')
		.attr('stroke', '#ccc')
		.attr('stroke-width', 1)
		.attr('d', (d) => getPath(d));

	const nodes = svg
		.selectAll('.node')
		.data(treeData.descendants())
		.enter()
		.append('g')
		.attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
		.attr('class', 'node');

	nodes.append('circle').attr('fill', '#ccc').attr('r', (d) => {
		return 10;
	});

	nodes
		.append('text')
		.text((d) => d.data.name)
		.attr('font-size', 10)
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'middle')
		.attr('fill', '#ffffff');
}
export const renderTree = function(dom, data) {
	const { width, height } = getDOMRect(dom);
	const treeData = getTreeData(data, width, height);
	renderTreeView(dom, width, height, treeData);
};
