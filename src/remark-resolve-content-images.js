const contentImages = import.meta.glob('./assets/**/*.{png,jpg,jpeg,svg}', {
  eager: true,
  as: 'url',
});

const imageUrlMap = Object.fromEntries(
  Object.entries(contentImages).map(([filePath, url]) => [
    filePath.replace(/^\.\/assets\//, ''),
    url,
  ]),
);

function resolveMarkdownContentImage(url) {
  if (!url) return url;
  const normalized = url.replace(/^\/?src\/assets\//, '');
  return imageUrlMap[normalized] ?? url;
}

function resolveHtmlImageUrls(value) {
  return value.replace(/(<img[^>]+src=["'])(\/src\/assets\/[\w./-]+)(["'][^>]*>)/g, (_, prefix, src, suffix) => {
    const resolved = resolveMarkdownContentImage(src);
    return `${prefix}${resolved}${suffix}`;
  });
}

export default function remarkResolveContentImages() {
  return (tree) => {
    const visitNode = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'image' && typeof node.url === 'string') {
        node.url = resolveMarkdownContentImage(node.url);
      }
      if (node.type === 'html' && typeof node.value === 'string') {
        node.value = resolveHtmlImageUrls(node.value);
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(visitNode);
      }
    };
    visitNode(tree);
  };
}
