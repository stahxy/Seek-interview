import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

const users = new Map();

export async function POST(request: Request) {
	const { email, password } = await request.json();

	if (users.has(email)) {
		return NextResponse.json({ error: "User already exists" }, { status: 400 });
	}

	const hashedPassword = await hash(password, 10);
	users.set(email, { email, password: hashedPassword });

	const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

	cookies().set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});

	return NextResponse.json({ success: true });
}
