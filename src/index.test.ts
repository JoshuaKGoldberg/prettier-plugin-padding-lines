import { format } from "prettier";
import { describe, expect, it } from "vitest";

import * as plugin from "./index.js";

async function formatTypeScript(text: string) {
	return await format(text, { parser: "typescript", plugins: [plugin] });
}

describe("parsers", () => {
	it("adds a blank line when a block statement is followed by another statement", async () => {
		const actual = await formatTypeScript(`if (x) {\n  a();\n}\nz();\n`);

		expect(actual).toBe(`if (x) {\n  a();\n}\n\nz();\n`);
	});

	it("adds a blank line when the statement body is not braced", async () => {
		const actual = await formatTypeScript(`if (x) a();\nz();\n`);

		expect(actual).toBe(`if (x) a();\n\nz();\n`);
	});

	it("adds a blank line when the statement is a function declaration", async () => {
		const actual = await formatTypeScript(`function f() {\n  a();\n}\nz();\n`);

		expect(actual).toBe(`function f() {\n  a();\n}\n\nz();\n`);
	});

	it("adds a blank line when the statement is an exported function declaration", async () => {
		const actual = await formatTypeScript(
			`export function f() {\n  a();\n}\nz();\n`,
		);

		expect(actual).toBe(`export function f() {\n  a();\n}\n\nz();\n`);
	});

	it("adds a blank line when a variable is initialized to an arrow function", async () => {
		const actual = await formatTypeScript(
			`const f = () => {\n  a();\n};\nz();\n`,
		);

		expect(actual).toBe(`const f = () => {\n  a();\n};\n\nz();\n`);
	});

	it("adds a blank line when the statement is a do-while statement", async () => {
		const actual = await formatTypeScript(`do {\n  a();\n} while (x);\nz();\n`);

		expect(actual).toBe(`do {\n  a();\n} while (x);\n\nz();\n`);
	});

	it("adds a blank line when the statement is a try statement", async () => {
		const actual = await formatTypeScript(
			`try {\n  a();\n} catch {\n  b();\n}\nz();\n`,
		);

		expect(actual).toBe(`try {\n  a();\n} catch {\n  b();\n}\n\nz();\n`);
	});

	it("adds a single blank line after the last arm when the statement is an if-else chain", async () => {
		const actual = await formatTypeScript(
			`if (x) {\n  a();\n} else {\n  b();\n}\nz();\n`,
		);

		expect(actual).toBe(`if (x) {\n  a();\n} else {\n  b();\n}\n\nz();\n`);
	});

	it("adds a blank line when both statements are on the same line", async () => {
		const actual = await formatTypeScript(`if (x) { a(); } y();\n`);

		expect(actual).toBe(`if (x) {\n  a();\n}\n\ny();\n`);
	});

	it("adds a blank line inside a switch case", async () => {
		const actual = await formatTypeScript(
			`switch (x) {\n  case 1: {\n    if (y) {\n      a();\n    }\n    b();\n  }\n}\n`,
		);

		expect(actual).toBe(
			`switch (x) {\n  case 1: {\n    if (y) {\n      a();\n    }\n\n    b();\n  }\n}\n`,
		);
	});

	it("adds a blank line inside a static block", async () => {
		const actual = await formatTypeScript(
			`class A {\n  static {\n    if (x) {\n      a();\n    }\n    b();\n  }\n}\n`,
		);

		expect(actual).toBe(
			`class A {\n  static {\n    if (x) {\n      a();\n    }\n\n    b();\n  }\n}\n`,
		);
	});

	it("adds a blank line inside a namespace", async () => {
		const actual = await formatTypeScript(
			`namespace N {\n  if (x) {\n    a();\n  }\n  const b = 1;\n}\n`,
		);

		expect(actual).toBe(
			`namespace N {\n  if (x) {\n    a();\n  }\n\n  const b = 1;\n}\n`,
		);
	});

	it("adds the blank line after the comment when a trailing comment is on the same line", async () => {
		const actual = await formatTypeScript(
			`if (x) {\n  a();\n} // note\nz();\n`,
		);

		expect(actual).toBe(`if (x) {\n  a();\n} // note\n\nz();\n`);
	});

	it("adds the blank line before the comment when the next statement has a leading comment", async () => {
		const actual = await formatTypeScript(
			`if (x) {\n  a();\n}\n// lead\nz();\n`,
		);

		expect(actual).toBe(`if (x) {\n  a();\n}\n\n// lead\nz();\n`);
	});

	it("does not add a blank line when the statement is last in its block", async () => {
		const actual = await formatTypeScript(
			`function f() {\n  if (x) {\n    a();\n  }\n}\n`,
		);

		expect(actual).toBe(`function f() {\n  if (x) {\n    a();\n  }\n}\n`);
	});

	it("does not add a blank line when one is already present", async () => {
		const actual = await formatTypeScript(`if (x) {\n  a();\n}\n\nz();\n`);

		expect(actual).toBe(`if (x) {\n  a();\n}\n\nz();\n`);
	});

	it("does not add a blank line when the statement is a class declaration", async () => {
		const actual = await formatTypeScript(`class A {\n  b() {}\n}\nz();\n`);

		expect(actual).toBe(`class A {\n  b() {}\n}\nz();\n`);
	});

	it("does not add a blank line when the statement is a call with a function argument", async () => {
		const actual = await formatTypeScript(
			`describe("x", () => {\n  a();\n});\nz();\n`,
		);

		expect(actual).toBe(`describe("x", () => {\n  a();\n});\nz();\n`);
	});

	it("does not change output when a file has no block-like statements", async () => {
		const actual = await formatTypeScript(`const a = 1;\nconst b = 2;\n`);

		expect(actual).toBe(`const a = 1;\nconst b = 2;\n`);
	});

	it("adds a blank line when formatting with the babel parser", async () => {
		const actual = await format(`if (x) {\n  a();\n}\nz();\n`, {
			parser: "babel",
			plugins: [plugin],
		});

		expect(actual).toBe(`if (x) {\n  a();\n}\n\nz();\n`);
	});

	it("defers to Prettier's own error when the source has a syntax error", async () => {
		const act = async () => await formatTypeScript(`if (x) {\n`);

		await expect(act).rejects.toThrowError();
	});

	it("produces the same output when formatted twice", async () => {
		const source = `if (x) {\n  a();\n} // note\nconst f = () => {\n  b();\n};\n// lead\ndo {\n  c();\n} while (y);\nz();\n`;

		const once = await formatTypeScript(source);
		const twice = await formatTypeScript(once);

		expect(twice).toBe(once);
	});
});
