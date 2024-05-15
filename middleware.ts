import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
    const user = (await auth())?.user;
    const response = NextResponse.next();

    if (!user || !user.id) {
        return NextResponse.redirect(
            new URL("/signin", req.url)
        );
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard"
    ]
};