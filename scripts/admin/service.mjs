// Supabase Auth validates identity; Postgres RLS validates every data operation.
export class AdminService {
  constructor(client) { this.client = client; }
  async authorize() {
    const { data, error } = await this.client.auth.getUser();
    if (error || !data.user) throw new Error('SESSION');
    const role = await this.client.rpc('is_admin');
    if (role.error || role.data !== true) throw new Error('ROLE');
    return data.user;
  }
  async listArticles() {
    await this.authorize();
    const result = await this.client.from('articles')
      .select('id,slug,type,language,translation_group_id,title,subtitle,summary,status,category_id,tags,reading_minutes,updated_at,created_at')
      .order('updated_at', {ascending:false})
      .limit(200);
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async loadArticle(id) {
    await this.authorize();
    const result = await this.client.from('articles')
      .select('id,slug,type,language,translation_group_id,title,subtitle,summary,short_answer,body_markdown,category_id,tags,author,reading_minutes,cover_image,status,current_revision,seo_title,seo_description,indexable,created_at,updated_at,published_at')
      .eq('id',id)
      .single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async saveDraft(article, changes) {
    await this.authorize();
    if (!['draft','ready'].includes(article.status)) throw new Error('PUBLISHED');
    // Build update payload only with allowed safe fields to prevent client-side privilege escalation.
    const payload = {
      title: changes.title ?? article.title,
      summary: changes.summary ?? article.summary,
      body_markdown: changes.body_markdown ?? article.body_markdown,
      updated_at: new Date().toISOString()
    };
    if (changes.subtitle !== undefined) payload.subtitle = changes.subtitle;
    if (changes.short_answer !== undefined) payload.short_answer = changes.short_answer;
    if (changes.slug !== undefined) payload.slug = changes.slug;
    if (changes.category_id !== undefined) payload.category_id = changes.category_id;
    if (changes.tags !== undefined) payload.tags = changes.tags;
    if (changes.reading_minutes !== undefined) payload.reading_minutes = Number(changes.reading_minutes) || 5;
    if (changes.seo_title !== undefined) payload.seo_title = changes.seo_title;
    if (changes.seo_description !== undefined) payload.seo_description = changes.seo_description;
    if (changes.indexable !== undefined) payload.indexable = Boolean(changes.indexable);

    // Optimistic concurrency prevents silently replacing another administrator's changes.
    const result = await this.client.from('articles').update(payload)
      .eq('id',article.id).eq('updated_at',article.updated_at).in('status',['draft','ready']).select('id,updated_at').single();
    if (result.error || !result.data) throw new Error('CONFLICT');
    return result.data;
  }
  async setArticleStatus(article, newStatus) {
    await this.authorize();
    if (!['draft','ready'].includes(newStatus)) throw new Error('DATA');
    if (!['draft','ready'].includes(article.status)) throw new Error('PUBLISHED');
    const result = await this.client.from('articles').update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', article.id).eq('updated_at', article.updated_at).in('status', ['draft', 'ready']).select('id,status,updated_at').single();
    if (result.error || !result.data) throw new Error('CONFLICT');
    return result.data;
  }
  async createArticle(articleData) {
    const user = await this.authorize();
    const slug = (articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new-article');
    const payload = {
      title: articleData.title || 'Untitled',
      slug,
      type: articleData.type || 'learn',
      language: articleData.language || 'en',
      translation_group_id: articleData.translation_group_id || crypto.randomUUID(),
      subtitle: articleData.subtitle || null,
      summary: articleData.summary || '',
      short_answer: articleData.short_answer || null,
      body_markdown: articleData.body_markdown || '# ' + (articleData.title || 'Untitled') + '\n\n',
      category_id: articleData.category_id || null,
      tags: Array.isArray(articleData.tags) ? articleData.tags : [],
      reading_minutes: Number(articleData.reading_minutes) || 5,
      author: articleData.author || 'MESA contributors',
      status: 'draft',
      current_revision: 1,
      seo_title: articleData.seo_title || articleData.title || 'Untitled',
      seo_description: articleData.seo_description || articleData.summary || '',
      indexable: articleData.indexable !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const result = await this.client.from('articles').insert(payload).select().single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async listRevisions(articleId) {
    await this.authorize();
    const result = await this.client.from('article_revisions').select('id,article_id,revision_number,title,summary,created_at,change_summary').eq('article_id', articleId).order('revision_number', { ascending: false });
    if (result.error) return [];
    return result.data || [];
  }
  async loadRevision(revisionId) {
    await this.authorize();
    const result = await this.client.from('article_revisions').select('*').eq('id', revisionId).single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async saveRevision(article, summary = 'Draft saved') {
    const user = await this.authorize();
    const revNumber = (article.current_revision || 1) + 1;
    const payload = {
      article_id: article.id,
      revision_number: revNumber,
      title: article.title,
      subtitle: article.subtitle || null,
      summary: article.summary,
      short_answer: article.short_answer || null,
      body_markdown: article.body_markdown,
      seo_title: article.seo_title || article.title,
      seo_description: article.seo_description || article.summary,
      author_id: user.id,
      change_summary: summary
    };
    await this.client.from('article_revisions').insert(payload);
    await this.client.from('articles').update({ current_revision: revNumber }).eq('id', article.id);
  }
  async listCategories() {
    await this.authorize();
    const result = await this.client.from('categories').select('*').order('sort_order', { ascending: true });
    if (result.error) return [];
    return result.data || [];
  }
  async saveCategory(cat) {
    await this.authorize();
    const result = await this.client.from('categories').upsert(cat).select().single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async listTags() {
    await this.authorize();
    const result = await this.client.from('tags').select('*').order('slug', { ascending: true });
    if (result.error) return [];
    return result.data || [];
  }
  async saveTag(tag) {
    await this.authorize();
    const result = await this.client.from('tags').upsert(tag).select().single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async listAuditEvents() {
    await this.authorize();
    const result = await this.client.from('audit_events').select('*').order('created_at', { ascending: false }).limit(50);
    if (result.error) return [];
    return result.data || [];
  }
  async listRoles() {
    await this.authorize();
    const result = await this.client.from('editor_roles').select('*').order('created_at', { ascending: false });
    if (result.error) return [];
    return result.data || [];
  }
  async listRecords(table) {
    if (!['media_assets','publication_jobs'].includes(table)) throw new Error('DATA');
    await this.authorize();
    const fields = table === 'media_assets' ? 'id,filename,mime_type,file_size_bytes,created_at' : 'id,status,started_at,completed_at,build_run_id,error_message';
    const result = await this.client.from(table).select(fields).order('created_at', { ascending: false }).limit(100);
    if (result.error) {
      // Fallback without created_at order if not available
      const fallback = await this.client.from(table).select(fields).limit(100);
      if (fallback.error) throw new Error('DATA');
      return fallback.data;
    }
    return result.data;
  }
}
