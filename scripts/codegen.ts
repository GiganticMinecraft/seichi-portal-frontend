import { execFileSync } from 'child_process';
import fs from 'fs';

const DEFAULT_OPENAPI_URL =
  'https://raw.githubusercontent.com/GiganticMinecraft/seichi-portal-backend/main/docs/openapi.json';
const OPENAPI_URL = process.env['OPENAPI_URL'] ?? DEFAULT_OPENAPI_URL;
const OUT_DIR = 'src/generated';
const OUT_FILE = `${OUT_DIR}/api-types.ts`;

fs.mkdirSync(OUT_DIR, { recursive: true });

// OpenAPI から TypeScript 型定義を生成
console.log(`Generating API types from ${OPENAPI_URL}`);
console.log(`Output: ${OUT_FILE}`);

execFileSync('pnpm', ['openapi-typescript', OPENAPI_URL, '-o', OUT_FILE], {
  stdio: 'inherit',
});

console.log('codegen complete');
