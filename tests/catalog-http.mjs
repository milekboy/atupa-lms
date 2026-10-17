import {test} from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.CATALOG_TEST_ORIGIN??'http://localhost:3000';
async function read(path){const r=await fetch(origin+path);return {status:r.status,html:await r.text()};}
test('anonymous public pages render catalog data, URL filters and outlines',async()=>{
 const home=await read('/');assert.equal(home.status,200);assert.match(home.html,/Learn your/);assert.match(home.html,/Hausa Beginner/);assert.doesNotMatch(home.html,/Foundation preview/);
 const all=await read('/courses');assert.equal(all.status,200);assert.equal((all.html.match(/<article class="public-course-card/g)??[]).length,6);assert.match(all.html,/Page <!-- -->1<!-- --> of <!-- -->2/);
 const filtered=await read('/courses?languageCode=yoruba&level=beginner');assert.equal((filtered.html.match(/<article class="public-course-card/g)??[]).length,1);assert.match(filtered.html,/Yoruba Beginner/);
 const second=await read('/courses?page=2');assert.equal((second.html.match(/<article class="public-course-card/g)??[]).length,3);assert.match(second.html,/Previous/);
 const detail=await read('/courses/6ad20e4aef26c6008e65f4d6');assert.match(detail.html,/Premium course/);assert.match(detail.html,/Basic Greetings/);assert.match(detail.html,/Greetings quiz/);assert.match(detail.html,/Animal vocabulary/);assert.doesNotMatch(detail.html,/passwordHash|createdByUserId|refreshToken/);
 const empty=await read('/courses?languageCode=nonexistent');assert.match(empty.html,/Your next chapter is still being written/);
 const beyond=await read('/courses?page=999');assert.match(beyond.html,/outside available results/);
 const invalid=await read('/courses?level=expert');assert.match(invalid.html,/Check your filters/);
 const missing=await read('/courses/not-an-id');assert.match(missing.html,/Course not found/);
});
