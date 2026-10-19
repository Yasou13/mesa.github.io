import { tagLabel } from './locale_labels.mjs';
// Course-specific views. Content and canonical routes stay in the shared hub.
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const textOf = block => [block.text,block.answer,block.title,block.term,...(block.items || []).map(x=>typeof x==='string'?x:x.label),...(block.rows || []).flat(),...(block.steps || [])].filter(Boolean).join(' ');
export function lessonSearchRecord(entry, language) {
 const copy=entry.locales[language];
 return {id:entry.id,title:copy.title,summary:copy.summary,path:entry.path,stage:entry.learning.stage,keywords:entry.tags.join(' '),sections:copy.sections.filter(s=>s.id!=='references').map(s=>({id:s.id,title:s.title,text:s.blocks.map(textOf).join(' ')}))};
}
export function validateCurriculum(course, entries) {
 const byId=new Map(entries.map(e=>[e.id,e])); const stages=new Set(course.stages.map(s=>s.id));
 const seen=new Set();
 for(const id of course.lessons) {
  const entry=byId.get(id);
  if(!entry||entry.type!=='learn'||entry.draft||!entry.indexable||seen.has(id))throw Error(`Invalid course lesson: ${id}`);
  if(!stages.has(entry.learning?.stage))throw Error(`Missing lesson stage: ${id}`);
  for(const pre of entry.learning.prerequisites)if(!seen.has(pre))throw Error(`Prerequisite must precede ${id}: ${pre}`);
  for(const lang of ['en','tr']) {
   if(!entry.learning.objectives[lang]?.length)throw Error(`Missing objectives: ${id} ${lang}`);
   const sections=entry.locales[lang].sections;
   if(new Set(sections.map(s=>s.id)).size!==sections.length)throw Error(`Duplicate lesson anchor: ${id}`);
   const blocks=sections.flatMap(s=>s.blocks);
   if(!blocks.some(b=>b.kind==='diagram')||!blocks.some(b=>b.kind==='exercise')||!blocks.some(b=>b.kind==='references'&&b.items.length>=2))throw Error(`Incomplete learning material: ${id}`);
  }
  seen.add(id);
 }
 if(entries.filter(e=>e.type==='learn'&&!e.draft&&e.indexable).length!==seen.size)throw Error('A published lesson is outside the curriculum');
 const paths=new Set(entries.map(e=>e.path));
 for(const redirect of course.redirects) {
  if(paths.has(redirect.fromPath)||!seen.has(redirect.toId))throw Error(`Invalid merged lesson: ${redirect.fromPath}`);
  if(!/^learn\/[a-z0-9-]+\/$/.test(redirect.fromPath))throw Error('Unsafe merged lesson path');
  paths.add(redirect.fromPath);
 }
}
export function learningIndex({course,entries,language,route}) {
 const tr=language==='tr';const t=(en,trText)=>tr?trText:en;const byId=new Map(entries.map(e=>[e.id,e]));const lessons=course.lessons.map(id=>byId.get(id));
 const catalog=lessons.map(e=>lessonSearchRecord(e,language));
 const sources=new Set(lessons.flatMap(e=>e.locales[language].sections.flatMap(s=>s.blocks.filter(b=>b.kind==='references').flatMap(b=>b.items.map(i=>i.href)))));
 return `<div class="learn-academy" data-learning-catalog>
 <section class="learn-intro section">
  <div><p class="eyebrow">MESA LEARN / ${t('A CONNECTED COURSE','BAĞLANTILI BİR ÖĞRENME YOLU')}</p>
   <h1>${t('Understand memory.<br><em>Build with evidence.</em>','Hafızayı anlayın.<br><em>Bir arama sistemi kurun.</em>')}</h1>
   <p class="learn-lede">${t('From your first question about AI memory to a search system you can run and inspect. One course, concrete examples, no assumed background.','Yapay zekâ hafızasının temellerinden başlayın; adım adım çalıştırabileceğiniz bir arama sistemi kurun. Dersler somut örneklerle ilerler, ön bilgi gerektirmez.')}</p>
   <div class="actions"><a class="button" data-learn-resume href="${route(lessons[0].path)}">${t('Start with lesson 01','01. dersten başlayın')} <span aria-hidden="true">↗</span></a><a class="learn-text-link" href="#lesson-library">${t('Find a topic','Bir konu seçin')} ↓</a></div>
   <p class="learn-progress" data-learn-progress>${lessons.length} ${t('lessons · read in order or explore by question','ders · sırayla ilerleyin veya sorunuza göre keşfedin')}</p>
  </div>
  <aside class="learn-intro-map" aria-label="${t('What you will learn','Neler öğreneceksiniz')}">
   <div class="learn-map-top"><span>${t('YOUR LEARNING MAP','ÖĞRENME HARİTANIZ')}</span><span>01 → ${lessons.length}</span></div>
   <ol>${course.stages.map(stage=>`<li><a href="#stage-${stage.id}" data-stage-jump="${stage.id}"><span class="learn-map-num">${stage.number}</span><span><strong>${esc(stage.title[language])}</strong><small>${esc(stage.description[language])}</small></span><span aria-hidden="true">↘</span></a></li>`).join('')}</ol>
   <div class="learn-map-bottom"><span>${t('READ → TRACE → TRY','OKUYUN → İZLEYİN → DENEYİN')}</span><strong>${sources.size} ${t('primary references','birincil kaynak')}</strong></div>
  </aside>
 </section>
 <section class="section learn-orientation" aria-labelledby="learn-method-title">
  <div><span class="learn-label">${t('HOW TO USE THIS COURSE','BU YOLU NASIL İZLEMELİ?')}</span><h2 id="learn-method-title">${t('Learn one idea.<br>Then make it work.','Bir kavramı öğrenin.<br>Sonra deneyin.')}</h2></div>
  <ol><li><strong>01 / ${t('Follow the example','Örneği izleyin')}</strong><p>${t('The fictional Atlas archive connects the lessons. Track the same source as it becomes a record, a search hit and evidence.','Kurgusal Atlas arşivi dersleri birbirine bağlar. Aynı kaynağı kayıt, arama sonucu ve kanıta dönüşürken izleyin.')}</p></li><li><strong>02 / ${t('Check your reasoning','Mantığınızı sınayın')}</strong><p>${t('Calculate the worked examples, then try each question before opening its explanation.','Örnek hesapları kendiniz yapın. Ardından açıklamayı açmadan dersin sorusunu yanıtlamayı deneyin.')}</p></li><li><strong>03 / ${t('Build and verify','Kurun ve doğrulayın')}</strong><p>${t('Finish with a Python/SQLite lab. Keep the source IDs, inspect failures and measure what actually changed.','Son derste Python ve SQLite ile küçük bir arama sistemi kurun. Kaynak kimliklerini izleyin, hataları inceleyin ve yaptığınız değişiklikleri ölçün.')}</p></li></ol>
 </section>
 <section class="section learn-library" id="lesson-library" aria-labelledby="lesson-library-title">
  <div class="learn-library-heading"><div><p class="eyebrow">${t('THE COURSE LIBRARY','DERS KÜTÜPHANESİ')}</p><h2 id="lesson-library-title">${t('Start at zero.<br>Or follow your question.','Sıfırdan başlayın.<br>Veya sorunuzun izinden gidin.')}</h2></div><a class="learn-text-link" href="${route('learn/index.md')}">Markdown ${t('index','dizini')} ↗</a></div>
  <div class="learn-filter-bar" hidden data-learn-controls>
   <label class="learn-search-label" for="learn-query">${t('Search concepts, questions and lesson text','Kavram, soru ve ders metninde arayın')}</label>
   <div class="learn-search-box"><span aria-hidden="true">⌕</span><input id="learn-query" type="search" autocomplete="off" placeholder="${t('Try: cosine, who can access, source hash…','Örn. kosinüs, erişim izni, kaynak özeti…')}"><button type="button" data-learn-clear>${t('Clear','Temizle')}</button></div>
   <div class="learn-filters" role="group" aria-label="${t('Filter by learning stage','Öğrenme aşamasına göre filtrele')}"><button type="button" data-stage-filter="all" aria-pressed="true">${t('All lessons','Tüm dersler')}</button>${course.stages.map(s=>`<button type="button" data-stage-filter="${s.id}" aria-pressed="false">${s.number} ${esc(s.title[language])}</button>`).join('')}</div>
   <p class="learn-result-count" data-learn-results aria-live="polite" aria-atomic="true"></p>
  </div>
  <div class="learn-search-matches" data-learn-matches hidden></div>
  ${course.stages.map(stage=>`<section class="learn-stage" id="stage-${stage.id}" data-learn-stage="${stage.id}" aria-labelledby="stage-title-${stage.id}"><header><span class="learn-stage-number">${stage.number}</span><div><h3 id="stage-title-${stage.id}">${esc(stage.title[language])}</h3><p>${esc(stage.description[language])}</p></div></header><ol class="learn-lesson-list">${lessons.filter(e=>e.learning.stage===stage.id).map(e=>`<li class="learn-lesson" data-lesson-id="${e.id}"><span class="learn-lesson-number">${String(e.learning.order).padStart(2,'0')}</span><div><h4><a href="${route(e.path)}" data-lesson-url>${esc(e.locales[language].title)}</a></h4><p>${esc(e.locales[language].summary)}</p><div class="learn-lesson-tags">${e.tags.slice(0,4).map(tag=>`<span>${esc(tagLabel(tag,language))}</span>`).join('')}</div></div><div class="learn-lesson-meta"><span>${e.readingMinutes} ${t('min','dk')}</span><span data-lesson-complete></span><a href="${route(e.path)}" aria-label="${esc(e.locales[language].title)}"><span aria-hidden="true">↗</span></a></div></li>`).join('')}</ol></section>`).join('')}
  <p class="learn-no-results" data-learn-empty hidden>${t('No lesson matches. Try fewer words, a different term, or clear the stage filter.','Eşleşen ders yok. Daha az kelime veya başka kavram deneyin; aşama filtresini temizleyin.')}</p>
 </section>
 <section class="section learn-next-step"><div><p class="eyebrow">${t('AFTER THE COURSE','ÖĞRENME YOLUNDAN SONRA')}</p><h2>${t('Take the ideas into a real system.','Fikirleri gerçek sisteme taşıyın.')}</h2><p>${t('These lessons explain general concepts. For MESA’s implemented behavior, use the version-pinned API, architecture and startup guides.','Bu dersler genel kavramları anlatır. MESA’nın bu sürümde nasıl çalıştığını öğrenmek için API, mimari ve hızlı başlangıç belgelerine bakın.')}</p></div><a class="button secondary" href="${route('docs/core/getting-started/')}">${t('Open the MESA quickstart','MESA hızlı başlangıcını açın')} →</a></section>
 <script type="application/json" id="learn-catalog-data">${JSON.stringify(catalog).replaceAll('<','\\u003c')}</script>
 </div>`;
}
export function renderLesson({entry,course,entries,language,route,header,footer,renderBlock,breadcrumbs}) {
 const tr=language==='tr';const t=(en,trText)=>tr?trText:en; const byId=new Map(entries.map(e=>[e.id,e]));const copy=entry.locales[language];const pos=course.lessons.indexOf(entry.id);const stage=course.stages.find(s=>s.id===entry.learning.stage);
 const updated=new Intl.DateTimeFormat(tr?'tr-TR':'en-GB',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(entry.updatedAt+'T00:00:00Z'));
 const previous=byId.get(course.lessons[pos-1]);const next=byId.get(course.lessons[pos+1]);
 const adjacent=(e,label)=>e?`<a href="${route(e.path)}"><span>${label}</span><strong>${esc(e.locales[language].title)}</strong></a>`:`<a href="${route('learn/')}"><span>${t('Learning map','Öğrenme haritası')}</span><strong>${t('Explore all lessons','Tüm dersleri keşfedin')}</strong></a>`;
 const side=`<details class="learn-course-nav" open><summary>${t('Course map','Öğrenme yolu')} <span>${course.lessons.length} ${t('lessons','ders')}</span></summary><nav aria-label="${t('Course lessons','Dersler')}">${course.stages.map(s=>`<div class="learn-nav-stage"><strong>${s.number} / ${esc(s.title[language])}</strong><ol>${course.lessons.map(id=>byId.get(id)).filter(e=>e.learning.stage===s.id).map(e=>`<li><a href="${route(e.path)}" data-nav-lesson="${e.id}"${e.id===entry.id?' aria-current="page"':''}><span>${String(e.learning.order).padStart(2,'0')}</span>${esc(e.locales[language].title)}</a></li>`).join('')}</ol></div>`).join('')}</nav></details>`;
 const toc=`<details class="learn-toc" open><summary>${t('In this lesson','Bu derste')}</summary><nav aria-label="${t('Lesson sections','Ders bölümleri')}"><ol>${copy.sections.map(s=>`<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('')}</ol></nav></details>`;
 return `${header}<main id="main-content" class="learn-reading" data-learn-article="${entry.id}">${breadcrumbs}
 <div class="learn-reader-grid">${side}<article class="learn-article">
 <header class="learn-article-header"><p class="eyebrow">${t('LESSON','DERS')} ${String(pos+1).padStart(2,'0')} / ${course.lessons.length} · ${esc(stage.title[language])}</p><h1>${esc(copy.title)}</h1><p class="learn-article-lede">${esc(copy.summary)}</p><div class="learn-reading-meta"><span>${entry.readingMinutes} ${t('min read','dk okuma')}</span><span><time datetime="${entry.updatedAt}">${t('Updated','Güncelleme:')} ${updated}</time></span><a href="${route(entry.path)}article.md" download>${t('Download Markdown','Markdown indir')} ↓</a></div>
 <div class="learn-objectives"><strong>${t('BY THE END, YOU CAN','BU DERSTE ÖĞRENECEKLERİNİZ')}</strong><ul>${entry.learning.objectives[language].map(o=>`<li>${esc(o)}</li>`).join('')}</ul></div>
 <p class="learn-prerequisites">${t('Before this lesson:','Bu dersten önce:')} ${entry.learning.prerequisites.length?entry.learning.prerequisites.map(id=>`<a href="${route(byId.get(id).path)}">${esc(byId.get(id).locales[language].title)}</a>`).join(' · '):t('No prerequisites. Start here.','Önkoşul yok. Buradan başlayın.')}</p></header>
 <div class="learn-article-body">${copy.sections.map(s=>`<section class="article-section" id="${s.id}"><h2>${esc(s.title)}<a class="heading-anchor" href="#${s.id}" aria-label="${t('Link to section','Bölüm bağlantısı')}">#</a></h2>${s.blocks.map(renderBlock).join('')}</section>`).join('')}</div>
 <div class="learn-lesson-finish"><div><strong>${t('Ready for the next idea?','Sonraki derse hazır mısınız?')}</strong><p>${t('Try the question before continuing. Your progress is saved in this browser when storage is available.','Devam etmeden soruyu deneyin. Tarayıcınız izin veriyorsa ilerlemeniz bu cihazda saklanır.')}</p></div><button type="button" class="button" data-mark-lesson="${entry.id}" hidden>${t('Mark as read','Okundu olarak işaretle')} ✓</button><p data-lesson-status aria-live="polite"></p></div>
 <nav class="learn-adjacent" aria-label="${t('Previous and next lesson','Önceki ve sonraki ders')}">${adjacent(previous,t('← PREVIOUS LESSON','← ÖNCEKİ DERS'))}${adjacent(next,t('NEXT LESSON →','SONRAKİ DERS →'))}</nav>
 <a class="learn-back-map" href="${route('learn/')}">← ${t('Back to the learning map','Öğrenme haritasına dönün')}</a>
 </article>${toc}</div>${footer}</main>`;
}
