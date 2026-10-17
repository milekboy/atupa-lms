import {test} from 'node:test';
import assert from 'node:assert/strict';
const origin='http://localhost:3100';
test('public catalog preserves useful content during upstream failures (local simulation)',async()=>{
 const read=async path=>{const response=await fetch(origin+path);return response.text();};
 const partial=await read('/courses');assert.match(partial,/language list couldn/);assert.match(partial,/Yoruba Beginner/);
 const failure=await read('/courses?languageCode=error');assert.match(failure,/Catalog temporarily unavailable/);assert.match(failure,/Try again/);assert.doesNotMatch(failure,/<article class="public-course-card/);
 const denied=await read('/courses?languageCode=denied');assert.match(denied,/This catalog view is restricted/);assert.match(denied,/Sign in/);
 const timeout=await read('/courses?languageCode=slow');assert.match(timeout,/service took too long/);assert.match(timeout,/Try again/);
 const detail=await read('/courses/ffffffffffffffffffffffff');assert.match(detail,/Course not found/);
 const home=await read('/');assert.match(home,/Learn your/);assert.match(home,/Hausa Beginner/);
});

