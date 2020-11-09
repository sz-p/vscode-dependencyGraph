import * as _ from 'lodash'
import {
  DependencyTreeData
} from '../../data-dependencyTree/dependencyTreeData';

interface DependencyHash {
  [key: string]: DependencyTreeData;
}


const CircularStructureNode = {
  name: 'circularStructure',
  type: 'circularStructure',
  circularStructure: true,
  analysed: false,
  absolutePath: 'circularStructure',
  relativePath: 'circularStructure',
  extension: '',
  ancestors: [] as string[]
} as DependencyTreeData
/**
 * use absolutePath and ancestors find circular structure
 *
 * @param {string} absolutePath
 * @param {string[]} ancestors
 * @returns {boolean}
 */
export const isCircularStructure = function (absolutePath: string, ancestors: string[]): boolean {
  for (let i = 0; i < ancestors.length; i++) {
    if (absolutePath === ancestors[i]) {
      return true;
    }
  }
  return false;
}
/**
 * if fended CircularStructure create CircularStructureNode
 *
 * @param {string} absolutePath
 * @param {DependencyHash} dependencyHash
 * @returns {DependencyTreeData}
 */
export const getCircularStructureNode = function (absolutePath: string, dependencyHash: DependencyHash): DependencyTreeData {
  let circularStructureNode = _.cloneDeep(dependencyHash[absolutePath])
  const circularStructureNodeChild = _.cloneDeep(CircularStructureNode)
  circularStructureNodeChild.ancestors = circularStructureNode.ancestors.concat(absolutePath)
  circularStructureNode.children = [circularStructureNodeChild];
  return circularStructureNode;
}
