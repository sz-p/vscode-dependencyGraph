import * as path from "path";
import * as fs from "fs";
import {
  getIntroduction,
  getDescription,
} from "../../../src/fileAnalysis/fileAnalysis";
import { expect } from '../../chai';
const getCodeString = function (testCase: string) {
  return fs
    .readFileSync(path.resolve(__dirname, `./data/${testCase}.js`))
    .toString();
};
describe("fileAnalysis(crlf)", function () {
  const codeString = getCodeString("crlf");
  it("Introduction", function () {
    expect(getIntroduction(codeString)).to.equal("main file");
  });
  it("description", function () {
    expect(getDescription(codeString)).to.equal(
      "application will start from this file"
    );
  });
});
describe("fileAnalysis(doubleSlash)", function () {
  const codeString = getCodeString("doubleSlash");
  it("Introduction", function () {
    expect(getIntroduction(codeString)).to.equal("main file");
  });
  it("description", function () {
    expect(getDescription(codeString)).to.equal(
      "application will start from this file"
    );
  });
});
describe("fileAnalysis(downword)", function () {
  const codeString = getCodeString("downword");
  it("Introduction", function () {
    expect(getIntroduction(codeString)).to.equal("main file");
  });
  it("description", function () {
    expect(getDescription(codeString)).to.equal(
      "application will start from this file"
    );
  });
});
describe("fileAnalysis(lf)", function () {
  const codeString = getCodeString("lf");
  it("Introduction", function () {
    expect(getIntroduction(codeString)).to.equal("main file");
  });
  it("description", function () {
    expect(getDescription(codeString)).to.equal(
      "application will start from this file"
    );
  });
});
describe("fileAnalysis(upword)", function () {
  const codeString = getCodeString("upword");
  it("Introduction", function () {
    expect(getIntroduction(codeString)).to.equal("main file");
  });
  it("description", function () {
    expect(getDescription(codeString)).to.equal(
      "application will start from this file"
    );
  });
});
