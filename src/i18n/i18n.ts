import { zhcn } from "./zh-cn/zh-cn";
import { engl } from "./en-gl/en-gl";
export class I18n {
  language: string;
  constructor(language?: string) {
    this.language = language || "en";
  }
  setLanguage(language: string) {
    this.language = language || "en";
  }
  getText(text: string) {
    if (this.language === "en") {
      return engl[text];
    } else if (this.language === "zh-cn") {
      return zhcn[text] || engl[text];
    }
  }
}
export const i18n = new I18n();
