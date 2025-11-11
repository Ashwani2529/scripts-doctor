import fs from "node:fs";
import path from "node:path";
export type PackageJson = {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
export function readPackageJson(cwd: string): {
  pkg: PackageJson;
  path: string;
} {
  const pjPath = path.join(cwd, "package.json");
  const raw = fs.readFileSync(pjPath, "utf8");
  return { pkg: JSON.parse(raw), path: pjPath };
}
export function writePackageJson(pjPath: string, pkg: PackageJson) {
  const content = JSON.stringify(pkg, null, 2) + "\n";
  fs.writeFileSync(pjPath, content, "utf8");
}
