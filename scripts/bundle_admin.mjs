import { build } from 'esbuild';

await build({
  entryPoints: ['scripts/admin/app.mjs'],
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2022'],
  outfile: 'dist/admin.js',
  legalComments: 'linked',
});
