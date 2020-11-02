import * as fs from 'fs';
import * as path from 'path';
import { pathExists } from '../../utils/utils';
const getIntroduction = function(codeString: string) {
	const reg = /@introduction (.*)\n/;
	const result = codeString.match(reg);
	if (result) {
		return result[1].replace('\r', '');
	} else {
		return undefined;
	}
};
const getDescription = function(codeString: string) {
	const reg = /@description (.*)\n/;
	const result = codeString.match(reg);
	if (result) {
		return result[1].replace('\r', '');
	} else {
		return undefined;
	}
};
export interface FileAttribute {
	codeString: string;
	extname: string;
	baseName: string;
	absolutePath: string;
	relativePath: string;
	description: string | undefined;
	introduction: string | undefined;
	dirName: string;
}
export const parseFile = function(filePath: string, folderPath: string): FileAttribute | false {
	// TODO not only undefined is not existed
	if (!pathExists(filePath)) return false;
	const absolutePath = filePath;
	const extname = path.extname(filePath);
	const baseName = path.basename(filePath);
	const dirName = path.dirname(absolutePath);
	const relativePath = absolutePath.replace(folderPath, '');
	const codeString = fs.readFileSync(filePath).toString();
	const description = getDescription(codeString);
	const introduction = getIntroduction(codeString);
	return {
		codeString,
		extname,
		baseName,
		absolutePath,
		relativePath,
		description,
		introduction,
		dirName
	};
};
