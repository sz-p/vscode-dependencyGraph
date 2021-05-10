module.exports = function (api) {
  api.cache(true);
  const presets = [
    // babel 预设套件 根据配置的目标浏览器或者运行环境来自动将ES2015+的代码转换为es5
    "@babel/preset-env",
    // 将 jsx 代码解析成通用代码
    "babel-preset-react-app",
  ];
  const sourceType = "unambiguous";
  return {
    presets,
    sourceType,
  };
};
