process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const paths = require('../config/paths');
const fs = require('fs');
const pathExists = function(p) {
	try {
		fs.accessSync(p);
	} catch (err) {
		return false;
	}
	return true;
};
removeOldfiles();

const compiler = webpack(config);

compiler.run((err, stats) => {
	let messages;
	if (err) {
		messages = {
			errors: [ err.message ]
		};
		console.log(messages);
	} else {
		messages = stats.toJson({ all: false, warnings: true, errors: true });
	}
	if (messages.errors.length) {
		if (messages.errors.length > 1) {
			messages.errors.length = 1;
		}
		console.log(new Error(messages.errors.join('\n\n')));
	}
});

function removeOldfiles() {
	if (!pathExists(paths.build)) return;

	const directoryList = [ paths.build ];

	while (directoryList.length) {
		let path = directoryList[0];
		let filse = fs.readdirSync(path);
		directoryList.shift();
		filse.forEach((item) => {
			if (fs.lstatSync(path + '/' + item).isDirectory() === true) {
				directoryList.push(path + item + '/');
			} else {
				fs.unlink(path + '/' + item, () => {});
			}
		});
	}
}
