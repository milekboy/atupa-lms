import {test} from 'node:test';
import assert from 'node:assert/strict';
const origin='http://localhost:3100';
test('all six synthetic roles render their workspace and enforce direct access',async()=>{
 for(const role of ['learner','parent','teacher','school_admin','content_creator','super_admin']){
  const login=await fetch(origin+'/api/auth/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:role+'@example.test',password:'fixture-password'})});
  assert.equal(login.status,200);const cookie=login.headers.get('set-cookie').split(';')[0];
  const dashboard=await fetch(origin+'/dashboard',{headers:{Cookie:cookie}});const html=await dashboard.text();assert.equal(dashboard.status,200);assert.match(html,/Welcome back/);assert.doesNotMatch(html,/access-learner|refresh-learner/);
  const denied=await fetch(origin+'/dashboard/users',{headers:{Cookie:cookie}});await denied.text();assert.equal(denied.status,404);
  const profile=await fetch(origin+'/dashboard/profile',{headers:{Cookie:cookie}});assert.equal(profile.status,200);assert.match(await profile.text(),/My account/);
  const notices=await fetch(origin+'/api/backend/notifications',{headers:{Cookie:cookie}});assert.equal(notices.status,200);assert.deepEqual((await notices.json()).data.items,[]);
  await fetch(origin+'/api/auth/logout',{method:'POST',headers:{Origin:origin,Cookie:cookie}});
 }
});

