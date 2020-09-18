import { MessagePoster, StatusMessagePoster } from './messagePoster';
import * as STATUS from '../../data-dependencyTree/statusType';

export const statusMsgGetFolderPath = new StatusMessagePoster(STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER);
export const statusMsgGetPackageJsonPath = new StatusMessagePoster(STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON);
export const statusMsgGetEntryFile = new StatusMessagePoster(STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE);
export const statusMsgGetDependencyData = new StatusMessagePoster(STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA);
export const statusMsgGetDependencyProcessData = new StatusMessagePoster(
	STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA
);
