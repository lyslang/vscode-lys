<!--
SPDX-FileCopyrightText: 2025 Aljebriq <143266740+aljebriq@users.noreply.github.com>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/lyxlang/.github/main/media/brand.png" alt="Lyx" width="400">
  <p align="center">
    <br />
    The Visual Studio Code extension of the Lyx purely functional programming language.
    <br />
    <a href="https://github.com/lyxlang/lyx">Lyx</a> •
    <a href="#usage">Usage</a> •
    <a href="#manual-installation">Manual Installation</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

## Features

- Syntax highlighting
- Formatting
- Parsing
- Helpful error messages

## Usage

The expected file extension of the Lyx programming language is `.lyx`.

You will only need to have the Lyx executable either in your PATH, or pointed by the `lyx.executablePath` setting, for the formatting to work as the default formatter setting is already configured for you.

## Manual installation

You will need to have [Bun](https://bun.sh/) installed on your system. It is automatically done so when using [nix-direnv](https://github.com/nix-community/nix-direnv).

In the root directory of the repository:

```sh
# Install dependencies
bun install
# Build the extension
bun run package
```

Then in Visual Studio Code:

- Open the command palette (<kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>P</kbd>).
- Search for and select “Developer: Install Extension from Location…”.
- Navigate to and select the root directory of the repository (`vscode-lyx`).

The extension is now installed.

## Contributing

If you would like to contribute to this project, please check out our [contributing guide](https://github.com/lyxlang/vscode-lyx/blob/main/docs/CONTRIBUTING.md) for detailed information on how to get started.

## License

This project is licensed under multiple licenses in accordance with the recommendations of the [REUSE Initiative](https://reuse.software/). Please refer to the individual files for more information.
