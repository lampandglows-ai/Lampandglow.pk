export function slugify(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

export function findCategoryBySlug(categories, slug) {
  if (!categories || !slug) return null;
  return categories.find((c) => slugify(c.id) === slug) || null;
}

export default slugify;
