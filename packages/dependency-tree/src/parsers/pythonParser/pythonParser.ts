import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import { triggerOnGotAST } from "../utils/utils";
import * as path from "path";
import * as fs from "fs";

// 是否启用 tree-sitter 解析器
// 可以通过环境变量 DEPENDENCY_GRAPH_USE_TREE_SITTER 控制
const USE_TREE_SITTER = true

// ============================================
// 正则表达式解析器（回退方案）
// ============================================
function regexPythonParser(
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
): string[] {
  const dependencies: string[] = [];
  const dirName = path.dirname(absolutePath);
  const { resolveExtensions, alias } = options;

  // Python-specific path resolution (same as before)
  function resolvePythonPath(contextDir: string, moduleSpecifier: string): string | undefined {
    if (path.isAbsolute(moduleSpecifier)) {
      return moduleSpecifier;
    }

    let specifier = moduleSpecifier;
    let resolved = path.resolve(contextDir, specifier);

    if (!path.extname(resolved)) {
      const withPy = resolved + '.py';
      if (fs.existsSync(withPy)) {
        return withPy;
      }
      const initPy = path.join(resolved, '__init__.py');
      if (fs.existsSync(initPy)) {
        return initPy;
      }
      return withPy;
    }

    if (!path.isAbsolute(resolved)) {
      return path.resolve(resolved);
    }

    return resolved;
  }

  function getModulePathToResolve(module: string, importedName?: string): string {
    if (module.startsWith('.')) {
      const leadingDots = module.match(/^\.+/)?.[0] || '';
      const rest = module.slice(leadingDots.length);
      const restPath = rest.replace(/\./g, '/');
      let modulePath = leadingDots.replace(/\./g, '.') + restPath;

      if (modulePath === '.') {
        modulePath = './';
      } else if (modulePath.startsWith('..') && !modulePath.includes('/')) {
        modulePath = modulePath + '/';
      }

      if (importedName) {
        const importedPath = importedName.replace(/\./g, '/');
        return modulePath + importedPath;
      }
      return modulePath;
    }

    if (!module.includes('/') && !module.includes('\\') && !module.includes('.')) {
      return './' + module;
    }

    if (module.includes('.') && !module.includes('/') && !module.includes('\\')) {
      return './' + module.replace(/\./g, '/');
    }

    return module;
  }

  const importRegex = /^\s*import\s+([^#\n]+)/gm;
  const fromImportRegex = /^\s*from\s+([^\s]+)\s+import\s+([^#\n]+)/gm;

  let match;
  while ((match = importRegex.exec(codeString)) !== null) {
    const importStatement = match[1].trim();
    const modules = importStatement.split(',').map(m => m.trim().split(/\s+/)[0]);
    for (const module of modules) {
      if (!module) continue;
      try {
        const moduleToResolve = getModulePathToResolve(module);
        const dependencyPath = resolvePythonPath(dirName, moduleToResolve);
        if (dependencyPath) {
          dependencies.push(dependencyPath);
        }
      } catch (e) {
        // Silently ignore resolution failures
      }
    }
  }

  while ((match = fromImportRegex.exec(codeString)) !== null) {
    const module = match[1].trim();
    const importClause = match[2].trim();
    if (!module) continue;

    const importItems = importClause.split(',').map(item => {
      return item.trim().split(/\s+/)[0];
    }).filter(Boolean);

    for (const importedName of importItems) {
      try {
        const moduleToResolve = getModulePathToResolve(module, importedName);
        const dependencyPath = resolvePythonPath(dirName, moduleToResolve);
        if (dependencyPath) {
          dependencies.push(dependencyPath);
        }
      } catch (e) {
        // Silently ignore resolution failures
      }
    }
  }

  // Trigger AST callback with minimal AST representation
  // This allows file analysis to work even with regex parser
  triggerOnGotAST(dependencyNode, absolutePath, options, {
    type: 'regex_ast',
    source: codeString,
    imports: dependencies.length
  });

  const uniqueDependencies = Array.from(new Set(dependencies));
  const normalizedDependencies = uniqueDependencies.map(dep => {
    if (path.isAbsolute(dep)) {
      return path.normalize(dep);
    }
    return path.normalize(path.resolve(dirName, dep));
  });

  return normalizedDependencies;
}

// ============================================
// Tree-sitter 解析器（主方案）
// ============================================
let treeSitterAvailable = false;
let treeSitterParser: any = null;
let treeSitterPython: any = null;

function tryInitializeTreeSitter(): boolean {
  // 如果配置为不使用 tree-sitter，直接返回 false
  if (!USE_TREE_SITTER) {
    return false;
  }

  if (treeSitterAvailable) {
    return true;
  }

  try {
    // 动态导入 tree-sitter 模块
    // 使用 require 避免在激活时立即失败
    //! fixme tree-sitter 依赖c++环境 目前编译有问题
    const TreeSitter = require('tree-sitter');
    const TreeSitterPython = require('tree-sitter-python');

    // 尝试初始化
    if (TreeSitterPython.init && typeof TreeSitterPython.init === 'function') {
      TreeSitterPython.init();
    }

    const parser = new TreeSitter();
    parser.setLanguage(TreeSitterPython);

    treeSitterParser = parser;
    treeSitterPython = TreeSitterPython;
    treeSitterAvailable = true;
    console.log('tree-sitter-python initialized successfully');
    return true;
  } catch (error) {
    console.warn('Failed to initialize tree-sitter-python, falling back to regex parser:', (error as Error).message);
    treeSitterAvailable = false;
    return false;
  }
}

// Tree-sitter AST 解析函数
function parseWithTreeSitter(codeString: string): any {
  if (!treeSitterAvailable && !tryInitializeTreeSitter()) {
    throw new Error('tree-sitter not available');
  }

  return treeSitterParser.parse(codeString);
}

// ============================================
// 主解析器函数
// ============================================
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
) {
  // 首先尝试使用 tree-sitter
  if (tryInitializeTreeSitter()) {
    try {
      // 导入通用 Python 解析器
      const { parser: generalPythonParser } = require("../generalPythonParser/generalPythonParser");

      const pythonParser = {
        parse: (code: string) => parseWithTreeSitter(code)
      };

      return generalPythonParser(dependencyNode, absolutePath, codeString, options, pythonParser);
    } catch (error) {
      console.warn('tree-sitter parsing failed, falling back to regex parser:', (error as Error).message);
      // 如果 tree-sitter 解析失败，回退到正则表达式
      return regexPythonParser(dependencyNode, absolutePath, codeString, options);
    }
  } else {
    // tree-sitter 不可用，直接使用正则表达式
    return regexPythonParser(dependencyNode, absolutePath, codeString, options);
  }
};

// 导出两个解析器以供测试
export const regexParser = regexPythonParser;
export const isTreeSitterAvailable = () => treeSitterAvailable;
