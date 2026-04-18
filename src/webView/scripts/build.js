process.env.NODE_ENV = "production";

// webpack 5.46 uses md4 internally which is unsupported by OpenSSL 3 (Node.js 17+)
const crypto = require("crypto");
const origCreateHash = crypto.createHash.bind(crypto);
crypto.createHash = (algorithm) => origCreateHash(algorithm === "md4" ? "sha256" : algorithm);

const utils = require("../../../utils/utils");
const paths = require("../config/paths");
const config = require("../config/webpack.config");
const { buildSources } = utils;

buildSources(config, paths.build);
