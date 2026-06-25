import { visit } from 'unist-util-visit';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function rehypeExtractHeadings() {
  return (tree, file) => {
    const headings = [];

    visit(tree, 'element', (node) => {
      if (['h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const text = node.children
          .filter(child => typeof child.value === 'string')
          .map(child => child.value)
          .join('');

        if (text) {
          const id = slugify(text);
          node.properties.id = id;

          headings.push({
            level: parseInt(node.tagName[1]),
            text: text,
            id: id,
          });
        }
      }
    });

    file.data.headings = headings;
  };
}
