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
    const result = await this.client.from('articles').select('id,title,language,status,updated_at').order('updated_at', {ascending:false}).limit(100);
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async loadArticle(id) {
    await this.authorize();
    const result = await this.client.from('articles').select('id,title,summary,body_markdown,status,updated_at').eq('id',id).single();
    if (result.error) throw new Error('DATA');
    return result.data;
  }
  async saveDraft(article, changes) {
    await this.authorize();
    if (!['draft','ready'].includes(article.status)) throw new Error('PUBLISHED');
    // Optimistic concurrency prevents silently replacing another administrator's changes.
    const result = await this.client.from('articles').update({title:changes.title,summary:changes.summary,body_markdown:changes.body_markdown,updated_at:new Date().toISOString()})
      .eq('id',article.id).eq('updated_at',article.updated_at).in('status',['draft','ready']).select('id,updated_at').single();
    if (result.error || !result.data) throw new Error('CONFLICT');
    return result.data;
  }
  async listRecords(table) {
    if (!['media_assets','publication_jobs'].includes(table)) throw new Error('DATA');
    await this.authorize();
    const fields = table === 'media_assets' ? 'id,filename,mime_type,file_size_bytes' : 'id,status,started_at,completed_at';
    const result = await this.client.from(table).select(fields).limit(100);
    if (result.error) throw new Error('DATA');
    return result.data;
  }
}
