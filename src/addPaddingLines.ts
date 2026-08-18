import type { Parser, ParserOptions } from "prettier";

import type { AstNode, Insertion } from "./types.js";

import { isBlockLike } from "./isBlockLike.js";
import { isNode } from "./isNode.js";

interface WalkContext {
	comments: AstNode[];
	insertions: Insertion[];
	locEnd: (node: AstNode) => number;
	locStart: (node: AstNode) => number;
	seen: WeakSet<object>;
	text: string;
}

const statementListKeys = new Map([
	["BlockStatement", "body"],
	["Program", "body"],
	["StaticBlock", "body"],
	["SwitchCase", "consequent"],
	["TSModuleBlock", "body"],
]);

export async function addPaddingLines(
	text: string,
	parser: Parser,
	options: ParserOptions,
) {
	let ast: unknown;

	try {
		ast = await parser.parse(text, options);
	} catch {
		// Prettier parses again right after this and reports syntax errors with a
		// code frame, so surfacing our own duplicate error here would be noise.
		return text;
	}

	if (!isNode(ast)) {
		return text;
	}

	const context: WalkContext = {
		comments: (Array.isArray(ast.comments) ? ast.comments : [])
			.filter(isNode)
			.sort((a, b) => parser.locStart(a) - parser.locStart(b)),
		insertions: [],
		locEnd: parser.locEnd,
		locStart: parser.locStart,
		seen: new WeakSet(),
		text,
	};

	collectInsertions(ast, context);

	return context.insertions
		.sort((a, b) => b.offset - a.offset)
		.reduce(
			(result, { count, offset }) =>
				result.slice(0, offset) + "\n".repeat(count) + result.slice(offset),
			text,
		);
}

function collectInsertions(node: AstNode, context: WalkContext) {
	if (context.seen.has(node)) {
		return;
	}

	context.seen.add(node);

	const listKey = statementListKeys.get(node.type);

	if (listKey !== undefined) {
		const statements = node[listKey];

		if (Array.isArray(statements)) {
			collectListInsertions(statements.filter(isNode), context);
		}
	}

	for (const value of Object.values(node)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				if (isNode(item)) {
					collectInsertions(item, context);
				}
			}
		} else if (isNode(value)) {
			collectInsertions(value, context);
		}
	}
}

function collectListInsertions(statements: AstNode[], context: WalkContext) {
	for (let i = 0; i < statements.length - 1; i += 1) {
		const statement = statements[i];

		if (!isBlockLike(statement)) {
			continue;
		}

		const offset = endOfTrailingComments(statement, context);
		const nextStart = startOfLeadingComments(
			statements[i + 1],
			offset,
			context,
		);
		const newlines = countNewlines(context.text, offset, nextStart);

		if (newlines < 2) {
			context.insertions.push({ count: 2 - newlines, offset });
		}
	}
}

function countNewlines(text: string, start: number, end: number) {
	let count = 0;

	for (let i = start; i < end; i += 1) {
		if (text[i] === "\n") {
			count += 1;
		}
	}

	return count;
}

function endOfTrailingComments(statement: AstNode, context: WalkContext) {
	// locEnd stops before a statement's trailing semicolon, so inserting there
	// would split `call();` into `call()` and an empty statement.
	let offset = skipSemicolon(context.text, context.locEnd(statement));

	for (const comment of context.comments) {
		const start = context.locStart(comment);

		if (start < offset) {
			continue;
		}

		if (countNewlines(context.text, offset, start) > 0) {
			break;
		}

		offset = context.locEnd(comment);
	}

	return offset;
}

function skipSemicolon(text: string, offset: number) {
	let index = offset;

	while (text[index] === " " || text[index] === "\t") {
		index += 1;
	}

	return text[index] === ";" ? index + 1 : offset;
}

function startOfLeadingComments(
	next: AstNode,
	offset: number,
	context: WalkContext,
) {
	const nextStart = context.locStart(next);

	for (const comment of context.comments) {
		const start = context.locStart(comment);

		if (start >= offset && start < nextStart) {
			return start;
		}
	}

	return nextStart;
}
