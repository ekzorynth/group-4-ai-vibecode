import {writeFileSync} from 'node:fs';
process.env.DB_PATH=':memory:';const {db}=await import('../web/store.mjs');
const rows=db.prepare("SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type DESC,name").all();writeFileSync('db/schema.sql','-- Schema snapshot; runtime migration authority: web/store.mjs\nPRAGMA foreign_keys=ON;\n'+rows.map(r=>r.sql+';').join('\n'));db.close();
