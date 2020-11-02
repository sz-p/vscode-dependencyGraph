import { File } from '@babel/types';
import { parseJsCode } from './parseJsCode';
import { parseVueCode } from './parseVueCode';
import { onError } from '../../../utils/error/onError';
import { GET_AST_FAILED } from '../../../utils/error/errorKey';
import { i18n } from '../../../i18n/i18n';
import { NOT_SUPPORTED } from '../../../i18n/types';
export const getAST = function(extname: string, codeString: string): File | undefined {
	let ast = undefined;
	switch (extname) {
		case '.js':
		case '.ts':
		case '.jsx':
		case '.tsx':
			ast = parseJsCode(codeString);
			break;
		case '.vue':
			ast = parseVueCode(codeString);
			break;
		default:
			onError(GET_AST_FAILED, extname + ' ' + i18n.getText(NOT_SUPPORTED));
			break;
	}
	return ast;
};
