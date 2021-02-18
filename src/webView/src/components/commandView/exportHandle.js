import { msgExportSvg, msgExportPng } from '../../utils/messages';
import { prepareSvg, svgAsPngUri } from 'save-svg-as-png';
const beforeExport = function() {
	const padding = 100;
	const svgDom = document.getElementById('treeViewSvgBox');
	const svgNode = document.getElementById('treeViewSvg');
	const transform = svgNode.getAttribute('transform');
	svgNode.setAttribute('transform', `translate(${padding},0) scale(1)`);
	const { width, height } = svgNode.getBoundingClientRect();
	svgNode.setAttribute('transform', `translate(${padding},${height / 2 + padding}) scale(1)`);
	const newWith = width + padding * 2;
	const newHeight = height + padding * 2;
	return { svgDom, svgNode, newWith, newHeight, transform };
};
const afterExport = function(svgNode, transform) {
	svgNode.setAttribute('transform', transform);
};
const getOptions = function(newHeight, newWith) {
	return {
		height: newHeight,
		width: newWith,
		modifyStyle: function(cssText) {
			const rex = /var\([^\)]*/g;
			let newCss = cssText.replace(rex, (w) => {
				return getComputedStyle(document.documentElement).getPropertyValue(w.replace('var(', ''));
			});
			newCss = newCss.replace(/\)/g, '');
			return newCss;
		}
	};
};
export const exportSvg = function() {
	const { svgDom, svgNode, newWith, newHeight, transform } = beforeExport();
	prepareSvg(svgDom, getOptions(newHeight, newWith))
		.then((src) => {
			msgExportSvg(src.src).post();
			afterExport(svgNode, transform);
		})
		.catch(() => {
			afterExport(svgNode, transform);
		});
};
export const exportPng = function() {
	const { svgDom, svgNode, newWith, newHeight, transform } = beforeExport();
	svgAsPngUri(svgDom, getOptions(newHeight, newWith))
		.then((uri) => {
			msgExportPng(uri).post();
			afterExport(svgNode, transform);
		})
		.catch(() => {
			afterExport(svgNode, transform);
		});
};
