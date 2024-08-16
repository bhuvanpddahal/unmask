import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { guestOnlyRoutes, protectedRoutes } from "@/constants";

export async function middleware(req: NextRequest) {
    const user = (await auth())?.user;
    const isSignedIn = !!(user && user.id);
    const search = req.nextUrl.search;
    const pathname = req.nextUrl.pathname;
    const response = NextResponse.next();

    if (isSignedIn && guestOnlyRoutes.includes(pathname)) {
        const redirectTo = req.nextUrl.searchParams.get("redirectTo");
        const url = redirectTo || DEFAULT_LOGIN_REDIRECT;

        return NextResponse.redirect(
            new URL(url, req.url)
        );
    }
    if (!isSignedIn && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(
            new URL(`/signin?redirectTo=${pathname}${search}`, req.url)
        );
    }

    return response;
}

export const config = {
    matcher: [
        ...protectedRoutes,
        ...guestOnlyRoutes
    ]
};