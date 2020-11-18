process.env.NODE_ENV = 'development';
const utils = require('../utils/utils');
const paths = require('../config/paths');
const config = require('../config/webpack.config');
const { buildAndWatchSources } = utils

buildAndWatchSources(config, paths.build)
