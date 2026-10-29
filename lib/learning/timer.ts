export function secondsLeft(initial:number,started:number,now:number){return Math.max(0,Math.ceil(initial-Math.max(0,now-started)/1000));}
export function clockLabel(seconds:number){return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
