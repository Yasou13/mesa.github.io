import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAdminPage } from '../render_admin.mjs';
import { adminConfig } from '../admin/config.mjs';
import { AdminService } from '../admin/service.mjs';
for (const language of ['en','tr']) test(`admin safe static shell (${language})`,()=>{
 const html=renderAdminPage({language,assetBase:'../../'});
 assert.match(html,/noindex, nofollow/);assert.match(html,/<fieldset disabled>/);
 assert.match(html,/<section id="workspace" hidden/);assert.match(html,/"admin-config" type="application\/json">null/);
 assert.match(html,/form-action 'none'/);assert.match(html,/name="referrer" content="no-referrer"/);
 assert.doesNotMatch(html,/signUp\(|Publication job queued|role-badge/);
 assert.match(html,/\.\.\/\.\.\/cosmic.css/);
 assert.match(html,new RegExp(`<html lang="${language}"`));
});
test('public configuration fails closed for missing or privileged keys',()=>{
 assert.equal(adminConfig(),null);
 const jwt=role=>'eyJhbGciOiJIUzI1NiJ9.'+btoa(JSON.stringify({role}))+'.fixture';
 for(const key of ['sb_secret_fixture',jwt('service_role'),'password'])assert.throws(()=>adminConfig({MESA_SUPABASE_URL:'https://example.supabase.co',MESA_SUPABASE_PUBLISHABLE_KEY:key}));
 assert.throws(()=>adminConfig({MESA_SUPABASE_URL:'https://example.supabase.co'}));
 for(const url of ['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com/?key=x'])assert.throws(()=>adminConfig({MESA_SUPABASE_URL:url,MESA_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture'}));
 assert.equal(adminConfig({MESA_SUPABASE_URL:'http://127.0.0.1:54321',MESA_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture'}).url,'http://127.0.0.1:54321');
 assert.ok(adminConfig({MESA_SUPABASE_URL:'https://example.supabase.co',MESA_SUPABASE_PUBLISHABLE_KEY:jwt('anon')}));
});
test('identity and database role are independently verified before private access',async()=>{
 let calls=[];
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async name=>{calls.push(name);return{data:false};},from:()=>{throw new Error('PRIVATE DATA WAS REQUESTED');}};
 await assert.rejects(new AdminService(client).listArticles(),/ROLE/);assert.deepEqual(calls,['is_admin']);
 client.rpc=async()=>({data:true});assert.equal((await new AdminService(client).authorize()).id,'owner');
 client.auth.getUser=async()=>({data:{user:null},error:{}});await assert.rejects(new AdminService(client).authorize(),/SESSION/);
});
test('published records cannot be saved and unknown collections cannot be queried',async()=>{
 const service=new AdminService({auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({data:true}),from:()=>assert.fail('unexpected write')});
 await assert.rejects(service.saveDraft({status:'published'},{}),/PUBLISHED/);
 await assert.rejects(service.listRecords('editor_roles'),/DATA/);
});
test('draft saves are allowlisted and reject stale writes',async()=>{
 const calls=[]; const query={eq(...args){calls.push(['eq',...args]);return this;},in(...args){calls.push(['in',...args]);return this;},select(){return this;},async single(){return{data:null,error:{code:'PGRST116'}};}};
 const service=new AdminService({auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({data:true}),from:()=>({update:payload=>{calls.push(payload);return query;}})});
 await assert.rejects(service.saveDraft({id:'draft',slug:'draft',status:'draft',reading_minutes:5,updated_at:'old'},{title:'Title',summary:'Summary',body_markdown:'Text',status:'published',published_at:'forged'}),/CONFLICT/);
 assert.equal(calls[0].status,undefined);assert.equal(calls[0].published_at,undefined);
 assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='updated_at'&&c[2]==='old'));
});

import {slugify, filterAndSort, markdownEdit} from '../admin/editor.mjs';
test('Turkish titles produce stable public slugs',()=>{
 assert.equal(slugify('Türkçe İçerik: Işık, Öğrenme ve Şema!'),'turkce-icerik-isik-ogrenme-ve-sema');
});
test('filter and sort operate over a copy and search tags',()=>{
 const rows=[{title:'Z',summary:'A',tags:['Kaynak'],language:'tr',status:'draft',type:'guide',updated_at:'2026-01-01'},{title:'A',language:'en',status:'published',type:'learn',updated_at:'2026-02-01'}];
 assert.deepEqual(filterAndSort(rows,{search:'kaynak',type:'guide'}),[rows[0]]);
 assert.equal(filterAndSort(rows)[0],rows[1]);assert.equal(rows[0].title,'Z');
});
test('formatting preserves unselected source and selection boundaries',()=>{
 assert.deepEqual(markdownEdit('one two three',4,7,'bold'),{value:'one **two** three',start:6,end:9});
});
test('published records cannot be deleted through draft controls',async()=>{
 const service=new AdminService({auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({data:true}),from:()=>assert.fail('unexpected delete')});
 await assert.rejects(service.deleteDraft({status:'published'}),/PUBLISHED/);
});
test('request access checks the live role before reading or updating',async()=>{
 const service = new AdminService({auth:{getUser:async()=>({data:{user:{id:'editor'}}})},rpc:async()=>({data:false}),from:()=>assert.fail('private requests queried')});
 await assert.rejects(service.listAccessRequests(),/ROLE/);
 await assert.rejects(service.saveAccessRequest({id:'x'}, {status:'invited',admin_notes:''}),/ROLE/);
});
test('request updates allow only status and notes and reject stale writes',async()=>{
 const calls=[];
 const query={eq(...args){calls.push(args);return this;},select(){return this;},async single(){return {data:null,error:{code:'PGRST116'}};}};
 const service=new AdminService({auth:{getUser:async()=>({data:{user:{id:'owner'}}})},rpc:async()=>({data:true}),from:()=>({update:payload=>{calls.push(payload);return query;}})});
 await assert.rejects(service.saveAccessRequest({id:'x',updated_at:'old'}, {status:'contacted',admin_notes:'Note',email:'forged@example.test'}),/REQUEST_CONFLICT/);
 assert.deepEqual(calls[0],{status:'contacted',admin_notes:'Note'});
 assert.ok(calls.some(c=>c[0]==='updated_at'&&c[1]==='old'));
});
