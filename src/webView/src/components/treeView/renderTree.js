import * as d3 from 'd3';

import { getDOMRect, renderTreeView, zoom, getTreeData } from './treeMethods';
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
function collapse(d) {
	if (d.children) {
		d._children = d.children;
		d._children.forEach(collapse);
		d.children = null;
	}
}

export const renderTree = function(dom, data) {
	const { width, height } = getDOMRect(dom);

	const svgBox = d3.select(dom).append('svg').attr('width', width).attr('height', height);
	const svg = svgBox.append('g').attr('transform', 'translate(' + PADDING.LEFT + ',' + PADDING.TOP + ')');

	svgBox.call(zoom(svg));

	const treemap = d3.tree().size([ height, width ]);

	const root = d3.hierarchy(data, function(d) {
		return d.children;
	});
	root.x0 = height / 2;
	root.y0 = 0;

	root.children.forEach(collapse);
	function update(source) {
		const treeData = treemap(root);

		// Compute the new tree layout.
		const nodes = treeData.descendants();
		const links = treeData.descendants().slice(1);

		// Normalize for fixed-depth.
		nodes.forEach((d) => {
			d.y = d.depth * DEPTH_LENGTH;
		});

		// ****************** Nodes section ***************************

		// Update the nodes...
		var node = svg.selectAll('g.node').data(nodes, function(d) {
			console.log(d);
			return d.data.name;
		});

		// Enter any new modes at the parent's previous position.
		var nodeEnter = node
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d) {
				return 'translate(' + source.y0 + ',' + source.x0 + ')';
			})
			.on('click', click);

		// Add Circle for the nodes
		nodeEnter.append('circle').attr('class', 'node').attr('r', 1e-6).style('fill', function(d) {
			return d._children ? 'lightsteelblue' : '#fff';
		});

		// Add labels for the nodes
		nodeEnter
			.append('text')
			.attr('dy', '.35em')
			.attr('x', function(d) {
				return d.children || d._children ? -13 : 13;
			})
			.attr('text-anchor', function(d) {
				return d.children || d._children ? 'end' : 'start';
			})
			.text(function(d) {
				return d.data.name;
			});

		// UPDATE
		var nodeUpdate = nodeEnter.merge(node);

		// Transition to the proper position for the node
		nodeUpdate.transition().duration(DURATION_TIME).attr('transform', function(d) {
			return 'translate(' + d.y + ',' + d.x + ')';
		});

		// Update the node attributes and style
		nodeUpdate
			.select('circle.node')
			.attr('r', 10)
			.style('fill', function(d) {
				return d._children ? 'lightsteelblue' : '#fff';
			})
			.attr('cursor', 'pointer');

		// Remove any exiting nodes
		var nodeExit = node
			.exit()
			.transition()
			.duration(DURATION_TIME)
			.attr('transform', function(d) {
				return 'translate(' + source.y + ',' + source.x + ')';
			})
			.remove();

		// On exit reduce the node circles size to 0
		nodeExit.select('circle').attr('r', 1e-6);

		// On exit reduce the opacity of text labels
		nodeExit.select('text').style('fill-opacity', 1e-6);

		// ****************** links section ***************************

		// Update the links...
		var link = svg.selectAll('path.link').data(links, function(d) {
			console.log(d);
			return d.data.name;
		});

		// Enter any new links at the parent's previous position.
		var linkEnter = link.enter().insert('path', 'g').attr('class', 'link').attr('d', function(d) {
			var o = { x: source.x0, y: source.y0 };
			return diagonal(o, o);
		});

		// UPDATE
		var linkUpdate = linkEnter.merge(link);

		// Transition back to the parent element position
		linkUpdate.transition().duration(DURATION_TIME).attr('d', function(d) {
			return diagonal(d, d.parent);
		});

		// Remove any exiting links
		var linkExit = link
			.exit()
			.transition()
			.duration(DURATION_TIME)
			.attr('d', function(d) {
				var o = { x: source.x, y: source.y };
				return diagonal(o, o);
			})
			.remove();

		// Store the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		// Creates a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {
			const path = `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;

			return path;
		}

		// Toggle children on click.
		function click(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}
	}
	update(root);

	// renderTreeView(svg, hierarchyData, width, height, { CIRCLE_R, PADDING, NODE_TEXT_OFFSET_X, DURATION_TIME });
};
