import type { PackageJson } from "../util/io";
import { ensureDevDep } from "../util/dependencies";
export function applySuggestions(
  pkg: PackageJson,
  suggested: Record<string, string>,
  devDeps: Set<string>
) {
  if (!pkg.scripts) pkg.scripts = {};
  for (const [k, v] of Object.entries(suggested)) {
    pkg.scripts[k] = v;
  }
  for (const dep of devDeps) {
    ensureDevDep(pkg, dep, "^0.0.0");
  }
  return pkg;
}
