import { File } from '@babel/types';
import { parseJsCode } from './parseJsCode';
export const getAST = function(extname: string, codeString: string): File | undefined {
	let ast = undefined;
	switch (extname) {
		case '.js':
			ast = parseJsCode(codeString);
			break;
	}
	return ast;
};
