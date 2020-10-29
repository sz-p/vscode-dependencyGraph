import * as fs from 'fs';
import * as path from 'path';
import { pathExists } from '../../utils/utils';
export interface FileAttribute {
	codeString: string;
	extname: string;
	filename: string;
	absolutePath: string;
	relativePath: string;
}
export const parseFile = function(filePath: string, folderPath: string): FileAttribute | undefined {
	// TODO not only undefined is not existed
	if (!pathExists(filePath)) return undefined;
	const codeString = fs.readFileSync(filePath).toString();
	const extname = path.extname(filePath);
	const filename = path.basename(filePath);
	const absolutePath = filePath;
	const relativePath = filePath.replace(folderPath, '');
	return {
		codeString,
		extname,
		filename,
		absolutePath,
		relativePath
	};
};
