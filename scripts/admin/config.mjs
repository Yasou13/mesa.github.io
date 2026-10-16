// Public build configuration only. Privileged keys are explicitly rejected.
export function adminConfig(env = {}) {
  const url = env.MESA_SUPABASE_URL || '';
  const key = env.MESA_SUPABASE_PUBLISHABLE_KEY || '';
  if (!url && !key) return null;
  if (!url || !key) throw new Error('Both public Supabase settings are required');
  const parsed = new URL(url);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
  if ((parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:')) || parsed.username || parsed.password || parsed.search || parsed.hash || !['', '/'].includes(parsed.pathname)) throw new Error('Supabase URL must be an HTTPS origin (HTTP only for loopback)');
  let anonymous = false;
  try { anonymous = JSON.parse(atob(key.split('.')[1])).role === 'anon'; } catch {}
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key) && !anonymous) throw new Error('Only a Supabase publishable or legacy anon key may enter the public artifact');
  return { url: parsed.origin, key };
}
