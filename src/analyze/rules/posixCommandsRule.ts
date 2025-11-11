import { Rule, ScriptFinding } from "./ruleTypes";
import { splitSegments, firstToken } from "../parser";
const POSIX_TO_SHX = new Map([
  ["cp", "shx cp"],
  ["mv", "shx mv"],
  ["mkdir", "shx mkdir"],
  ["grep", "shx grep"],
  ["sed", "shx sed"],
  ["cat", "shx cat"],
]);
export const posixCommandsRule: Rule = {
  name: "posix-commands",
  apply(scriptName, command) {
    const findings: ScriptFinding[] = [];
    const segments = splitSegments(command);
    let fixed = command;
    const rmRf = /\brm\s+-rf?\b/;
    if (rmRf.test(command)) {
      const newFixed = fixed.replace(/\brm\s+-rf?\s+/g, "rimraf ");
      findings.push({
        id: "posix.rmrf",
        level: "warn",
        message: "Use rimraf instead of `rm -rf` for cross-platform deletes.",
        scriptName,
        original: command,
        fixed: newFixed,
        addDevDeps: ["rimraf"],
      });
      fixed = newFixed;
    }
    for (const seg of segments) {
      const segText = seg.text;
      if (/^\s*(?:npx\s+)?shx\s+/i.test(segText)) continue;
      const tok = firstToken(segText);
      if (POSIX_TO_SHX.has(tok)) {
        const shx = POSIX_TO_SHX.get(tok)!;
        const segFixed = segText.replace(new RegExp(`^\\s*${tok}\\b`), shx);
        if (segFixed !== segText) {
          const newFixed = fixed.replace(segText, segFixed);
          findings.push({
            id: `posix.${tok}`,
            level: "warn",
            message: `Use ${shx} instead of raw '${tok}' for portability.`,
            scriptName,
            original: command,
            fixed: newFixed,
            addDevDeps: ["shx"],
          });
          fixed = newFixed;
        }
      }
    }
    if (fixed !== command && !findings.find((f) => f.id === "posix._summary")) {
      findings.push({
        id: "posix._summary",
        level: "info",
        message: "Applied POSIX portability suggestions.",
        scriptName,
        original: command,
        fixed,
      });
    }
    return findings;
  }
};
