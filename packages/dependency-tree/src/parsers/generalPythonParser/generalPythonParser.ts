import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import { triggerOnGotAST, resolveChildrenNodeError } from "../utils/utils";
import * as path from "path";
import * as fs from "fs";

// Tree-sitter types (we'll declare minimal types needed)
interface TreeSitterNode {
  type: string;
  text: string;
  childCount: number;
  child(index: number): TreeSitterNode;
  children: TreeSitterNode[];
  startPosition: { row: number; column: number };
  endPosition: { row: number; column: number };
}

interface TreeSitterTree {
  rootNode: TreeSitterNode;
}

interface TreeSitterParser {
  parse(code: string): TreeSitterTree;
}

interface TreeSitterLanguage {
  // Language object for tree-sitter-python
}

/**
 * General Python parser using tree-sitter AST
 * Follows same pattern as generalJavaScriptParser
 */
export const parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
  pythonParser: { parse: (code: string) => TreeSitterTree },
  parserOptions: Object = {}
): string[] {
  const dirName = path.dirname(absolutePath);
  let ast: TreeSitterTree | undefined = undefined;
  const dependencies: string[] = [];

  try {
    ast = pythonParser.parse(codeString);
  } catch (e) {
    console.error(`get AST error: ${absolutePath}`);
    return dependencies;
  }

  if (!ast) {
    console.error(`get AST error: ${absolutePath}`);
    return dependencies;
  }

  // Trigger AST callback for file analysis
  triggerOnGotAST(dependencyNode, absolutePath, options, ast);

  // Reuse existing Python path resolution functions from pythonParser.ts
  function resolvePythonPath(contextDir: string, moduleSpecifier: string): string | undefined {
    // If moduleSpecifier is already absolute, return it
    if (path.isAbsolute(moduleSpecifier)) {
      return moduleSpecifier;
    }

    // moduleSpecifier should already be normalized by getModulePathToResolve
    // It may contain relative prefixes (., ..) and slashes
    let specifier = moduleSpecifier;

    // Resolve relative to context directory
    let resolved = path.resolve(contextDir, specifier);

    // Try with .py extension if no extension present
    if (!path.extname(resolved)) {
      const withPy = resolved + '.py';
      if (fs.existsSync(withPy)) {
        return withPy;
      }
      // Also check if it's a directory with __init__.py
      const initPy = path.join(resolved, '__init__.py');
      if (fs.existsSync(initPy)) {
        return initPy;
      }
      // If not found, still return the .py path (let caller handle missing files)
      return withPy;
    }

    // Ensure we return an absolute path
    if (!path.isAbsolute(resolved)) {
      // This shouldn't happen with path.resolve, but just in case
      return path.resolve(resolved);
    }

    return resolved;
  }

  /**
   * Convert Python module specifier to a path that can be resolved by enhanced-resolve
   */
  function getModulePathToResolve(module: string, importedName?: string): string {
    // Handle relative imports (starting with dot)
    if (module.startsWith('.')) {
      // Count leading dots for relative depth
      const leadingDots = module.match(/^\.+/)?.[0] || '';
      const rest = module.slice(leadingDots.length);

      // Convert dots in the rest of the module to slashes (for submodules)
      const restPath = rest.replace(/\./g, '/');

      // Reconstruct path with leading dots (converted to ./ or ../ etc.)
      let modulePath = leadingDots.replace(/\./g, '.') + restPath;

      // If it's just dots (e.g., from . import something), treat as current directory
      if (modulePath === '.') {
        modulePath = './';
      } else if (modulePath.startsWith('..') && !modulePath.includes('/')) {
        // e.g., '..' -> '../'
        modulePath = modulePath + '/';
      }

      if (importedName) {
        const importedPath = importedName.replace(/\./g, '/');
        return modulePath + importedPath;
      }
      return modulePath;
    }

    // Bare module name (no slashes, no dots) -> treat as relative import
    if (!module.includes('/') && !module.includes('\\') && !module.includes('.')) {
      return './' + module;
    }

    // Module with dots (e.g., package.module) -> convert dots to slashes
    if (module.includes('.') && !module.includes('/') && !module.includes('\\')) {
      return './' + module.replace(/\./g, '/');
    }

    // Already has path separators, return as is
    return module;
  }

  // Traverse AST and collect imports
  function traverse(node: TreeSitterNode) {
    if (node.type === 'import_statement') {
      processImportStatement(node);
    } else if (node.type === 'import_from_statement') {
      processImportFromStatement(node);
    }

    // Recurse through children
    for (let i = 0; i < node.childCount; i++) {
      traverse(node.child(i));
    }
  }

  /**
   * Recursively collect all module specifiers from an import node
   * Returns array of {moduleName: string, isAliased: boolean}
   */
  function collectImportSpecifiers(node: TreeSitterNode): Array<{moduleName: string, isAliased: boolean}> {
    const specifiers: Array<{moduleName: string, isAliased: boolean}> = [];

    function collect(node: TreeSitterNode) {
      if (node.type === 'dotted_name') {
        specifiers.push({moduleName: node.text, isAliased: false});
      } else if (node.type === 'aliased_import') {
        // Find the dotted_name child within aliased_import
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child.type === 'dotted_name') {
            specifiers.push({moduleName: child.text, isAliased: true});
            break;
          }
        }
      }

      // Recurse into children
      for (let i = 0; i < node.childCount; i++) {
        collect(node.child(i));
      }
    }

    collect(node);
    return specifiers;
  }

  function processImportStatement(node: TreeSitterNode) {
    // Collect all module specifiers in this import statement
    // (handles multiple imports like "import module1, module2" and aliases)
    const specifiers = collectImportSpecifiers(node);

    for (const specifier of specifiers) {
      try {
        const moduleToResolve = getModulePathToResolve(specifier.moduleName);
        const dependencyPath = resolvePythonPath(dirName, moduleToResolve);
        if (dependencyPath) {
          dependencies.push(dependencyPath);
        }
      } catch (e) {
        // Silently ignore resolution failures (likely system/third-party modules)
      }
    }
  }

  function processImportFromStatement(node: TreeSitterNode) {
    let moduleName = '';
    let isRelative = false;

    // First pass: extract module name or relative import
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child.type === 'dotted_name') {
        // Absolute module name
        moduleName = child.text;
        break;
      } else if (child.type === 'relative_import') {
        // Relative import like ., .., ...
        isRelative = true;
        // relative_import text includes dots and possibly module name (e.g., '..parent')
        // We'll use the full text as module name
        moduleName = child.text;
        break;
      }
    }

    if (!moduleName) {
      // No module found (shouldn't happen in valid Python)
      return;
    }

    // Collect all imported specifiers (dotted_name or aliased_import) in this statement
    // Skip nodes before the 'import' keyword
    let foundImportKeyword = false;
    const specifiers: Array<{importedName: string, isAliased: boolean}> = [];

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child.type === 'import') {
        foundImportKeyword = true;
        continue;
      }

      if (foundImportKeyword) {
        if (child.type === 'dotted_name') {
          specifiers.push({importedName: child.text, isAliased: false});
        } else if (child.type === 'aliased_import') {
          // Find the dotted_name child within aliased_import
          for (let j = 0; j < child.childCount; j++) {
            const grandchild = child.child(j);
            if (grandchild.type === 'dotted_name') {
              specifiers.push({importedName: grandchild.text, isAliased: true});
              break;
            }
          }
        }
        // Note: comma separator nodes (',') are ignored
        // Also ignore wildcard imports ('*') for now
      }
    }

    // Process each imported specifier
    for (const specifier of specifiers) {
      try {
        const moduleToResolve = getModulePathToResolve(moduleName, specifier.importedName);
        const dependencyPath = resolvePythonPath(dirName, moduleToResolve);
        if (dependencyPath) {
          dependencies.push(dependencyPath);
        }
      } catch (e) {
        // Silently ignore resolution failures
      }
    }
  }

  // Start traversal from root
  traverse(ast.rootNode);

  // Remove duplicates and ensure absolute paths
  const uniqueDependencies = Array.from(new Set(dependencies));

  // Ensure all paths are absolute and normalized
  const normalizedDependencies = uniqueDependencies.map(dep => {
    if (path.isAbsolute(dep)) {
      return path.normalize(dep);
    }
    // If somehow a relative path slipped through, resolve it relative to dirName
    // This shouldn't happen if resolvePythonPath is working correctly
    return path.normalize(path.resolve(dirName, dep));
  });

  return normalizedDependencies;
};