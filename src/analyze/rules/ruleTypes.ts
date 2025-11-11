export type ScriptFinding = {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  scriptName: string;
  original: string;
  fixed?: string;
  addDevDeps?: string[];
};

export type Rule = {
  name: string;
  apply(scriptName: string, command: string): ScriptFinding[];
};
