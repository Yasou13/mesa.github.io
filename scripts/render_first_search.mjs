import fs from 'node:fs';
export const firstSearch = JSON.parse(fs.readFileSync(new URL('../content/examples/first-search.json', import.meta.url), 'utf8'));
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export function recordedExample({t, route, language = 'en'}) {
  const en = firstSearch.examples.en;
  const tr = firstSearch.examples.tr;
  const local = firstSearch.examples[language];
  const paired = (english, turkish) => t(escape(english), escape(turkish));
  const result = (stage) => `<blockquote>${paired(en[stage].results[0].evidence_span.trim(), tr[stage].results[0].evidence_span.trim())}</blockquote><dl class="demo-source"><div><dt>${t('Source', 'Kaynak')}</dt><dd><code>${escape(local.source)}</code></dd></div><div><dt>${t('Revision', 'Sürüm')}</dt><dd><code>${en[stage].receipt.revision_number}</code></dd></div><div><dt>${t('Processing', 'İşleme')}</dt><dd><code>COMMITTED</code></dd></div></dl>`;
  return `<aside class="recorded-demo" id="example" aria-labelledby="example-title" data-recorded-demo>
    <div class="demo-heading"><p class="eyebrow">${t('SEE THE RESULT', 'SONUCU GÖRÜN')}</p><h2 id="example-title">${t('One document. A traceable result.', 'Bir belge. Kaynağı belli bir sonuç.')}</h2><p>${t('Recorded real execution; not a live query.', 'Kaydedilmiş gerçek çalıştırma; canlı sorgu değildir.')}</p></div>
    <div class="demo-controls" hidden><button type="button" data-demo-prev>${t('Previous step', 'Önceki adım')}</button><span data-demo-progress aria-live="polite"></span><button type="button" data-demo-next>${t('Next step', 'Sonraki adım')}</button></div>
    <ol class="demo-steps">
      <li data-demo-step><span class="demo-number">01</span><h3>${t('Start with a document', 'Bir belgeyle başlayın')}</h3><p><code>${escape(local.file)}</code></p><blockquote>${paired(en.text, tr.text)}</blockquote><p>${t('A short sample document about archive opening hours.', 'Arşivin açılış saatini anlatan kısa bir örnek belge.')}</p></li>
      <li data-demo-step><span class="demo-number">02</span><h3>${t('Search its words', 'Metindeki sözcükleri arayın')}</h3><pre tabindex="0"><code>${escape(`mesa search "${local.query}"`)}</code></pre><p>${t('Models are off. This example uses word search, without a model account.', 'Modeller kapalıdır. Bu örnek, model hesabı gerektirmeyen sözcük aramasını kullanır.')}</p></li>
      <li data-demo-step><span class="demo-number">03</span><h3>${t('Read the text and its source', 'Metni ve kaynağını görün')}</h3>${result('initial')}<p>${t('MESA returns evidence. Your application can use it to write an answer.', 'MESA dayanak metni döndürür. Uygulamanız bu metni yanıt üretmek için kullanabilir.')}</p></li>
      <li data-demo-step><span class="demo-number">04</span><h3>${t('Update the document', 'Belgeyi güncelleyin')}</h3><p>${t('The opening time changes from 09:00 to 10:00. After processing, the same search returns the new revision.', 'Açılış saati 09:00’dan 10:00’a değişir. İşleme tamamlandığında aynı arama yeni sürümü döndürür.')}</p>${result('updated')}</li>
    </ol>
    <details class="demo-evidence"><summary>${t('View the execution record', 'Çalıştırma kaydını inceleyin')}</summary><p>${t('The display shows original result fields. Full identifiers and outputs are available in the record. This small example is not a search-quality benchmark.', 'Gösterim, özgün sonuç alanlarını kullanır. Tam kimlikler ve çıktılar kayıtta bulunur. Bu küçük örnek, arama kalitesi ölçümü değildir.')}</p><p><code>Core v${firstSearch.version} · ${firstSearch.commit.slice(0, 7)} · ${firstSearch.recorded_at.slice(0, 10)}</code></p><a href="${route(`${language === 'tr' ? '../' : ''}examples/first-search.json`)}">${t('Download the EN/TR execution record', 'TR/EN çalıştırma kaydını indirin')}</a><p>${t('Reproduce from the pinned Core environment with the script in the website repository.', 'Web sitesi deposundaki betiği sabitlenmiş Core ortamıyla çalıştırarak tekrar üretin.')}</p><pre tabindex="0"><code>/path/to/MESA/.venv/bin/python scripts/capture_first_search.py --core /path/to/MESA</code></pre></details>
  </aside>`;
}
