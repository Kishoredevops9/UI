export function filterItemsBySearchTerm(items: any[], searchTerm: string, field?: string) {
  if (!searchTerm) return items;
  return items.filter(item => {
    const _searchTerm = searchTerm.trim().toLocaleLowerCase();
    const target = field ? item[field] : item;
    if (!target) return false;
    const _target = target.trim().toLocaleLowerCase();
    return _target.includes(_searchTerm);
  })  
}