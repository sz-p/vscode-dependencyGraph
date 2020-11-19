process.env.NODE_ENV = "production";
const utils = require("../../../utils/utils");
const paths = require("../config/paths");
const config = require("../config/webpack.config");
const { buildSources } = utils;

buildSources(config, paths.build);
