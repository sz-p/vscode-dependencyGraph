import * as path from 'path';
import { NodePath } from 'ast-types/lib/node-path';
import { namedTypes } from 'ast-types/gen/namedTypes';
import { pathExists } from '../../utils/utils';
const getAbsoluteOriginPathInJs = function(filePath: string, extensions: string[]): string | false {
  if (pathExists(filePath)) {
    return filePath;
  }
  for (let i = 0; i < extensions.length; i++) {
		const importedPath = filePath + extensions[i];
		if (pathExists(importedPath)) {
			return importedPath;
		}
  }
	return false;
};

const getOriginByAlias = function(filePath: string, alias: string[], extensions: string[]): string | false {
	//TODO getOriginByAlias
	let pathInAlias = filePath;
	return getAbsoluteOriginPathInJs(pathInAlias, extensions);
};

export const getImport = function(
	nodePath: NodePath<namedTypes.ImportDeclaration>,
	dirName: string,
	extensions: string[]
): string | false {
	if (typeof nodePath.node.source.value !== 'string') return false;
	const importedPath = getOriginByAlias(path.join(dirName, nodePath.node.source.value), [], extensions);
	return importedPath;
};
export const getRequire = function(nodePath: NodePath<namedTypes.Identifier>, dirName: string) {
	if (nodePath.name !== 'require') {
		return false;
	} else {
		console.log('require');
	}
};
