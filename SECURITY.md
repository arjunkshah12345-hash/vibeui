# Security policy

## Supported versions

Security fixes are applied to the latest release on `main`. VibeUI is pre-1.0, so older minor versions are not patched.

| Version | Supported |
| --- | --- |
| 0.2.x | Yes |
| 0.1.x | No |

## What counts

VibeUI is a set of source files that you copy into your own project, plus a CLI and an MCP server that read this repository and write files you ask for. Relevant reports include:

- A component that enables cross-site scripting by default (for example, unsanitised HTML injection).
- The CLI or MCP server writing files outside the directory the user requested (path traversal), or running unexpected commands.
- A vulnerable dependency that ships in the files you copy (the four peers).

Not in scope: vulnerabilities in your own app, in dependencies of the showcase site only, or issues that require an attacker to already control your project's files.

## Reporting a vulnerability

Please **do not open a public issue**. Use GitHub's private reporting instead:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability** and describe the problem, the affected files or commands, and steps to reproduce.

You can expect an acknowledgement within a few days. We will keep you updated while we investigate, agree a disclosure timeline with you, and credit you in the changelog if you wish.

## A note for MCP and CLI users

The MCP server and CLI only read files inside this repository and write into the directory you pass (`--dir` or the tool's `dir` argument). When you give an agent access to `add_component`, point it at a specific project directory and review the files it writes, as you would any generated code.
