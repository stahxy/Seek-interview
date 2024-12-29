import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LogoutButton } from "./logout-button";
import { getSession } from "@/lib/auth";

export async function Header() {
	const session = await getSession();

	return (
		<header className="border-b">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="text-2xl font-bold">
					Another simple task manager
				</Link>
				<div className="flex items-center space-x-4">
					{session && <LogoutButton />}
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
