export const isHotUpdateFile = (key:string) => {
  return /\.hot-update\.json$/.test(key) || /\.hot-update\.js$/.test(key);
}