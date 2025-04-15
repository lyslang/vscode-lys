//! SPDX-FileCopyrightText: 2025 Aljebriq <143266740+aljebriq@users.noreply.github.com>
//!
//! SPDX-License-Identifier: GPL-3.0-only

// biome-ignore lint/correctness/noNodejsModules: necessary for a VS Code extension
import { spawn } from "node:child_process";
// biome-ignore lint/correctness/noUndeclaredDependencies: already running inside VS Code
import vscode from "vscode";
import { contributes } from "../package.json";

interface LysError {
  code: number;
  msg: string;
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
}

class Formatter {
  // biome-ignore lint/style/noParameterProperties: useful here
  constructor(private diagnostics: vscode.DiagnosticCollection) {}

  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    _options: vscode.FormattingOptions,
    cancel: vscode.CancellationToken,
  ): Promise<vscode.TextEdit[] | undefined> {
    try {
      const executablePath =
        vscode.workspace
          .getConfiguration("lys")
          .get<string>("executablePath") ??
        contributes.configuration.properties["lys.executablePath"].default;

      const cwd =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

      const lysFmt = spawn(executablePath, ["fmt"], { cwd });

      cancel.onCancellationRequested(() => lysFmt.kill());

      let stderr = "";
      let stdout = "";

      lysFmt.stderr.on("data", (chunk) => {
        stderr += chunk;
      });

      lysFmt.stdout.on("data", (chunk) => {
        stdout += chunk;
      });

      lysFmt.stdin.write(document.getText());
      lysFmt.stdin.end();

      const code = await new Promise<number | null>((resolve, reject) => {
        lysFmt.on("error", (error) => {
          if (error.message.includes("ENOENT")) {
            reject(
              new Error(
                `Lys executable not found. Please ensure that “${executablePath}” is correct and points to a valid Lys executable. You can set the path in VS Code settings under “lys.executablePath” or make sure it’s in your system’s PATH.`,
              ),
            );
          } else {
            reject(error);
          }
        });
        lysFmt.on("close", resolve);
      });

      if (cancel.isCancellationRequested) {
        return;
      }

      this.diagnostics.delete(document.uri);

      if (code === 0) {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length),
        );
        return [vscode.TextEdit.replace(fullRange, stdout)];
      }

      const lysError: LysError = JSON.parse(stderr);

      const errorMessage = `E${lysError.code.toString().padStart(4, "0")}: ${lysError.msg}`;

      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(
          lysError.startLine,
          lysError.startCol,
          lysError.endLine,
          lysError.endCol,
        ),
        errorMessage,
        vscode.DiagnosticSeverity.Error,
      );

      this.diagnostics.set(document.uri, [diagnostic]);
      vscode.window.showErrorMessage(errorMessage);
    } catch (err) {
      if (err instanceof Error) {
        vscode.window.showErrorMessage(`Formatting failed: ${err.message}`);
      } else {
        vscode.window.showErrorMessage(
          "An unexpected error occurred during formatting.",
        );
      }
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  try {
    const diagnostics = vscode.languages.createDiagnosticCollection("lys");
    const formatter = new Formatter(diagnostics);
    const selector = { language: "lys" };

    context.subscriptions.push(
      diagnostics,
      vscode.languages.registerDocumentFormattingEditProvider(
        selector,
        formatter,
      ),
    );
  } catch (err) {
    if (err instanceof Error) {
      vscode.window.showErrorMessage(
        `Lys extension activation failed: ${err.message}`,
      );
    } else {
      vscode.window.showErrorMessage(
        "An unexpected error occurred during Lys extension activation.",
      );
    }
  }
}
