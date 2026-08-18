// 👋 Hi! This is an optional config file for create-typescript-app (CTA).
// Repos created with CTA or its underlying framework Bingo don't use one by default.
// A CTA config file allows automatic updates to the repo that preserve customizations.
// For more information, see Bingo's docs:
//   https://www.create.bingo/execution#transition-mode
// Eventually these values should be inferable, making this config file unnecessary:
//   https://github.com/JoshuaKGoldberg/bingo/issues/128
import {
	blockPrettier,
	blockPrettierPluginCurly,
	createConfig,
} from "create-typescript-app";

export default createConfig({
	refinements: {
		addons: [
			blockPrettier({
				plugins: ["./lib/index.js"],
				runBefore: ["pnpm build --no-dts"],
			}),
		],
		blocks: {
			// Prettier resolves each parser to exactly one plugin, taking the last
			// match in the array. prettier-plugin-curly still re-exports parsers for
			// Prettier <3.7, and sorts after "./lib/index.js", so keeping it here
			// would silently disable this plugin on its own source.
			exclude: [blockPrettierPluginCurly],
		},
	},
});
