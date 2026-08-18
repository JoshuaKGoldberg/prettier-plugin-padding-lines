import type { Parser } from "prettier";

import * as babel from "prettier/plugins/babel";
import * as typescript from "prettier/plugins/typescript";

import { addPaddingLines } from "./addPaddingLines.js";

function withPaddingLines(parser: Parser): Parser {
	return {
		...parser,
		async preprocess(text, options) {
			return await addPaddingLines(
				(await parser.preprocess?.(text, options)) ?? text,
				parser,
				options,
			);
		},
	};
}

export const parsers = {
	babel: withPaddingLines(babel.parsers.babel),
	"babel-ts": withPaddingLines(babel.parsers["babel-ts"]),
	typescript: withPaddingLines(typescript.parsers.typescript),
};
