import type { AstNode } from "./types.js";

import { isNode } from "./isNode.js";

const blockBodiedFunctionTypes = new Set([
	"ArrowFunctionExpression",
	"FunctionExpression",
]);

const blockLikeStatementTypes = new Set([
	"DoWhileStatement",
	"ForInStatement",
	"ForOfStatement",
	"ForStatement",
	"FunctionDeclaration",
	"IfStatement",
	"SwitchStatement",
	"TryStatement",
	"WhileStatement",
]);

export function isBlockLike(statement: AstNode): boolean {
	const node = unwrapExport(statement);

	if (blockLikeStatementTypes.has(node.type)) {
		return true;
	}

	if (node.type === "VariableDeclaration") {
		return (
			Array.isArray(node.declarations) &&
			node.declarations.some(
				(declaration) =>
					isNode(declaration) && hasBlockBodiedFunction(declaration.init),
			)
		);
	}

	if (node.type === "ExpressionStatement") {
		return hasBlockBodiedFunction(node.expression);
	}

	return false;
}

function hasBlockBodiedFunction(value: unknown) {
	return (
		isNode(value) &&
		blockBodiedFunctionTypes.has(value.type) &&
		isNode(value.body) &&
		value.body.type === "BlockStatement"
	);
}

function unwrapExport(statement: AstNode) {
	return (statement.type === "ExportDefaultDeclaration" ||
		statement.type === "ExportNamedDeclaration") &&
		isNode(statement.declaration)
		? statement.declaration
		: statement;
}
