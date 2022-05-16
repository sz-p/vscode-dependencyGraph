import { DependencyTree } from "./core/dependencyTree";

export { DependencyTreeOptions, Alias, Parsers, Parser, ParseRule, DependencyHash, DependencyTreeData } from "./index.d";
import { DependencyTreeOptions } from "./index.d"
export { defaultOptions } from "./core/defaultOptions";
const dp = new DependencyTree();

const getDependencyTree = function (
  folderPath: string,
  entryPath: string,
  options?: DependencyTreeOptions
) {
  if (options) dp.setOptions(options);
  dp.registerParser("jsParser", DependencyTree.jsParser);
  dp.registerParser("vueParser", DependencyTree.vueParser);
  dp.registerParser("noDependenceParser", DependencyTree.noDependenceParser);
  dp.registerParser("cssParser", DependencyTree.cssParser);
  dp.registerParser("generalCssParser", DependencyTree.generalCssParser);
  dp.registerParser("tsParser", DependencyTree.tsParser);
  dp.registerParser("tsxParser", DependencyTree.tsxParser);

  dp.registerParseRule(".json", "noDependenceParser");

  dp.registerParseRule(".vue", "vueParser");

  dp.registerParseRule(".css", "generalCssParser");
  dp.registerParseRule(".less", "generalCssParser");
  dp.registerParseRule(".sass", "generalCssParser");
  dp.registerParseRule(".scss", "generalCssParser");

  dp.registerParseRule(".js", "jsParser");
  dp.registerParseRule(".ts", "tsParser");
  dp.registerParseRule(".jsx", "jsParser");
  dp.registerParseRule(".tsx", "tsxParser");

  return dp.parse(folderPath, entryPath);
};
export { getDependencyTree, DependencyTree, dp };
