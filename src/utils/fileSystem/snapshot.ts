import * as fs from "fs";
import * as path from "path";
import { TransportsData } from "../../data-dependencyTree/dependencyTreeData";
import { beforeSetDataToLocal } from "../utils";
import { getCurrentFolderPath } from "../getCurrentFolderPath";

const getSnapshotFilePath = (dirPath: string): string =>
  path.join(dirPath, ".dependencygraph", "dependencygraphsnapshot.json");

export const writeSnapshot = (data: TransportsData): void => {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return;

  const pathById: Record<string, string> = {};
  for (const node of data.nodes) {
    pathById[node.fileID] = node.relativePath;
  }

  const graph: Record<string, string[]> = {};
  for (const node of data.nodes) {
    const deps = node.children.map((id) => pathById[id]).filter(Boolean);
    if (deps.length > 0) {
      graph[node.relativePath] = deps;
    }
  }

  const snapshot = {
    generated: new Date().toISOString(),
    root: pathById[data.rootId] ?? "",
    graph,
  };

  beforeSetDataToLocal(dirPath);
  try {
    fs.writeFileSync(getSnapshotFilePath(dirPath), JSON.stringify(snapshot, null, 2));
  } catch (_e) {
    // non-critical — silent fail
  }
};
