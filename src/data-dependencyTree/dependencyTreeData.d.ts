export interface DependencyTreeData {
	name: string;
	type: string;
	extension: string;
	absolutePath: string;
	relativePath: string;
	ancestors: string[];
	children: Array<DependencyTreeData>;
}
