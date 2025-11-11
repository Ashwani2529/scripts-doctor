import type { PackageJson } from "../util/io";
import { Rule, ScriptFinding } from "./rules/ruleTypes";
import { posixCommandsRule } from "./rules/posixCommandsRule";
import { envAssignmentRule } from "./rules/envAssignmentRule";
import { missingDevDepRule } from "./rules/missingDevDepRule";
export type AnalysisResult = {
  findings: ScriptFinding[];
  suggested: Record<string, string>;
  requiredDevDeps: Set<string>;
};
const RULES: Rule[] = [envAssignmentRule, posixCommandsRule, missingDevDepRule];
export function analyzeScripts(pkg: PackageJson): AnalysisResult {
  const findings: ScriptFinding[] = [];
  const suggested: Record<string, string> = {};
  const requiredDevDeps = new Set<string>();
  const scripts = pkg.scripts || {};
  for (const [name, cmd] of Object.entries(scripts)) {
    let best = cmd;
    for (const rule of RULES) {
      const res = rule.apply(name, best);
      for (const f of res) {
        findings.push(f);
        if (f.fixed) {
          best = f.fixed;
          suggested[name] = best;
        }
        if (f.addDevDeps) f.addDevDeps.forEach((d) => requiredDevDeps.add(d));
      }
    }
  }
  return { findings, suggested, requiredDevDeps };
}
