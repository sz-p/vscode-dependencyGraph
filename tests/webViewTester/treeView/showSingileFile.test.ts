import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';
import { D3Tree } from '../../../src/webView/src/components/treeView/renderTree.js';
import { defineGetClientRectsToDiv } from "../utils";
const htmlTemplate = fs.readFileSync(path.resolve(__dirname, `./htmlTemplate.html`)).toString();
const dom = new JSDOM(htmlTemplate);
defineGetClientRectsToDiv(dom);
const tree = new D3Tree(dom.window);
const dependencyTreeData = {
  absolutePath: '%DIR-PATH%\\src\\index.js',
  analysed: true,
  ancestors: [],
  children: [],
  circularStructure: undefined,
  extension: '.js',
  fileDescription: {},
  fileID: '43351ecb56f3a7e10f80143f717fe4ea',
  functions: [],
  id: '43351ecb56f3a7e10f80143f717fe4ea',
  language: 'javascript',
  lines: 1,
  name: 'index.js',
  nodeID: '43351ecb56f3a7e10f80143f717fe4ea',
  relativePath: '\\src\\index.js',
  type: 'javascript'
};
const svgContainer = dom.window.document.getElementsByClassName('treeView')[0];
tree.init(svgContainer, dependencyTreeData, '', 'dark');
describe('webView render tree(show single file)', function () {
  it('show svg-dom', function () {
    expect(dom.window.document.getElementById('treeViewSvgBox')).not.be.null;
  });
  it('show svg-g', function () {
    expect(dom.window.document.getElementById('treeViewSvg')).not.be.null;
  });
  it('show svg-node', function () {
    expect(dom.window.document.getElementsByClassName('node')).not.be.null;
  });
});
