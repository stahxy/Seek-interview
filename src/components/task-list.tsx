import { Suspense } from "react";
import { TaskListContent } from "./tast-list-content";
import { TaskListSkeleton } from "./task-list-skeleton";

export function TaskList() {
	return (
		<Suspense fallback={<TaskListSkeleton />}>
			<TaskListContent />
		</Suspense>
	);
}
