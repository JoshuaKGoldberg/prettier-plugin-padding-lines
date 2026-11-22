import type { Config } from "prettier";

export default {
	overrides: [{ files: ".nvmrc", options: { parser: "yaml" } }],
	plugins: [
		"./dist/index.js",
		"prettier-plugin-packagejson",
		"prettier-plugin-sentences-per-line",
		"prettier-plugin-sh",
	],
	useTabs: true,
} satisfies Config;
