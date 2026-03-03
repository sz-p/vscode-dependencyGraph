import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import * as path from "path";
import * as fs from "fs";

/**
 * Extract import statements from Python code using regex.
 * Supports:
 *   import module
 *   import module as alias
 *   import module1, module2
 *   from module import name
 *   from module import name as alias
 *   from . import module (relative imports)
 *   from .. import module
 */
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
) {
  const dependencies: string[] = [];
  const dirName = path.dirname(absolutePath);
  const { resolveExtensions, alias } = options;
  // Python-specific path resolution
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

  // Regular expressions for Python imports
  const importRegex = /^\s*import\s+([^#\n]+)/gm;
  const fromImportRegex = /^\s*from\s+([^\s]+)\s+import\s+([^#\n]+)/gm;

  let match;
  // Match simple imports: import module, import module as alias, import module1, module2
  while ((match = importRegex.exec(codeString)) !== null) {
    const importStatement = match[1].trim();
    // Split by commas to handle multiple imports
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
        // Silently ignore resolution failures (likely system/third-party modules)
      }
    }
  }

  // Match from imports: from module import ...
  while ((match = fromImportRegex.exec(codeString)) !== null) {
    const module = match[1].trim();
    const importClause = match[2].trim();
    if (!module) continue;

    // Extract imported names from import clause
    // Examples: "something", "something as alias", "something, another"
    const importItems = importClause.split(',').map(item => {
      // Remove "as alias" part
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
        // Silently ignore resolution failures (likely system/third-party modules)
      }
    }
  }

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