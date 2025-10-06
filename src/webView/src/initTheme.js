import {
  makeStyles,
  tokens,
  mergeClasses,
  createCSSRuleFromTheme,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";

const lightThemeCSS = createCSSRuleFromTheme(
  ".fluentui-light-theme",
  webLightTheme
);
const darkThemeCSS = createCSSRuleFromTheme(
  ".fluentui-dark-theme",
  webDarkTheme
);

const style = window.document.createElement("style");
document.head.appendChild(style);
style.sheet?.insertRule(lightThemeCSS);
style.sheet?.insertRule(darkThemeCSS);