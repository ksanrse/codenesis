import fs from 'node:fs';
import path from 'node:path';
const dir = '.lh';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.report.json')).sort();
const ms = v => v == null ? '-' : Math.round(v) + 'ms';
const kb = v => v == null ? '-' : (v/1024).toFixed(0) + 'kB';
const rows = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const a = j.audits || {};
  const c = j.categories || {};
  const get = k => a[k]?.numericValue;
  rows.push({
    name: f.replace('.report.json',''),
    perf: Math.round((c.performance?.score ?? 0) * 100),
    a11y: Math.round((c.accessibility?.score ?? 0) * 100),
    bp: Math.round((c['best-practices']?.score ?? 0) * 100),
    FCP: ms(get('first-contentful-paint')),
    LCP: ms(get('largest-contentful-paint')),
    TBT: ms(get('total-blocking-time')),
    CLS: (a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
    SI: ms(get('speed-index')),
    TTI: ms(get('interactive')),
    bytes: kb(get('total-byte-weight')),
  });
}
console.table(rows);

// Top opportunities aggregated
const opps = {};
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const a = j.audits || {};
  for (const id of Object.keys(a)) {
    const x = a[id];
    if (x.scoreDisplayMode === 'numeric' && x.score != null && x.score < 0.9 && x.details?.overallSavingsMs > 0) {
      opps[id] ??= { id, title: x.title, totalMs: 0, runs: 0 };
      opps[id].totalMs += x.details.overallSavingsMs;
      opps[id].runs++;
    }
  }
}
const top = Object.values(opps).sort((a,b)=>b.totalMs-a.totalMs).slice(0, 15);
console.log('\nTOP OPPORTUNITIES (sum savings ms across runs):');
for (const o of top) console.log(`  ${Math.round(o.totalMs)}ms (${o.runs}x) — ${o.id}: ${o.title}`);

// Diagnostic items
console.log('\nKEY DIAGNOSTICS (mobile home):');
const home = JSON.parse(fs.readFileSync(path.join(dir,'home-mobile.report.json'),'utf8'));
const ids = ['unused-javascript','unminified-javascript','render-blocking-resources','uses-text-compression','uses-long-cache-ttl','third-party-summary','bootup-time','mainthread-work-breakdown','largest-contentful-paint-element','dom-size','font-display','uses-rel-preconnect','uses-rel-preload','legacy-javascript','duplicated-javascript','total-byte-weight','network-server-latency'];
for (const id of ids) {
  const x = home.audits[id];
  if (!x) continue;
  console.log(`  [${x.score==null?'?':x.score.toFixed(2)}] ${id}: ${x.displayValue || (x.details?.overallSavingsMs ? x.details.overallSavingsMs+'ms' : '')}`);
}
