import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// Add this function to check if the path should be public
function isPublicPath(path: string) {
	const publicPaths = [
		"/login",
		"/register",
		"/api/auth/login",
		"/api/auth/register",
	];
	return publicPaths.includes(path);
}

export function middleware(request: NextRequest) {
	const a = "asd";
	// const path = request.nextUrl.pathname;

	// if (isPublicPath(path)) {
	// 	return NextResponse.next();
	// }

	// const token = request.cookies.get("token")?.value;

	// if (!token) {
	// 	return NextResponse.redirect(new URL("/login", request.url));
	// }

	// try {
	// 	verify(token, process.env.JWT_SECRET!);
	// 	return NextResponse.next();
	// } catch {
	// 	return NextResponse.redirect(new URL("/login", request.url));
	// }
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
