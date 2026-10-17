import {test} from "node:test";import assert from "node:assert/strict";
import {destinations,isActive,navigationFor,searchNavigation,roleIntroductions} from "../lib/dashboard/navigation";
import {roles} from "../types/auth";
import {canAccess} from "../lib/auth/roles";
test("all six roles receive only implemented authorized destinations",()=>{for(const role of roles){const items=navigationFor(role);assert.ok(items.length>0);assert.ok(items.every(item=>item.implemented&&item.roles.includes(role)&&canAccess(item.href,role)));assert.ok(items.some(item=>item.href==="/dashboard/profile"));assert.ok(roleIntroductions[role].title);}});
test("navigation search cannot surface privileged or unfinished pages",()=>{for(const role of roles)assert.deepEqual(searchNavigation(role,"users"),[]);assert.ok(searchNavigation("learner","password").some(item=>item.href==="/dashboard/profile"));assert.equal(destinations.find(item=>item.href==="/dashboard/users")?.roles.includes("learner"),false);});
test("active links use segment boundaries",()=>{assert.equal(isActive("/dashboard/profile","/dashboard"),false);assert.equal(isActive("/dashboard/profile/security","/dashboard/profile"),true);assert.equal(isActive("/dashboard/profile-other","/dashboard/profile"),false);});
test("unknown paths and cross-role protected sections fail closed",()=>{assert.equal(canAccess("/dashboard/unknown","learner"),false);assert.equal(canAccess("/dashboard/members","learner"),false);assert.equal(canAccess("/dashboard/members","school_admin"),true);assert.equal(canAccess("/dashboard/reports","parent"),false);});
