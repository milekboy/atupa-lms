import Link from 'next/link';
export function ReportLink({targetType,targetId,label}:{targetType:'teacher'|'course'|'class'|'school';targetId:string;label?:string}){if(!/^[-\w]{1,128}$/.test(targetId))return null;return <Link className="button button-ghost" href={'/dashboard/safety?'+new URLSearchParams({targetType,targetId})}>{label||'Report this '+targetType}</Link>;}
