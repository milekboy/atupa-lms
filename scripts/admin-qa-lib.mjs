import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {openSync,closeSync,readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';import {createHash} from 'node:crypto';
export const delay=ms=>new Promise(r=>setTimeout(r,ms));
export async function available(port){await new Promise((resolve,reject)=>{const server=createServer();server.once('error',reject);server.listen(port,'127.0.0.1',()=>server.close(resolve));});}
export function launch(args,log,env={},cwd=process.cwd()){const fd=openSync(log,'w');const child=spawn(process.execPath,args,{cwd,stdio:['ignore',fd,fd],env:{...process.env,...env}});closeSync(fd);child.on('error',error=>{child.startupError=error;});return child;}
export async function ready(url,child){for(let i=0;i<150;i++){if(child.startupError||child.exitCode!==null||child.signalCode)throw Error('Local test service exited; inspect its log.');try{await fetch(url,{signal:AbortSignal.timeout(1000)});return;}catch{await delay(200);}}throw Error('Local test service did not start.');}
export async function stop(child){if(!child||child.exitCode!==null||child.signalCode)return;await new Promise(resolve=>{const timer=setTimeout(()=>child.kill('SIGKILL'),5000);child.once('exit',()=>{clearTimeout(timer);resolve();});child.kill('SIGTERM');});}
export async function command(args,log,env={}){const child=launch(args,log,env);const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>resolve(code??1));});return {exitCode:code,log};}
export function tapTotals(output){const number=key=>Number(new RegExp('^# '+key+' (\\d+)\\s*$','m').exec(output)?.[1]||0);return {tests:number('tests'),passed:number('pass'),failed:number('fail'),cancelled:number('cancelled'),skipped:number('skipped')};}
export function sourceFingerprint(root=process.cwd()){
 const files=[];function visit(dir){if(!existsSync(dir))return;for(const entry of readdirSync(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isSymbolicLink()||entry.name.startsWith('.env')||['node_modules','.next','.git'].includes(entry.name)||entry.name.endsWith('.tsbuildinfo'))continue;if(entry.isDirectory())visit(path);else files.push(path);}}
 for(const dir of ['app','components','lib','types','scripts','tests','postman/mocks','public'])visit(resolve(root,dir));for(const f of ['package.json','package-lock.json','next.config.ts','proxy.ts','tsconfig.json'])if(existsSync(resolve(root,f)))files.push(resolve(root,f));
 const hash=createHash('sha256');for(const f of files.sort()){hash.update(f.slice(resolve(root).length+1));hash.update('\0');hash.update(readFileSync(f));hash.update('\0');}return hash.digest('hex');
}
