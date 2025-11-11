import { Rule, ScriptFinding } from "./ruleTypes";
const ENV_ASSIGN_RE = /^([A-Za-z_][A-Za-z0-9_]*=.+\s+)+[^\s].*$/;
export const envAssignmentRule: Rule = {
  name: "env-assignment",
  apply(scriptName, command) {
    const findings: ScriptFinding[] = [];
    if (ENV_ASSIGN_RE.test(command)) {
      const fixed = `cross-env ${command}`;
      findings.push({
        id: "env.assign",
        level: "warn",
        message:
          "Prefix environment variable assignments with 'cross-env' for Windows compatibility.",
        scriptName,
        original: command,
        fixed,
        addDevDeps: ["cross-env"],
      });
    }
    return findings;
  },
};
