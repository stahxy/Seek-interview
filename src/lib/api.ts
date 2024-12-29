"use server";

import { revalidatePath } from "next/cache";
import { Task } from "./types";

let tasks: Task[] = [
	{
		id: "1",
		title: "Learn Next.js",
		description: "Study Next.js documentation",
		status: "in-progress",
	},
	{
		id: "2",
		title: "Build a project",
		description: "Create a task management app",
		status: "todo",
	},
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTasks(): Promise<Task[]> {
	await delay(1000);
	return tasks;
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
	await delay(1000);
	console.log("task", task);
	const newTask: Task = { ...task, id: Date.now().toString() };
	tasks.push(newTask);
	revalidatePath("/");
	return newTask;
}

export async function updateTask(
	id: string,
	updates: Partial<Task>
): Promise<Task> {
	await delay(1000);
	const taskIndex = tasks.findIndex((task) => task.id === id);
	if (taskIndex === -1) throw new Error("Task not found");
	tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
	revalidatePath("/");
	return tasks[taskIndex];
}

export async function deleteTask(id: string): Promise<void> {
	await delay(1000);
	tasks = tasks.filter((task) => task.id !== id);
	revalidatePath("/");
}
