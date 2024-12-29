"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { updateTask, deleteTask } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const statusColors = {
	todo: "bg-yellow-200 text-yellow-800",
	"in-progress": "bg-blue-200 text-blue-800",
	completed: "bg-green-200 text-green-800",
};

export function TaskItem({ task: initialTask }: { task: Task }) {
	const [task, setTask] = useState(initialTask);
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();

	const handleUpdate = async () => {
		await updateTask(task.id, task);
		setIsEditing(false);
		router.refresh();
	};

	const handleDelete = async () => {
		await deleteTask(task.id);
		router.refresh();
	};

	if (isEditing) {
		return (
			<Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
				<CardContent className="pt-6">
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={task.title}
								onChange={(e) => setTask({ ...task, title: e.target.value })}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								value={task.description}
								onChange={(e) =>
									setTask({ ...task, description: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={task.status}
								onValueChange={(value) =>
									setTask({ ...task, status: value as Task["status"] })
								}
							>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todo">To Do</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-end space-x-2">
					<Button
						onClick={handleUpdate}
						size="sm"
						className="flex items-center"
					>
						<Check className="mr-2 h-4 w-4" /> Save
					</Button>
					<Button
						onClick={() => setIsEditing(false)}
						variant="outline"
						size="sm"
						className="flex items-center"
					>
						<X className="mr-2 h-4 w-4" /> Cancel
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
			<CardContent className="pt-6">
				<div className="flex justify-between items-start mb-4">
					<h3 className="text-lg font-semibold">{task.title}</h3>
					<Badge className={`${statusColors[task.status]} capitalize`}>
						{task.status}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground mb-4">{task.description}</p>
			</CardContent>
			<CardFooter className="flex justify-end space-x-2">
				<Button
					onClick={() => setIsEditing(true)}
					variant="outline"
					size="sm"
					className="flex items-center"
				>
					<Pencil className="mr-2 h-4 w-4" /> Edit
				</Button>
				<Button
					onClick={handleDelete}
					variant="destructive"
					size="sm"
					className="flex items-center"
				>
					<Trash2 className="mr-2 h-4 w-4" /> Delete
				</Button>
			</CardFooter>
		</Card>
	);
}
