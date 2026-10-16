import { spawn } from 'node:child_process';
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','-p','3100'],{stdio:'inherit',env:{...process.env,API_BASE_URL:'http://127.0.0.1:4900/backend/api/v1',API_TIMEOUT_MS:'1000',SESSION_STORE:'memory',APP_ORIGIN:'http://localhost:3100'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
