import { DependencyTree } from "./core/dependencyTree";

import { DependencyTreeOptions } from "./index.d";
const dp = new DependencyTree();

const getDependencyTree = function (
  folderPath: string,
  entryPath: string,
  options?: DependencyTreeOptions
) {
  if (options) dp.setOptions(options);
  dp.registerParser("generalJsParser", DependencyTree.generalJsParser);
  dp.registerParser("vueParser", DependencyTree.vueParser);
  dp.registerParser("noDependenceParser", DependencyTree.noDependenceParser);
  dp.registerParser("cssParser", DependencyTree.cssParser);

  dp.registerParseRule(".json", 'noDependenceParser');

  dp.registerParseRule(".vue", 'vueParser');

  dp.registerParseRule(".css", "cssParser");

  dp.registerParseRule(".js", "generalJsParser");
  dp.registerParseRule(".ts", "generalJsParser");
  dp.registerParseRule(".jsx", "generalJsParser");
  dp.registerParseRule(".tsx", "generalJsParser");

  return dp.parse(folderPath, entryPath);
};
export { getDependencyTree, DependencyTree, dp };
