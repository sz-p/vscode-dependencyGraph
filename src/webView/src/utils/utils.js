export const throttle = function(func, delay) {
	let prev = Date.now();
	return function() {
		const context = this;
		const args = arguments;
		const now = Date.now();
		if (now - prev >= delay) {
			func.apply(context, args);
			prev = Date.now();
		}
	};
};
