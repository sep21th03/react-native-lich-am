#!/usr/bin/env node
/**
 * Build package:
 *   1. tsc  →  lib/  (CommonJS + .d.ts)
 *   2. copy src/dataset/data/*.json  →  lib/dataset/data/
 *   3. sinh proxy ở gốc package để `react-native-lich-am/dataset/2024`
 *      phân giải được cả khi bundler KHÔNG hỗ trợ trường "exports"
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function run(cmd, args) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit' });
}

/* 1. TypeScript ------------------------------------------------------ */
const tsc = path.join(ROOT, 'node_modules', '.bin', 'tsc');
if (!fs.existsSync(tsc)) {
  console.error('Không thấy node_modules/.bin/tsc — chạy `npm install` trước.');
  process.exit(1);
}
fs.rmSync(path.join(ROOT, 'lib'), { recursive: true, force: true });
run(tsc, ['-p', 'tsconfig.json']);

/* 2. Dữ liệu ---------------------------------------------------------
 * Chép src/dataset/data/*.json sang lib/dataset/data/ để lib/ tự chứa.
 * Nhờ vậy package chỉ cần publish lib/ + các proxy ở gốc, không cần src/.
 * ------------------------------------------------------------------ */
const srcData = path.join(ROOT, 'src', 'dataset', 'data');
const outData = path.join(ROOT, 'lib', 'dataset', 'data');
fs.mkdirSync(outData, { recursive: true });
let copied = 0;
for (const f of fs.readdirSync(srcData)) {
  if (!f.endsWith('.json')) continue;
  fs.copyFileSync(path.join(srcData, f), path.join(outData, f));
  copied += 1;
}
console.log(`data: chép ${copied} file json → lib/dataset/data`);

/* 3. Proxy ở gốc package --------------------------------------------- */
const SUBPATHS = {
  core: { target: 'lib/core/index' },
  dataset: { target: 'lib/dataset/index' },
  ui: { target: 'lib/ui/index' },
};

for (const [name, cfg] of Object.entries(SUBPATHS)) {
  const dir = path.join(ROOT, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        main: `../${cfg.target}.js`,
        types: `../${cfg.target}.d.ts`,
        sideEffects: false,
      },
      null,
      2,
    ) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `module.exports = require('../${cfg.target}.js');\n`,
  );
  fs.writeFileSync(
    path.join(dir, 'index.d.ts'),
    `export * from '../${cfg.target}';\n`,
  );
}

// dataset/YYYY proxy
for (const y of ['2024', '2025', '2026', '2027', '2028']) {
  const dir = path.join(ROOT, 'dataset');
  fs.writeFileSync(
    path.join(dir, `${y}.js`),
    `module.exports = require('../lib/dataset/${y}.js');\n`,
  );
  fs.writeFileSync(
    path.join(dir, `${y}.d.ts`),
    `export * from '../lib/dataset/${y}';\n`,
  );
}

console.log('proxy subpath: core/ dataset/ ui/ (+ dataset/2024..2028)');
console.log('build xong.');
