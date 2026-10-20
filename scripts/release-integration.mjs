import {spawn} from 'node:child_process';
import {createConnection,createServer} from 'node:net';
import {openSync,mkdtempSync,readFileSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
const cases=[['auth',['session-http','account-http','dashboard-http']],['catalog',['catalog-failures']],['public-session',['public-session-http']],['authoring',['authoring-http','assessments-http']],['learning',['learning-http']],['progress',['progress-http']],['discovery',['discovery-http']],['certificates',['certificates-http']],['schools',['schools-http']],['assignments',['assignments-http']],['parents',['parents-http']],['admin',['admin-http']],['insights',['insights-http']],['search',['search-http']],['free-launch',['free-launch-http']]];
const chosen=process.argv.slice(2),selected=chosen.length?cases.filter(([name])=>chosen.includes(name)):cases;
if(!selected.length)throw Error('Choose an existing simulation name.');
const logs=mkdtempSync(join(tmpdir(),'atupa-release-'));console.log('Local synthetic test logs:',logs);const report=[];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function available(port){await new Promise((resolve,reject)=>{const server=createServer();server.once('error',reject);server.listen(port,'127.0.0.1',()=>server.close(resolve));});}
async function listening(port){return new Promise(resolve=>{const socket=createConnection({port,host:'127.0.0.1'});socket.on('connect',()=>{socket.destroy();resolve(true)});socket.on('error',()=>resolve(false));});}
async function ready(child,port){for(let n=0;n<100;n++){if(child.exitCode!==null)throw Error('Test process exited; inspect logs.');if(await listening(port))return;await delay(200);}throw Error('Test listener did not start.');}
function run(command,args,log,env={}){const fd=openSync(log,'w');const child=spawn(command,args,{stdio:['ignore',fd,fd],windowsHide:true,env:{...process.env,...env}});child.on('error',e=>console.error(e.message));return child;}
async function stop(child){if(!child||child.exitCode!==null)return;if(process.platform==='win32')await new Promise(resolve=>spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true}).on('exit',resolve));else child.kill('SIGTERM');}
await available(3100);await available(4900);let frontend,simulation;
try{frontend=run(process.execPath,['scripts/start-session-test.mjs'],join(logs,'frontend.log'));await ready(frontend,3100);
for(const [name,tests]of selected){const log=join(logs,name+'.ndjson');try{simulation=run(process.platform==='win32'?'postman.exe':'postman',['simulation','run',`postman/simulations/${name}.sim.yaml`,'--port','4900','--no-history','--output','ndjson'],log);await ready(simulation,4900);let passed=true;for(const file of tests){const testlog=join(logs,file+'.tap');const child=run(process.execPath,['--test',`tests/${file}.mjs`],testlog);const code=await new Promise(resolve=>child.on('exit',resolve));const result=readFileSync(testlog,'utf8');if(code!==0){passed=false;console.log(result);}console.log(`${file}: ${code===0?'PASS':'FAIL'}`);}const requests=readFileSync(log,'utf8').split('\n').filter(line=>{try{return JSON.parse(line).event==='request'}catch{return false}}).length;report.push({simulation:name,passed,requests});if(!requests)throw Error(name+': no upstream request events recorded');}finally{await stop(simulation);simulation=null;for(let n=0;n<30&&await listening(4900);n++)await delay(100);}}
}finally{await stop(simulation);await stop(frontend);writeFileSync(join(logs,'summary.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));if(report.some(r=>!r.passed))process.exitCode=1;
