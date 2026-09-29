#!/usr/bin/env node
/**
 * Chốt chặn trước khi publish. Chạy tự động qua `prepublishOnly`.
 *
 *   node scripts/check-package.mjs
 *
 * Vì sao cần: IDE (JetBrains/WebStorm, VS Code có extension) có thể tự ghi thêm
 * `dependencies` và `directories` vào package.json khi mở project. Bản 1.0.0 từng
 * bị như vậy — 331 gói phụ thuộc bị nhét vào `dependencies`, khiến npm tải cả cây
 * react-native về máy người dùng dù thư viện không dùng gì.
 *
 * Script này thoát với mã lỗi nếu package.json có dấu hiệu bị can thiệp, nên
 * `npm publish` sẽ dừng lại thay vì đăng một bản bẩn.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const errors = [];
const notes = [];

/* 1. Thư viện này không có phụ thuộc runtime nào. */
const deps = pkg.dependencies || {};
const depNames = Object.keys(deps);
if (depNames.length) {
  errors.push(
    `"dependencies" phải rỗng nhưng đang có ${depNames.length} gói: `
    + `${depNames.slice(0, 8).join(', ')}${depNames.length > 8 ? ', …' : ''}`,
  );
}

/* 2. "directories" không dùng ở đây — dấu hiệu IDE ghi vào. */
if (pkg.directories) {
  errors.push(`"directories" không nên có: ${JSON.stringify(pkg.directories)}`);
}

/* 3. Chỉ publish phần đã dựng + proxy, không publish src/ hay node_modules. */
for (const bad of ['src', 'node_modules', 'scripts']) {
  if ((pkg.files || []).includes(bad)) errors.push(`"files" không được chứa "${bad}"`);
}

/* 4. Entry point phải tồn tại thật. */
for (const f of [pkg.main, pkg.types].filter(Boolean)) {
  if (!fs.existsSync(path.join(ROOT, f))) errors.push(`thiếu file entry point: ${f}`);
}

/* 5. Proxy subpath cho bundler không hỗ trợ "exports". */
for (const dir of ['core', 'dataset', 'ui']) {
  if (!fs.existsSync(path.join(ROOT, dir, 'package.json'))) {
    errors.push(`thiếu proxy ${dir}/package.json — chạy \`npm run build\``);
  }
}

/* 6. peerDependencies phải là tuỳ chọn, nếu không npm sẽ tự cài react-native. */
for (const name of Object.keys(pkg.peerDependencies || {})) {
  if (!pkg.peerDependenciesMeta?.[name]?.optional) {
    errors.push(`peerDependencies "${name}" phải được đánh dấu optional trong peerDependenciesMeta`);
  }
}

if (depNames.length === 0) notes.push('dependencies: rỗng (đúng — không có phụ thuộc runtime)');
notes.push(`peerDependencies: ${Object.keys(pkg.peerDependencies || {}).join(', ') || '(không có)'} — đều optional, npm không tự cài`);
notes.push(`version: ${pkg.version}`);

console.log('Kiểm tra package.json trước khi publish');
notes.forEach((n) => console.log(`   ${n}`));

if (errors.length) {
  console.error(`\n!! ${errors.length} vấn đề — dừng publish:`);
  errors.forEach((e) => console.error(`   - ${e}`));
  console.error('\nNếu "dependencies" bị IDE thêm lại, xoá key đó khỏi package.json rồi thử lại.');
  process.exit(1);
}

console.log('\npackage.json sạch — publish được.');
