// Shared editorial rules. No browser or backend dependency.
export const editable = article => ['draft', 'ready'].includes(article?.status);
export const slugify = title => String(title || '').replace(/ı/g, 'i').replace(/İ/g, 'I')
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const articlePath = article => `${article.language === 'tr' ? 'tr/' : ''}${({learn:'learn',guide:'guides',research:'research',glossary:'glossary',methodology:'methodology'})[article.type] || 'learn'}/${article.slug}/`;
export function validateDraft(data) {
  if (!data.title?.trim() || !data.summary?.trim() || !data.body_markdown?.trim()) throw new Error('VALIDATION');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || '')) throw new Error('SLUG');
  if (!Number.isInteger(data.reading_minutes) || data.reading_minutes < 1 || data.reading_minutes > 60) throw new Error('VALIDATION');
  return data;
}
export function filterAndSort(items, {search = '', language = 'all', status = 'all', type = 'all', sort = 'updated'} = {}) {
  const fold = value => String(value || '').toLocaleLowerCase('tr-TR');
  const term = fold(search.trim());
  return items.filter(a => (language === 'all' || a.language === language) && (status === 'all' || a.status === status)
    && (type === 'all' || a.type === type) && (!term || [a.title, a.slug, a.summary, ...(a.tags || [])].some(v => fold(v).includes(term))))
    .sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'oldest' ? Date.parse(a.updated_at) - Date.parse(b.updated_at) : Date.parse(b.updated_at) - Date.parse(a.updated_at));
}
export function markdownEdit(value, start, end, command) {
  const selected = value.slice(start, end);
  const wraps = {bold:['**','**'],italic:['_','_'],code:['`','`'],link:['[','](https://)']};
  const [prefix,suffix] = wraps[command] || [{heading:'## ',list:'- ',quote:'> '}[command] || '', ''];
  const text = selected || ({heading:'Heading',list:'List item',quote:'Quote',link:'Link text',code:'code',bold:'text',italic:'text'})[command];
  return {value:value.slice(0,start)+prefix+text+suffix+value.slice(end),start:start+prefix.length,end:start+prefix.length+text.length};
}
