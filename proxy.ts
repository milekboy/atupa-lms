import { NextRequest,NextResponse } from "next/server";
export function proxy(request:NextRequest) {
  const name=process.env.NODE_ENV==="production"?"__Host-atupa_session":"atupa_session";
  if(!/^[a-f0-9]{64}$/.test(request.cookies.get(name)?.value??"")) {
    const login=new URL("/login",request.url);login.searchParams.set("returnTo",request.nextUrl.pathname+request.nextUrl.search);return NextResponse.redirect(login);
  }
  // Optimistic cookie check only. Every dashboard page must call requireUser before data access.
  const headers=new Headers(request.headers);headers.set("x-atupa-path",request.nextUrl.pathname);return NextResponse.next({request:{headers}});
}
export const config={matcher:["/dashboard/:path*"]};
