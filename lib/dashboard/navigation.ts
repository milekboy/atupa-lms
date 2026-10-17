import type {Role} from "@/types/auth";
export type Destination={label:string;href:string;group:string;icon:"home"|"account"|"courses"|"progress"|"children"|"classes"|"content"|"users"|"reports"|"assignments"|"schools"|"languages";roles:readonly Role[];implemented:boolean;keywords:string[]};
const everyone:Role[]=["learner","parent","teacher","school_admin","content_creator","super_admin"];
// Activate a destination only when its real page and permissions are implemented.
export const destinations:Destination[]=[
 {label:"Overview",href:"/dashboard",group:"Workspace",icon:"home",roles:everyone,implemented:true,keywords:["home","dashboard","welcome"]},
 {label:"My courses",href:"/dashboard/courses",group:"Learning",icon:"courses",roles:["learner"],implemented:false,keywords:["lessons","language"]},
 {label:"Progress",href:"/dashboard/progress",group:"Learning",icon:"progress",roles:["learner"],implemented:false,keywords:["points","badges"]},
 {label:"My children",href:"/dashboard/children",group:"Family",icon:"children",roles:["parent"],implemented:false,keywords:["child","family"]},
 {label:"Classes",href:"/dashboard/classes",group:"Teaching",icon:"classes",roles:["teacher","school_admin"],implemented:false,keywords:["students"]},
 {label:"Assignments",href:"/dashboard/assignments",group:"Teaching",icon:"assignments",roles:["teacher","learner"],implemented:false,keywords:["work","review"]},
 {label:"Content",href:"/dashboard/content",group:"Publishing",icon:"content",roles:["teacher","content_creator","super_admin"],implemented:false,keywords:["author","courses","lessons","cms"]},
 {label:"School members",href:"/dashboard/members",group:"School",icon:"users",roles:["school_admin"],implemented:false,keywords:["teachers","learners"]},
 {label:"Users",href:"/dashboard/users",group:"Administration",icon:"users",roles:["super_admin"],implemented:false,keywords:["accounts"]},
 {label:"Schools",href:"/dashboard/schools",group:"Administration",icon:"schools",roles:["super_admin"],implemented:false,keywords:["school"]},
 {label:"Languages",href:"/dashboard/languages",group:"Administration",icon:"languages",roles:["super_admin"],implemented:false,keywords:["yoruba","igbo","hausa"]},
 {label:"Reports",href:"/dashboard/reports",group:"Insights",icon:"reports",roles:["teacher","school_admin","super_admin"],implemented:false,keywords:["analytics","performance"]},
 {label:"My account",href:"/dashboard/profile",group:"Personal",icon:"account",roles:everyone,implemented:true,keywords:["profile","password","settings","security"]},
];
export function navigationFor(role:Role){return destinations.filter(item=>item.implemented&&item.roles.includes(role));}
export function searchNavigation(role:Role,query:string){const q=query.trim().toLocaleLowerCase();return navigationFor(role).filter(item=>!q||`${item.label} ${item.group} ${item.keywords.join(" ")}`.toLocaleLowerCase().includes(q));}
export function isActive(path:string,href:string){return href==="/dashboard"?path===href:path===href||path.startsWith(href+"/");}
export const roleNames:Record<Role,string>={learner:"Learner",parent:"Parent",teacher:"Teacher",school_admin:"School administrator",content_creator:"Content creator",super_admin:"Platform administrator"};
export const roleIntroductions:Record<Role,{title:string;description:string;eyebrow:string}>={
 learner:{title:"A little learning. A deeper connection.",description:"Make space for the languages, stories and traditions that connect us.",eyebrow:"Your learning space"},
 parent:{title:"Grow their connection to home.",description:"Support your child's journey through Nigerian languages and culture.",eyebrow:"Your family space"},
 teacher:{title:"Bring culture into the classroom.",description:"Help every learner find their voice through language, practice and play.",eyebrow:"Your teaching space"},
 school_admin:{title:"A connected school. A shared heritage.",description:"Bring your school community together around meaningful language learning.",eyebrow:"Your school workspace"},
 content_creator:{title:"Every lesson carries a story.",description:"Create thoughtful learning experiences that bring Nigerian language and culture to life.",eyebrow:"Your publishing workspace"},
 super_admin:{title:"One platform. Many possibilities.",description:"Support the people and learning experiences at the heart of ATUPA.",eyebrow:"Your administration workspace"},
};
