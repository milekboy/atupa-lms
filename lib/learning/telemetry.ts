// Count monotonic elapsed foreground time only. Never catch up after a suspended timer.
export class ActiveClock {
 private previous:number|null=null; private accumulated=0;
 tick(now:number,eligible:boolean){if(this.previous!==null&&eligible)this.accumulated+=Math.max(0,Math.min(now-this.previous,5000));this.previous=eligible?now:null;}
 take(){const seconds=Math.floor(this.accumulated/1000);this.accumulated-=seconds*1000;return seconds;}
}
export function blockPosition(index:number,count:number){return {lastBlockIndex:Math.max(0,Math.min(index,count-1)),progressPercent:Math.min(99,Math.round((index+1)/Math.max(count,1)*100))};}
