<h1 align="center">Prettier Plugin Padding Lines</h1>

<p align="center">
	Prettier plugin to enforce a blank line after block-like statements.
	🛋️
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/prettier-plugin-padding-lines/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/prettier-plugin-padding-lines" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/prettier-plugin-padding-lines?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/prettier-plugin-padding-lines/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/prettier-plugin-padding-lines" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/prettier-plugin-padding-lines?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

First install this package as a dev dependency in your package manager of choice:

```shell
npm i prettier-plugin-padding-lines -D
```

You'll then be able to list it as a [Prettier plugin](https://prettier.io/docs/en/plugins.html) in your [Prettier config](https://prettier.io/docs/en/configuration.html):

```json
{
	"plugins": ["prettier-plugin-padding-lines"]
}
```

As a result, Prettier will add a blank line after block-like statements such as `for`, `if`, and `while`:

```diff
  if (abc) {
    def;
  }
+
  ghi();
```

Function declarations and functions assigned to variables are padded too.
Class declarations and calls that take a function argument, such as `describe(...)`, are left alone.

### But Why?

Prettier [intentionally does not add empty lines](https://prettier.io/docs/en/rationale.html#empty-lines) and [declined to add an option for this](https://github.com/prettier/prettier/issues/13063).
That leaves the concern to [ESLint's `padding-line-between-statements` rule](https://eslint.org/docs/latest/rules/padding-line-between-statements): a _formatting_ concern enforced by a _linter_.
This plugin enforces the equivalent of that rule's `{ blankLine: "always", prev: "block-like", next: "*" }` option at the Prettier level.

> See [The Blurry Line Between Formatting and Style](https://blog.joshuakgoldberg.com/the-blurry-line-between-formatting-and-style) for more details.

### Compatibility

Prettier resolves each parser to exactly one plugin: the last one listed that claims it.
This plugin claims the `babel`, `babel-ts`, and `typescript` parsers, so it cannot be combined with other plugins that claim those same parsers.
That includes `prettier-plugin-organize-imports` and `@ianvs/prettier-plugin-sort-imports`.
See [prettier#12807](https://github.com/prettier/prettier/issues/12807) for the upstream issue.

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 🛋

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/prettier-plugin-padding-lines/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#content-JoshuaKGoldberg" title="Content">🖋</a> <a href="https://github.com/JoshuaKGoldberg/prettier-plugin-padding-lines/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="#ideas-JoshuaKGoldberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-JoshuaKGoldberg" title="Maintenance">🚧</a> <a href="#projectManagement-JoshuaKGoldberg" title="Project Management">📆</a> <a href="#tool-JoshuaKGoldberg" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo framework](https://create.bingo).
