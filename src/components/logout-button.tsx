"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/login");
		router.refresh();
	};

	return (
		<Button onClick={handleLogout} variant="outline">
			Logout
		</Button>
	);
}
