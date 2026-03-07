import { execSync } from 'child_process';
import fs from 'fs';

const OPENAPI_URL = 'http://localhost:9000/api-docs/openapi.json';
const OUT_DIR = 'src/generated';

fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. TypeScript 型定義生成
execSync(`pnpm openapi-typescript ${OPENAPI_URL} -o ${OUT_DIR}/api-types.ts`, {
  stdio: 'inherit',
});

// 2. Zod スキーマ + fetch クライアント生成
execSync(`pnpm openapi-zod-client ${OPENAPI_URL} -o ${OUT_DIR}/api-client.ts`, {
  stdio: 'inherit',
});

// 3. Zod v3 互換パスへ post-process
const clientFile = `${OUT_DIR}/api-client.ts`;
const content = fs.readFileSync(clientFile, 'utf-8');
fs.writeFileSync(clientFile, content.replaceAll("from 'zod'", "from 'zod/v3'"));

console.log('codegen complete');
