import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

// This should be replaced with your actual user storage/database
const users = new Map();

export async function POST(request: Request) {
	const { email, password } = await request.json();

	const user = users.get(email);
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 400 });
	}

	const passwordMatch = await compare(password, user.password);
	if (!passwordMatch) {
		return NextResponse.json({ error: "Invalid password" }, { status: 400 });
	}

	const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

	// Use cookies() function to set the cookie
	cookies().set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 3600, // 1 hour in seconds
		path: "/",
	});

	return NextResponse.json({ success: true });
}
