import { File } from '@babel/types';
import { parseJsCode } from './parseJsCode';
import { parseVueCode } from './parseVueCode';
export const getAST = function(extname: string, codeString: string): File | undefined {
	let ast = undefined;
	switch (extname) {
		case '.js':
			ast = parseJsCode(codeString);
			break;
		case '.vue':
			ast = parseVueCode(codeString);
			break;
	}
	return ast;
};
