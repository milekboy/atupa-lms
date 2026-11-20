import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseAdminAccess,adminNavigation,foundationAllowed} from '../lib/admin-console/contracts';
import {safeUser,normalizeSession} from '../lib/api/contracts';
import {canAccess,safeReturnTo} from '../lib/auth/roles';
import {accountPayload} from '../lib/auth/account-contracts';
const access={role:'support_admin',permissions:['dashboard.view'],menu:[{key:'home',label:'Overview',path:'/admin'}]};
test('support sessions normalize without allowing privileged public registration',()=>{
 const user={id:'support',role:'support_admin',firstName:'Support',lastName:'Test'};
 assert.equal(safeUser(user).role,'support_admin');
 assert.equal(normalizeSession({success:true,data:{user,accessToken:'fixture-access',refreshToken:'fixture-refresh',expiresIn:900}}).user.role,'support_admin');
 assert.throws(()=>accountPayload('register',{...user,email:'test@example.test',password:'fixture-password'}));
});
test('menus use known exact routes and permissions, not backend URLs or labels',()=>{
 const data=parseAdminAccess({...access,menu:[...access.menu,{key:'home',label:'Duplicate',path:'/admin'},{key:'users',label:'Users',path:'/admin/users'},{key:'home',label:'External',path:'https://evil.test'},{key:'home',label:'Lookalike',path:'/adminish'}]},'support_admin');
 assert.deepEqual(adminNavigation(data).map(x=>x.href),['/admin']);
 assert.equal(data.menu[0].label,'Console home');
 assert.deepEqual(parseAdminAccess({...access,permissions:[]},'support_admin').menu,[]);
 assert.throws(()=>parseAdminAccess({...access,permissions:'*'},'support_admin'));
 assert.throws(()=>parseAdminAccess({...access,role:'super_admin'},'support_admin'));
 assert.throws(()=>parseAdminAccess({...access,menu:[null]},'support_admin'));
});
test('foundation endpoints deny missing roles, methods and unsupported support operations',()=>{
 for(const role of ['learner','parent','teacher'] as const){assert.equal(canAccess('/admin',role),false);assert.equal(foundationAllowed(['admin','me','permissions'],'GET',role),false);}
 for(const role of ['super_admin','support_admin','content_creator','school_admin'] as const){assert.equal(canAccess('/admin',role),true);assert.equal(foundationAllowed(['admin','me','permissions'],'POST',role),false);}
 for(const path of [['admin','users'],['authoring','courses'],['schools'],['classes'],['media','upload'],['subscriptions','mine']])assert.equal(foundationAllowed(path,'GET','support_admin'),false);
 assert.equal(foundationAllowed(['users','me'],'GET','support_admin'),true);
 assert.equal(foundationAllowed(['users','other'],'GET','support_admin'),false);
 assert.equal(foundationAllowed(['authoring','courses'],'POST','teacher'),true);
 assert.equal(canAccess('/dashboard/content','support_admin'),false);
 assert.equal(canAccess('/admin/users','super_admin'),true);
});
test('admin sign-in returns safely without accepting lookalikes, query redirects or traversal',()=>{
 assert.equal(safeReturnTo('/admin'),'/admin');
 for(const path of ['/adminish','/admin/../dashboard','/admin?next=https://evil.test','//evil.test/admin'])assert.equal(safeReturnTo(path),'/dashboard');
 assert.equal(safeReturnTo('/dashboard/courses?page=2'),'/dashboard/courses?page=2');
});
