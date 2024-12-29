import { TaskSkeleton } from "./task-skeleton";

export function TaskListSkeleton() {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				<TaskSkeleton key={i} />
			))}
		</div>
	);
}
