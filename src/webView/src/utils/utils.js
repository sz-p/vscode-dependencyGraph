export const throttle = function (func, delay) {
  let prev = Date.now();
  return function () {
    const context = this;
    const args = arguments;
    const now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};

export const isWindows = function() {
  // Detect OS using process.platform if available, otherwise fallback to window.navigator.userAgent
  let isWindows = false;
  if (typeof process !== "undefined" && process.platform) {
    isWindows = process.platform === "win32";
  } else if (typeof window !== "undefined" && window.navigator) {
    isWindows = /Windows/i.test(window.navigator.userAgent);
  }
  return isWindows
}
