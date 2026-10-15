import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAdminPage } from '../render_admin.mjs';
for (const language of ['en', 'tr']) {
  test(`admin fails closed (${language})`, () => {
    const html = renderAdminPage({ language, assetBase: '../../' });
    assert.match(html, /noindex, nofollow/);
    assert.doesNotMatch(html, /<script|<form|localStorage|Publication job queued|role-badge/);
    assert.match(html, /publishing is blocked/);
    assert.match(html, /\.\.\/\.\.\/styles.css/);
    assert.match(html, new RegExp(`<html lang="${language}"`));
  });
}
