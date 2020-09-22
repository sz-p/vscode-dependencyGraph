import * as types from '../types';
import * as errorKey from '../../utils/error/errorKey';
import * as status from "../../data-dependencyTree/statusType"

export const engl = {} as any;

engl[errorKey.NO_FOLDER] = 'No find folder in workspace';
engl[errorKey.NO_PACKAGE_JSON] = 'No find package.json';
engl[errorKey.NO_MAIN_FILE] = 'No find main file';
engl[errorKey.GET_DEPENDENCY_TREE_FAIL] = 'Get file dependency tree fail';
engl[errorKey.NO_WEBVIEW_PANEL] = 'No webview panel';
engl[errorKey.NO_DEPENDENCY] = 'No file dependency';
engl[errorKey.NO_DEPENDENCY_TREE_DATA] = 'No file dependency tree data';

engl[types.SUCCESS] = 'Success';
engl[types.FAILED] = 'Failed';

engl[types.FOLDER] = 'Folder';
engl[types.OPEN_FOLDER] = 'Open folder';
engl[types.ENTRY_FILE] = 'Entry file';
engl[types.SET_ENTRY_FILE] = 'Set entry file';

engl[status.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER] = 'Get opened folder';
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON] = 'Get packageJson file';
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE] = 'Get entry file';
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_DATA] = 'Get dependency data';
engl[status.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA] = 'Process dependency data';
