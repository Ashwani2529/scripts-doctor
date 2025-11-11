import { Command } from "commander";
import { analyzeScripts } from "./analyze";
import { readPackageJson, writePackageJson } from "./util/io";
import { applySuggestions } from "./fix";
import { log } from "./util/log";
import {version} from "../package.json";
import { detectPackageManager } from "./util/detectPackageManager";
const program = new Command();
program
  .name("scripts-doctor")
  .description(
    "Lint/auto-fix package.json scripts for cross-platform portability."
  )
  .version(version);
program
  .command("lint")
  .option(
    "-p, --path <dir>",
    "path to project (contains package.json)",
    process.cwd()
  )
  .option("--fix", "apply safe fixes to scripts in-memory", false)
  .option("--write", "write changes to package.json (implies --fix)", false)
  .option("--report-json <file>", "write detailed findings as JSON")
  .action((opts) => {
    const cwd = opts.path;
    const { pkg, path } = readPackageJson(cwd);
    const mgr = detectPackageManager(cwd);
    const { findings, suggested, requiredDevDeps } = analyzeScripts(pkg);
    if (findings.length === 0) {
      log.success("No issues found in scripts. Nice! ✨");
      return;
    }
    for (const f of findings) {
      const head = `${f.level.toUpperCase()} [${f.id}] in "${f.scriptName}"`;
      const hint = f.fixed ? `\n  fix → ${f.fixed}` : "";
      console.log(`- ${head}\n  ${f.message}\n  found: ${f.original}${hint}\n`);
    }
    if (opts.reportJson) {
      const fs = require("node:fs");
      fs.writeFileSync(
        opts.reportJson,
        JSON.stringify(
          { findings, suggested, requiredDevDeps: Array.from(requiredDevDeps) },
          null,
          2
        )
      );
      log.info(`Wrote report to ${opts.reportJson}`);
    }
    if (opts.fix || opts.write) {
      applySuggestions(pkg, suggested, requiredDevDeps);
      if (opts.write) {
        writePackageJson(path, pkg);
        log.success(`Updated package.json ✔`);
        if (requiredDevDeps.size > 0) {
          log.warn(
            `Install new devDeps: ${Array.from(requiredDevDeps).join(", ")}\n` +
              `e.g. ${mgr} ${
                mgr === "yarn" ? "add -D" : "install -D"
              } ${Array.from(requiredDevDeps).join(" ")}`
          );
        }
      } else {
        log.info("Preview of changes (use --write to save):");
        console.log(
          JSON.stringify(
            { scripts: pkg.scripts, devDependencies: pkg.devDependencies },
            null,
            2
          )
        );
      }
    } else {
      log.dim(
        "Tip: run with --fix to preview changes, or --write to save them."
      );
    }
  });
program.parseAsync();
