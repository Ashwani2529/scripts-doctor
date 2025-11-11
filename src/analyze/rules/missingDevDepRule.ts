import { Rule, ScriptFinding } from "./ruleTypes";
import { firstToken, splitSegments } from "../parser";
const COMMON_BINS = new Set([
  "tsc",
  "eslint",
  "prettier",
  "jest",
  "vitest",
  "webpack",
  "rollup",
  "esbuild",
  "swc",
  "vite",
  "babel",
  "mocha",
  "ava",
  "c8",
]);
export const missingDevDepRule: Rule = {
  name: "missing-dev-dep",
  apply(scriptName, command) {
    const segments = splitSegments(command);
    const findings: ScriptFinding[] = [];
    for (const seg of segments) {
      const bin = firstToken(seg.text);
      if (
        !bin ||
        ["cross-env", "shx", "rimraf", "npm", "pnpm", "yarn"].includes(bin)
      )
        continue;
      if (COMMON_BINS.has(bin)) {
        findings.push({
          id: `missing.${bin}`,
          level: "info",
          message: `Ensure '${bin}' is installed as a devDependency so scripts are reproducible.`,
          scriptName,
          original: command,
        });
      }
    }
    return findings;
  },
};
