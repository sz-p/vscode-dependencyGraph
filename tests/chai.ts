import * as chai from "chai"
chai.config.showDiff = false; // turn off reporter diff display
chai.config.truncateThreshold = 0;
export const expect = chai.expect;
export const assert = chai.assert;
console.log(chai.config)
