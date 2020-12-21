import { DependencyTreeData as DTD } from "../data-dependencyTree/dependencyTreeData.d";
export const setFileLanguage = (dependencyNode: DTD): void => {
  switch (dependencyNode.extension) {
    case ".css":
    case ".less":
    case ".sass":
    case ".scss":
      dependencyNode.language = "css";
      break;
    case ".js":
    case ".jsx":
    case ".vue":
    case ".js":
      dependencyNode.language = "javascript";
      break;
    default:
      dependencyNode.language = "file";
  }
};
