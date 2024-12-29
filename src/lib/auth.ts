import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function getSession() {
	const token = cookies().get("token")?.value;

	if (!token) {
		return null;
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET!) as {
			email: string;
		};
		return { email: decoded.email };
	} catch {
		return null;
	}
}
