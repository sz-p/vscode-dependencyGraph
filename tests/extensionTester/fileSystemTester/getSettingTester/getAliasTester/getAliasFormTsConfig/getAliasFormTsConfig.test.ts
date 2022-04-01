import { getAliasFromLocalSetting } from "../../../../../../src/utils/fileSystem/setting/getAliasFromLocalSetting";

import { expect } from 'chai';
describe("getSettingFromLocal", function () {
  it("getAliasFromTsConfig", function () {
    const aliasSetting = getAliasFromLocalSetting(__dirname)
    expect(aliasSetting).to.deep.equal({ "@": "src" })
  });
});
