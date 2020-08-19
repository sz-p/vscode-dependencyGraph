import * as d3 from 'd3';

export const zoom = function(svg) {
	const zoomed = function() {
		const transform = d3.event.transform;
		svg.attr('transform', transform);
	};
	return d3.zoom().on('zoom', zoomed);
};
export const getTreeData = function(data, width, height, PADDING) {
	const treeData = d3.tree().size([ height - PADDING.LEFT - PADDING.RIGHT, width - PADDING.BOTTOM - PADDING.TOP ])(
		d3.hierarchy(data)
	);
	return treeData;
};
export const getDOMRect = function(dom) {
	return dom.getClientRects()[0];
};
export const getPath = function(d) {
	return (
		'M' +
		d.y +
		',' +
		d.x +
		'C' +
		(d.y + d.parent.y) / 2 +
		',' +
		d.x +
		' ' +
		(d.y + d.parent.y) / 2 +
		',' +
		d.parent.x +
		' ' +
		d.parent.y +
		',' +
		d.parent.x
	);
};
