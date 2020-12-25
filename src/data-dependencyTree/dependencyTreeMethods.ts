import * as fs from 'fs';
import * as path from 'path';

import { setEntryFileRelativePath } from '../utils/config';

export const getPackageJsonPath = function(folderPath: string): string | undefined {
	const files = fs.readdirSync(folderPath);
	if (files.includes('package.json')) {
		return folderPath + '/package.json';
	} else {
		return undefined;
	}
};

export const getMainFilePath = function(folderPath: string, packageJsonPath: string): string | undefined {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	// const packageJson = require(packageJsonPath);
	if (packageJson.main) {
		const mainFilePath = path.join(packageJson.main);
		setEntryFileRelativePath(mainFilePath);
		return mainFilePath;
	} else {
		return undefined;
	}
};
