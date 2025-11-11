Got it 👍 — here’s the **entire README rewritten in proper Markdown editor format**. You can copy-paste this directly into a `README.md` file:

```markdown
# scripts-doctor

Lint (and optionally auto-fix) your `package.json` **scripts** so they’re **cross-platform** and **reliable** across Windows, macOS, and Linux.

- Rewrites fragile POSIX commands to portable forms (e.g. `rm -rf` → `rimraf`; `cp/mv/mkdir -p/grep/sed/cat` → `shx …`)
- Wraps inline env-vars with `cross-env` (`FOO=bar cmd` → `cross-env FOO=bar cmd`) so they work on Windows too
- Flags scripts that call local tools not listed in `devDependencies`
- Plays nicely with `npm run` and `npx`

---

## 📦 Install

**Project-local (recommended):**

```bash
npm i -D scripts-doctor
```

**One-off via npx:**

```bash
npx scripts-doctor --help
```

> `npx` runs package binaries without a global install.

---

## 🚀 Quick Start

From a project root (with a `package.json`):

```bash
# see issues only
npx scripts-doctor lint

# apply safe fixes in-place
npx scripts-doctor lint --fix
```

Target a different folder:

```bash
npx scripts-doctor lint path/to/project
```

---

## 🔍 What It Checks

- **POSIX deletes:** `rm -rf` → suggests `rimraf` for cross-platform deletion
- **POSIX commands:** `cp`, `mv`, `mkdir -p`, `grep`, `sed`, `cat` → suggests `shx` wrappers
- **Inline env vars:** `FOO=bar command` → suggests `cross-env`
- **Missing local bins:** warns when scripts call `tsc`, `eslint`, `jest`, etc. without corresponding devDeps
- **Chaining/subshell pitfalls:** surfaces fragile patterns (`&&`, `;`, `$(...)`) that often fail on Windows cmd

### Auto-fixes

- Rewrites `rm -rf` → `rimraf` (and suggests adding `rimraf` if missing)
- Rewrites `cp|mv|mkdir -p|grep|sed|cat` → `shx …`
- Wraps inline env-vars with `cross-env`

> Some fixes require adding devDependencies.

---

## ✨ Examples

**Before:**

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "FOO=bar tsc -p tsconfig.json",
    "copy": "cp -r src/assets dist/assets",
    "mkdirs": "mkdir -p dist/assets && echo done"
  }
}
```

**After `scripts-doctor --fix`:**

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "cross-env FOO=bar tsc -p tsconfig.json",
    "copy": "shx cp -r src/assets dist/assets",
    "mkdirs": "shx mkdir -p dist/assets && echo done"
  }
}
```

Install suggested tools:

```bash
npm i -D rimraf shx cross-env
```

- `rimraf` → cross-platform `rm -rf`
- `shx` → portable `cp/mv/mkdir -p/grep/sed/cat`
- `cross-env` → makes inline env-vars work everywhere

---

## ⚙️ CLI

```
scripts-doctor [path] [options]

Options:
  --fix             Apply safe, in-place fixes
  --format <style>  Output: "stylish" (default) or "json"
  --quiet           Only show problems
  --no-color        Disable ANSI colors
  -h, --help        Show help
  -V, --version     Show version
```

Run via `npm run` or `npx`.

---

## 📑 Suggested devDependencies

When the linter proposes fixes, you’ll typically want:

```bash
npm i -D rimraf shx cross-env
```

You should also add the tools your scripts actually call (e.g., `typescript`, `eslint`, `jest`) so `npm run` resolves local binaries consistently.

---

## ✅ Exit Codes

- `0` – no issues  
- `1` – issues found  
- `2` – internal error  

---

## 🔧 CI Integration

Add a job that fails on findings:

```json
{
  "scripts": {
    "doctor": "scripts-doctor --format json --quiet"
  }
}
```

Example GitHub Actions step:

```yaml
- run: npx scripts-doctor --format json --quiet
```

---

## 💡 Why This Approach?

- `npm run` is the standard way to execute `package.json` scripts
- `npx`/`npm exec` runs binaries without global installs—great for one-offs and CI
- `shx` (ShellJS CLI) and `rimraf` are widely used to make scripts portable

---

## ⚠️ Limitations

- Only inspects the `scripts` field of `package.json`
- Complex shell constructs may still need manual edits
