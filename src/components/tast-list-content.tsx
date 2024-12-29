import { getTasks } from "@/lib/api";
import { TaskItem } from "./task-item";

export async function getTaskListData() {
	return await getTasks();
}

export async function TaskListContent() {
	const tasks = await getTaskListData();
	return (
		<div className="space-y-4">
			{tasks.map((task) => (
				<TaskItem key={task.id} task={task} />
			))}
		</div>
	);
}
