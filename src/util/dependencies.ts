import type { PackageJson } from "./io";
export function ensureDevDep(
  pkg: PackageJson,
  name: string,
  version = "^latest"
) {
  if (!pkg.devDependencies) pkg.devDependencies = {};
  if (
    !pkg.devDependencies[name] &&
    !(pkg.dependencies && pkg.dependencies[name])
  ) {
    pkg.devDependencies[name] = version === "^latest" ? "^0.0.0" : version;
    return true;
  }
  return false;
}
export function hasAnyDep(pkg: PackageJson, name: string) {
  return !!(
    (pkg.dependencies && pkg.dependencies[name]) ||
    (pkg.devDependencies && pkg.devDependencies[name])
  );
}
