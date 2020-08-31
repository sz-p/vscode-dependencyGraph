import { fileIcons, FileIcon } from './fileIcons';
import { assetsPath } from '../paths';
const checkFileName = function(icons: FileIcon[], fileName: string): string | undefined {
	for (let i = 0; i < icons.length; i++) {
		const icon = icons[i] as FileIcon;
		if (icon.fileNames && icon.fileNames.length) {
			for (let j = 0; j < icon.fileNames.length; j++) {
				const fileNames = icon.fileNames[j];
				if (fileNames === fileName) {
					return icon.name;
				}
			}
		}
	}
	return undefined;
};
const checkFileExtensions = function(icons: FileIcon[], fileExtension: string): string | undefined {
	for (let i = 0; i < icons.length; i++) {
		const icon = icons[i] as FileIcon;
		if (icon.fileExtensions && icon.fileExtensions.length) {
			for (let j = 0; j < icon.fileExtensions.length; j++) {
				const fileExtensions = icon.fileExtensions[j];
				if (fileExtensions === fileExtension) {
					return icon.name;
				}
			}
		}
	}
	return undefined;
};

const getFileIconName = function(fileName: string): string {
	const pointIndex = fileName.indexOf('.');
	const fileExtension = fileName.substring(pointIndex + 1);
	const fileRealExtension = fileName.split('.').pop() as string;
	const { icons } = fileIcons;
	let iconName = undefined;
	iconName = checkFileName(icons, fileName);
	if (iconName !== undefined) {
		return iconName;
	}
	iconName = checkFileExtensions(icons, fileExtension);
	if (iconName !== undefined) {
		return iconName;
	}
	iconName = checkFileExtensions(icons, fileRealExtension);
	if (iconName !== undefined) {
		return iconName;
	}
	return 'file';
};
export const getFileIconPath = function(
	fileName: string
): {
	iconPath: string;
	fullType: string;
} {
	const fileIconName = getFileIconName(fileName);
	return { iconPath: assetsPath + '/icons/' + fileIconName + '.svg', fullType: fileIconName };
};
