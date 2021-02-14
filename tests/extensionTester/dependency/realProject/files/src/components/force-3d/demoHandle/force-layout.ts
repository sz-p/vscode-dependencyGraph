import force3D from 'force-3d';

export default function(data) {
	const width = 500;
	const height = 500;
	const long = 500;
	const force = force3D.force().size([ width, height, long ]).center(0, 0, 0).nodes(data.nodes).links(data.links);

	force.on('start', function() {}).on('end', function() {}).on('tick', function() {}).start();
}
