"use client";
export const sessionEvent='atupa-session-changed';
let source:string|undefined;
export function sessionSource(){return source??(source=typeof crypto.randomUUID==='function'?crypto.randomUUID():Math.random().toString(36).slice(2));}
export function publishSessionChange(){window.dispatchEvent(new Event(sessionEvent));try{if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel(sessionEvent);channel.postMessage({source:sessionSource()});channel.close();}}catch{/* Session notification must never fail a successful authentication request. */}}
