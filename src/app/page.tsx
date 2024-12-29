import { TaskList } from "@/components/task-list";
import { CreateTaskForm } from "@/components/create-task-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const session = await getSession();

	if (!session) {
		redirect("/login");
	}

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Welcome 👋, {session.email}</h1>

			<Card className="w-full shadow-md">
				<CardHeader>
					<CardTitle>Create New Task</CardTitle>
					<CardDescription>Add a new task to your list</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateTaskForm />
				</CardContent>
			</Card>

			<Card className="w-full shadow-md">
				<CardHeader>
					<CardTitle>Your Tasks</CardTitle>
					<CardDescription>Manage and track your tasks</CardDescription>
				</CardHeader>
				<CardContent>
					<TaskList />
				</CardContent>
			</Card>
		</div>
	);
}
