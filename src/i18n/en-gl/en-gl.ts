import * as types from '../types';
import * as errorKey from '../../utils/error/errorKey';
export const engl = {} as any;

engl[errorKey.NO_FOLDER] = 'No find folder in workspace';
engl[errorKey.NO_PACKAGE_JSON] = 'No find package.json';
engl[errorKey.NO_MAIN_FILE] = 'No find main file';
engl[errorKey.GET_DEPENDENCY_TREE_FAIL] = 'Get file dependency tree fail';
engl[errorKey.NO_WEBVIEW_PANEL] = 'No webview panel';
engl[errorKey.NO_DEPENDENCY] = 'No file dependency';
engl[errorKey.NO_DEPENDENCY_TREE_DATA] = 'No file dependency tree data';

engl[types.FOLDER] = 'Folder';
engl[types.OPEN_FOLDER] = 'Open folder';
engl[types.ENTRY_FILE] = 'Entry file';
engl[types.SET_ENTRY_FILE] = 'Set entry file';
