import { File } from '@babel/types';
import * as babelParser from 'recast/parsers/babel';
export const getAST = function(codeString: string): File | undefined {
	let ast = undefined;
	try {
		ast = babelParser.parse(codeString);
	} catch (e) {
		//TODO catch error
	}
	return ast;
};
