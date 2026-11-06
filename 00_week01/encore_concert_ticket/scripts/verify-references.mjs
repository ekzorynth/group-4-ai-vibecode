import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('references');
const manifest=JSON.parse(readFileSync(root+'/manifest.json','utf8'));
const gallery=JSON.parse(readFileSync(root+'/gallery.json','utf8'));
assert.equal(new Set(manifest.map(m=>m.file)).size,manifest.length,'Duplicate reference file');
for(const m of manifest){
 const path=resolve(root,m.file);assert.ok(path.startsWith(root+sep),'Reference must be inside library');const data=readFileSync(path);
 assert.equal(data.length,m.bytes,m.file+' size');assert.equal(createHash('sha256').update(data).digest('hex'),m.sha256,m.file+' digest');assert.equal(new URL(m.source_page).protocol,'https:');assert.ok(m.reference);assert.match(m.accessed_date,/^\d{4}-\d{2}-\d{2}$/);
 if(m.kind==='browser_screenshot')assert.equal(data.subarray(0,3).toString('hex'),'ffd8ff',m.file+' JPEG signature');
 if(m.derived_from)assert.ok(existsSync(resolve(root,m.derived_from)));
}
for(const item of gallery.items){assert.ok(manifest.some(m=>m.file===item.image&&m.reference===item.id),'Gallery source provenance');assert.ok(existsSync(resolve(root,item.own)),'Missing ENCORE screenshot '+item.own);assert.match(item.requirements,/FR\d+/);assert.match(item.tests,/A\d+/);assert.match(item.tests,/U\d+/);}
console.log(JSON.stringify({referenceFiles:manifest.length,browserScreenshots:manifest.filter(m=>m.kind==='browser_screenshot').length,comparisons:gallery.items.length,hashes:'passed',links:'local files verified'}));
