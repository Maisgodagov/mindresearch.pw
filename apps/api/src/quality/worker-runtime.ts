import { Worker } from 'node:worker_threads';
import { createRequire } from 'node:module';

export function createQualityWorker() {
  if (new URL(import.meta.url).pathname.endsWith('.ts')) {
    const api = createRequire(import.meta.url).resolve('tsx/esm/api');
    const source = new URL('./worker.ts', import.meta.url).href;
    const bootstrap = `const { tsImport } = require(${JSON.stringify(api)}); tsImport(${JSON.stringify(source)}, ${JSON.stringify(import.meta.url)}).catch(error => { throw error; });`;
    return new Worker(bootstrap, { eval: true, execArgv: [] });
  }
  return new Worker(new URL('./worker.js', import.meta.url));
}
