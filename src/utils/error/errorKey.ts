export class ErrorKey extends String {
	constructor(value?: any) {
		super(value);
	}
}

export const NO_FOLDER = new ErrorKey('NO_FOLDER');
export const NO_PACKAGE_JSON = new ErrorKey('NO_PACKAGE_JSON');
export const NO_MAIN_FILE = new ErrorKey('NO_MAIN_FILE');
