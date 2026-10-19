import {test} from "node:test";import assert from "node:assert/strict";
import {ActiveClock,blockPosition} from "../lib/learning/telemetry";
test('foreground clock pauses on background and never catches up suspended minutes',()=>{const c=new ActiveClock();c.tick(0,true);c.tick(5000,true);assert.equal(c.take(),5);c.tick(10000,false);c.tick(100000,true);assert.equal(c.take(),0);c.tick(200000,true);assert.equal(c.take(),5);});
test('reading position cannot locally mark completion',()=>{assert.deepEqual(blockPosition(1,2),{lastBlockIndex:1,progressPercent:99});assert.deepEqual(blockPosition(0,4),{lastBlockIndex:0,progressPercent:25});});
