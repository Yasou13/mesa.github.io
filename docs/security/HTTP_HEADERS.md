# HTTP security headers and admin access

GitHub Pages cannot send custom response headers, and a `_headers` file is ignored
there. The site therefore ships what HTML can carry, and leaves the rest to Cloudflare.

## Already in the HTML (every public page)

- `Content-Security-Policy` as a `<meta http-equiv>` tag. Scripts and styles load
  from the site itself; the inline boot script and the observed Codex browser
  annotation overlay stylesheet are allowed by their SHA-256 hashes.
  Cloudflare Web Analytics (`static.cloudflareinsights.com`, `cloudflareinsights.com`)
  and the configured Supabase origin are allowed. Admin pages keep their own stricter policy.
- `<meta name="referrer" content="strict-origin-when-cross-origin">`.
- Admin pages carry `noindex, nofollow`. `robots.txt` no longer lists `/admin/`, so the
  path is not advertised.

The annotation stylesheet exception fixes the unstyled selection cursor and
missing annotation editor in Codex. It does not allow arbitrary inline styles.
On 2026-10-28, the identical 5,382-byte overlay stylesheet loaded on GitHub but
was blocked on MESA. A local browser comparison confirmed that the exact hash
restored its fixed positioning and border, while modified CSS remained blocked.
If a Codex update changes that stylesheet, inspect the new CSS and repeat this
comparison before changing `codexAnnotationStyleHash` in `scripts/render_site.mjs`.

## Still needed in Cloudflare (owner action)

A meta-tag CSP cannot set `frame-ancestors`, and HSTS, `X-Frame-Options` and
`X-Content-Type-Options` only work as real response headers.

1. **Rules → Transform Rules → Modify Response Header → Create rule**, match all
   incoming requests to `mesamemory.dev`, and *set* these static headers:

   | Header | Value |
   | --- | --- |
   | `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
   | `X-Frame-Options` | `DENY` |
   | `X-Content-Type-Options` | `nosniff` |
   | `Referrer-Policy` | `strict-origin-when-cross-origin` |
   | `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
   | `Content-Security-Policy` | `frame-ancestors 'none'` |

   Add `preload` to HSTS only after confirming every subdomain serves HTTPS.

2. **Zero Trust → Access → Applications → Add a self-hosted application** for
   `mesamemory.dev/admin*` and `mesamemory.dev/tr/admin*`. Policy: *Allow*, rule
   *Emails* with the maintainer address. The free plan covers this. Supabase Auth and
   database RLS stay in place behind it.

3. Check the result:

   ```bash
   curl -sI https://mesamemory.dev/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer|permissions|content-security'
   curl -sI https://mesamemory.dev/admin/ | head -n 5   # expect a redirect to the Access login
   ```
