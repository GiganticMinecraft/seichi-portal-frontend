import { execSync } from 'child_process';
import fs from 'fs';

const OPENAPI_URL = 'http://localhost:9000/api-docs/openapi.json';
const OUT_DIR = 'src/generated';

fs.mkdirSync(OUT_DIR, { recursive: true });

// OpenAPI から TypeScript 型定義を生成
execSync(`pnpm openapi-typescript ${OPENAPI_URL} -o ${OUT_DIR}/api-types.ts`, {
  stdio: 'inherit',
});

console.log('codegen complete');
