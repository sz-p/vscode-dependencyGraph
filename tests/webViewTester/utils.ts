export const defineGetClientRectsToDiv = function (dom) {
  dom.window.HTMLElement.prototype.getClientRects = function () {
    return [{
      width: parseFloat(this.style.width) || 0,
      height: parseFloat(this.style.height) || 0,
      top: parseFloat(this.style.marginTop) || 0,
      left: parseFloat(this.style.marginLeft) || 0
    }]
  }
}
