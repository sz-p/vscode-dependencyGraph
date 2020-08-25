import * as d3 from 'd3';
import { throttle } from '../../utils/utils';
export const initZoom = function(svg, svgBox, PADDING) {
	const zoomed = function() {
		const transform = d3.event.transform;
		svg.attr('transform', transform);
	};
	const zoom = d3.zoom();
	zoom.on('zoom', zoomed);
	svgBox.call(zoom);
	svgBox.call(zoom.translateBy, PADDING.LEFT, PADDING.TOP);
};

export const getDOMRect = function(dom) {
	return dom.getClientRects()[0];
};

export const treeLayout = function(width, height, PADDING) {
	const treemap = d3.tree().size([ height - PADDING.LEFT - PADDING.RIGHT, width - PADDING.BOTTOM - PADDING.TOP ]);
	return treemap;
};

export const collapse = function(d) {
	if (d.children) {
		d._children = d.children;
		d._children.forEach(collapse);
		d.children = null;
	}
};

const diagonal = function(s, d) {
	const path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;

	return path;
};

const click = function(svg, treemap, root, options) {
	return function(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		updateTree(svg, d, treemap, root, options);
	};
};

const stashPositions = function(nodes) {
	nodes.forEach((d) => {
		d.x0 = d.x;
		d.y0 = d.y;
	});
};

const getNodesLinks = function(treeData) {
	const treeNodes = treeData.descendants();
	const treeLinks = treeData.descendants().slice(1);
	return {
		treeNodes,
		treeLinks
	};
};

const fixDepth = function(treeNodes, DEPTH_LENGTH) {
	treeNodes.forEach((d) => {
		d.y = d.depth * DEPTH_LENGTH;
	});
};

const getNodesData = function(svg, treeNodes) {
	return svg.selectAll('g.node').data(treeNodes, (d) => d.data.name);
};

export const updateTree = function(svg, source, treemap, root, options) {
	const { DEPTH_LENGTH, CIRCLE_R, DURATION_TIME, NODE_TEXT_OFFSET_X, CLICK_DALEY } = options;
	const treeData = treemap(root);
	const { treeNodes, treeLinks } = getNodesLinks(treeData);
	fixDepth(treeNodes, DEPTH_LENGTH);
	const nodesData = getNodesData(svg, treeNodes);

	const nodeDom = nodesData
		.enter()
		.append('g')
		.attr('class', 'node')
		.attr('transform', () => 'translate(' + source.y0 + ',' + source.x0 + ')')
		.on('click', throttle(click(svg, treemap, root, options), CLICK_DALEY))
		.style('cursor', (d) => (d.children || d._children ? 'pointer' : 'auto'));

	nodeDom.append('circle').attr('class', 'node').attr('r', 0);

	nodeDom
		.append('text')
		.style('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
		.attr('x', (d) => (d.children || d._children ? -NODE_TEXT_OFFSET_X : NODE_TEXT_OFFSET_X))
		.text((d) => d.data.name)
		.style('fill-opacity', 0);

	// UPDATE
	const nodeEnter = nodeDom.merge(nodesData);

	// Transition to the proper position for the node
	nodeEnter
		.transition()
		.duration(DURATION_TIME)
		.attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')')
		.style('fill-opacity', 1);

	nodeEnter.select('circle.node').transition().duration(DURATION_TIME).attr('r', CIRCLE_R);
	nodeEnter.select('text').transition().duration(DURATION_TIME).style('fill-opacity', 1);

	// Remove any exiting nodes
	const nodeExit = nodesData
		.exit()
		.transition()
		.duration(DURATION_TIME)
		.attr('transform', () => 'translate(' + source.y + ',' + source.x + ')')
		.remove();

	// On exit reduce the node circles size to 0
	nodeExit.select('circle').attr('r', 0);

	// On exit reduce the opacity of text labels
	nodeExit.select('text').style('fill-opacity', 0);

	const linkData = svg.selectAll('path.link').data(treeLinks, (d) => d.data.name);

	const linkDom = linkData.enter().insert('path', 'g').attr('class', 'link').attr('d', (d) => {
		const o = { x: source.x0, y: source.y0 };
		return diagonal(o, o);
	});

	const linkEnter = linkDom.merge(linkData);

	linkEnter.transition().duration(DURATION_TIME).attr('d', (d) => diagonal(d, d.parent));

	const linkExit = linkData
		.exit()
		.transition()
		.duration(DURATION_TIME)
		.attr('d', function(d) {
			const o = { x: source.x, y: source.y };
			return diagonal(o, o);
		})
		.remove();

	stashPositions(treeNodes);
};
