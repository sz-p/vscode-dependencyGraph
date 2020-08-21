import * as d3 from 'd3';

const getPath = function(d) {
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

const clickNode = function(renderTreeView, svg, data, width, height, options) {
	return function(d) {
		if (d.data.children) {
			d.data._children = d.data.children;
			d.data.children = null;
		} else {
			d.data.children = d.data._children;
			d.data._children = null;
		}
		renderTreeView(svg, data, width, height, options);
	};
};

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

const fixDepth = function(nodes) {
	nodes.eachBefore((d) => {
		d.y = d.depth * 180;
	});
};
const stashOldPosition = function(nodes) {
	nodes.eachBefore((d) => {
		d.x0 = d.x;
		d.y0 = d.y;
	});
};
export const renderTreeView = function(svg, data, width, height, options) {
	const { NODE_TEXT_OFFSET_X, CIRCLE_R, PADDING, DURATION_TIME } = options;
	const treeData = getTreeData(data, width, height, PADDING);
  fixDepth(treeData)
	const linksData = svg.selectAll('.link').data(treeData.descendants().slice(1), (d) => {
		d.data.name;
	});

	linksData.exit().remove();

	const linksDom = linksData
		.enter()
		.append('path')
		.attr('class', 'link')
		.transition()
		.duration(DURATION_TIME)
		.attr('d', (d) => getPath(d));

	const nodesData = svg.selectAll('.node').data(treeData.descendants(), (d) => {
		d.data.name;
	});
	nodesData.exit().remove();

	const nodesDom = nodesData.enter().append('g').attr('class', 'node');
	nodesDom.transition().duration(DURATION_TIME).attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')');
	nodesDom
		.append('circle')
		.attr('r', CIRCLE_R)
		.on('click', clickNode(renderTreeView, svg, data, width, height, options))
		.style('cursor', (d) => (d.children ? 'pointer' : 'auto'));

	nodesDom
		.append('text')
		.style('text-anchor', (d) => {
			return d.children ? 'end' : 'start';
		})
		.attr('x', (d) => (d.children ? -NODE_TEXT_OFFSET_X : NODE_TEXT_OFFSET_X))
		.text((d) => d.data.name);
};
