import {
  msgExportSvg,
  msgExportPng,
  msgWebViewLog,
} from "../../utils/messages";
import { svgAsPngUri, prepareSvg } from "save-svg-as-png";
import * as d3 from "d3";

const getTopNodePosition = function () {
  let topNodeY = 0;
  d3.select("#treeViewSvg")
    .selectAll("g.node")
    .each(function (d) {
      const transform = d3.select(this).attr("transform");
      if (transform) {
        const y = parseInt(transform.split(",")[1].replace(")", ""));
        if (y < topNodeY) {
          topNodeY = y;
        }
      }
    });
  return -topNodeY;
};
const beforeExport = function () {
  const padding = 100;
  const defaultPaddingLeft = 100;
  const svgDom = document.getElementById("treeViewSvgBox");
  const svgNode = document.getElementById("treeViewSvg");
  const transform = svgNode.getAttribute("transform");
  svgNode.setAttribute("transform", `translate(${padding},0) scale(1)`);
  let { width, height } = svgNode.getBoundingClientRect();
  width = width + defaultPaddingLeft;
  const topNodeY = getTopNodePosition();
  svgNode.setAttribute(
    "transform",
    `translate(${padding + defaultPaddingLeft},${topNodeY + padding}) scale(1)`
  );
  const newWith = width + padding * 2;
  const newHeight = height + padding * 2;
  return { svgDom, svgNode, newWith, newHeight, transform };
};
const afterExport = function (svgNode, transform) {
  svgNode.setAttribute("transform", transform);
};
const getOptions = function (newHeight, newWith) {
  return {
    height: newHeight,
    width: newWith,
    excludeCss: true,
    modifyStyle: function (styleText) {
      const rex = /var\([^\)]*/g;
      let newStyle = styleText.replace(rex, (w) => {
        return getComputedStyle(document.documentElement).getPropertyValue(
          w.replace("var(", "")
        );
      });
      newStyle = newStyle.replace(/\)/g, "");
      return newStyle;
    },
  };
};
export const exportSvg = function () {
  const { svgDom, svgNode, newWith, newHeight, transform } = beforeExport();
  prepareSvg(svgDom, getOptions(newHeight, newWith))
    .then((src) => {
      let svgText = src.src;
      // const rex = /@font-face (.*) \}/g;
      const rex = /<style(([\s\S])*?)<\/style>/g;
      let svgWithOutFontFace = svgText.replace(rex, "");
      msgExportSvg(svgWithOutFontFace).post();
      afterExport(svgNode, transform);
    })
    .catch((e) => {
      msgWebViewLog("error", "exportSvgFailed", e);
      afterExport(svgNode, transform);
    });
};
export const exportPng = function () {
  const { svgDom, svgNode, newWith, newHeight, transform } = beforeExport();
  svgAsPngUri(svgDom, getOptions(newHeight, newWith))
    .then((uri) => {
      msgExportPng(uri).post();
      afterExport(svgNode, transform);
    })
    .catch((e) => {
      msgWebViewLog("error", "exportPngFailed", e);
      afterExport(svgNode, transform);
    });
};
