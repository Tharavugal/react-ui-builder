export function parentPath(path: string) {
  return path.split(".").slice(0, -1).join(".");
}

export function getCurIndex(path: string) {
  const m = path.split(".").slice(-1)[0].match(/\d+/);
  return m === null ? 0 : Number(m[0]);
}
