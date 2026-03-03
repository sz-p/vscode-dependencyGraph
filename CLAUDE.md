# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VSCode extension named "Dependency Graph" that visualizes project dependency relationships. The extension analyzes source files to build a dependency tree and displays it in both a webview and tree view.

## Architecture

### Core Components

1. **Dependency Tree Parser (`packages/dependency-tree/`)**
   - Standalone package providing dependency analysis for multiple file types
   - Uses `enhanced-resolve` for module path resolution
   - Contains language-specific parsers:
     - `jsParser`, `tsParser`, `tsxParser` for JavaScript/TypeScript
     - `vueParser` for Vue Single File Components
     - `cssParser`, `generalCssParser` for CSS/SASS/LESS
     - `pythonParser` for Python (added support)
     - `noDependenceParser` for files without dependencies (JSON, etc.)
   - Main entry: `packages/dependency-tree/src/index.ts` exports `getDependencyTree()`

2. **VSCode Extension (`src/`)**
   - Main entry: `src/extension.ts` activates the extension
   - `src/data-dependencyTree/data-dependencyTree.ts` - Orchestrates dependency analysis using the core package
   - `src/web-dependencyTree/openWebView.ts` - Manages webview panel
   - `src/view-dependencyTree/renderTreeView.ts` - Renders tree view in sidebar
   - `src/commands.ts` - Registers VSCode commands

3. **WebView Application (`src/webView/`)**
   - React application built with Webpack
   - Displays interactive dependency graph using D3.js
   - Located in `src/webView/src/`
   - Separate build configuration in `src/webView/config/`

4. **Build System**
   - Two independent build targets:
     - Extension: TypeScript compilation to `outExtension/`
     - WebView: Webpack build to `outWebView/`
   - Watch scripts monitor both targets simultaneously

## Development Commands

### Building
- `npm run build` - Build both extension and webview
- `npm run build:Extension` - Build extension only
- `npm run build:WebView` - Build webview only
- `npm run watch` - Watch both extension and webview for changes
- `npm run watch:Extension` - Watch extension only
- `npm run watch:WebView` - Watch webview only

### Testing
- `npm run test` - Run all tests with Mocha
- `npm run test -- tests/extensionTester/dependencyTester/py/base/base.test.ts` - Run specific test file
- Tests are organized by language/feature in `tests/extensionTester/dependencyTester/`

### Packaging & Publishing
- `npm run package` - Create `.vsix` package with `vsce`
- `npm run vscode:prepublish` - Run tests and build before publishing

### Code Quality
- `npm run ls-lint` - Run ls-lint for file naming consistency
- `npm run codeCount` - Count lines of code with cloc

### Git Hooks
- Pre-commit: Runs `yarn ls-lint` for file naming validation
- Commit-msg: Runs `commitlint` with conventional commit format

## Key Implementation Patterns

### Parser Interface
Parsers in `packages/dependency-tree/src/parsers/` follow this signature:
```typescript
function parser(
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
): string[] // returns array of dependency paths
```

### Module Resolution
- JavaScript/TypeScript: Uses `enhanced-resolve` with extensions and aliases
- Python: Custom path resolution (converts dots to slashes, adds `.py` extension)
- Relative imports: Handled by converting `.` prefix to directory paths

### Data Flow
1. User sets entry file in webview or settings file (`.dependencygraph/setting.json`)
2. Extension calls `getDependencyTree()` from core package
3. Parsers extract imports from source code
4. Paths are resolved to absolute file paths
5. Circular dependencies are detected and marked
6. Tree data is transformed for webview and tree view display

## File Structure

```
├── packages/dependency-tree/     # Core dependency analysis library
│   ├── src/
│   │   ├── parsers/              # Language-specific parsers
│   │   ├── core/                 # Dependency tree logic
│   │   └── index.ts              # Public API
├── src/                          # VSCode extension
│   ├── data-dependencyTree/      # Data orchestration
│   ├── web-dependencyTree/       # Webview management
│   ├── view-dependencyTree/      # Tree view rendering
│   ├── webView/                  # React web application
│   └── extension.ts              # Extension entry point
├── tests/                        # Test suites
│   ├── extensionTester/          # Extension tests
│   └── webViewTester/            # Webview tests
├── config/                       # Build configuration
├── scripts/                      # Build scripts
└── outExtension/, outWebView/    # Build outputs
```

## Testing Strategy

- **Extension Tests**: Test dependency analysis for different file types and import patterns
- **Test Organization**: Tests are grouped by language (js-ts/, py/) and feature
- **Test Utilities**: `tests/extensionTester/dependencyTester/utils.ts` provides helpers for comparing computed results with expected data

## Notes for Contributors

- The project uses yarn workspaces with a single package (`dependency-tree`)
- TypeScript references are configured for monorepo support
- Webview uses React with Fluent UI components
- Error handling: System/third-party module resolution failures are silently ignored in Python parser
- New language parsers should be added to `packages/dependency-tree/src/parsers/` and registered in the main index 
