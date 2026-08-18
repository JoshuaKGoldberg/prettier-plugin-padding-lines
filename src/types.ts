export type AstNode = Record<string, unknown> & { type: string };

export interface Insertion {
	count: number;
	offset: number;
}
