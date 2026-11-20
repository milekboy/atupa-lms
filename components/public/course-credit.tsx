import type {CourseCredits} from '@/lib/catalog/credits';
import {StatusPill} from '@/components/ui';
export function CourseCredit({course}:{course:CourseCredits}){if(!course.byAtupa&&!course.author)return null;return <div className="course-credit">{course.byAtupa===true&&<StatusPill>By ATUPA</StatusPill>}{course.author&&<span>By {course.author.name||'course author'} {course.author.isVerified===true&&<StatusPill tone="success">Verified author</StatusPill>}</span>}</div>;}
