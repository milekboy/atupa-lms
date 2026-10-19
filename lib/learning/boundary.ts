import {card} from "../discovery/contracts";
import {object} from "../api/contracts";
import {parseOutline} from "../catalog/contracts";
import {attempts,attemptStart,enrollments,learnerLesson,progress,result} from "./contracts";
export function learnerBoundary(path:string[],method:string,value:unknown):unknown{
 const key=path.join("/"),body=object(value),data=body.success===true&&"data"in body?body.data:value;let safe:unknown;
 if(method==="GET"&&/^gamecard\/cards\/[^/]+$/.test(key))safe=card(data);
 else if(method==="POST"&&key==="gamecard/scan"){const scan=object(data);safe={card:card(scan.card),rewarded:scan.rewarded};}
 else if(method==="GET"&&/^learning\/lessons\/[^/]+$/.test(key))safe=learnerLesson(data);
 else if(method==="POST"&&/^learning\/quizzes\/[^/]+\/attempts$/.test(key))safe=attemptStart(data);
 else if(method==="POST"&&/^learning\/attempts\/[^/]+\/submit$/.test(key))safe=result(data);
 else if(method==="GET"&&/^learning\/attempts\/[^/]+\/review$/.test(key))safe=result(data,true);
 else if(method==="GET"&&key==="learning/attempts")safe=attempts(data);
 else if(method==="GET"&&key==="progress/courses")safe=enrollments(data);
 else if(method==="GET"&&/^progress\/courses\/[^/]+$/.test(key))safe=progress(data);
 else if(method==="GET"&&/^courses\/[^/]+$/.test(key)){const outline=parseOutline(data);safe={...outline,course:{...outline.course,status:"published"}};}
 else return value;
 return body.success===true?{success:true,...(typeof body.message==="string"?{message:body.message}:{}),data:safe}:safe;
}
