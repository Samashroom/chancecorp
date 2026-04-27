const contentImages = import.meta.glob("../assets/**/*.{png,jpg,jpeg,svg}", { eager: true, as: "url" });

const imageUrlMap = Object.fromEntries(
  Object.entries(contentImages).map(([filePath, url]) => {
    const cleanPath = filePath.replace(/^\.\.\/assets\//, "");
    return [cleanPath, url as string];
  }),
);

export function resolveContentImage(path?: string) {
  if (!path) return undefined;

  const normalized = path.replace(/^\/?src\/assets\//, "");
  return imageUrlMap[normalized];
}
