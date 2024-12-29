import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { Task } from "@/lib/types"; // Import the Task type

// Mock for revalidatePath
jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

describe("Task API Functions", () => {
	// Clear mocks and setup fake timers before each test
	beforeEach(() => {
		jest.clearAllMocks();
		jest.useFakeTimers();
	});

	// Restore real timers after each test
	afterEach(() => {
		jest.useRealTimers();
	});

	describe("getTasks", () => {
		it("retrieves the initial task list correctly", async () => {
			// Start the getTasks operation
			const tasksPromise = getTasks();

			// Fast-forward past the 1-second delay
			jest.advanceTimersByTime(1000);

			// Now wait for the promise to resolve
			const tasks = await tasksPromise;

			expect(tasks).toHaveLength(2);
			expect(tasks[0]).toEqual({
				id: "1",
				title: "Learn Next.js",
				description: "Study Next.js documentation",
				status: "in-progress",
			});
		});
	});

	describe("createTask", () => {
		it("creates a new task successfully", async () => {
			// Properly type the new task
			const newTask: Omit<Task, "id"> = {
				title: "Nueva Tarea",
				description: "Descripción de prueba",
				status: "todo" as const, // Use 'as const' to satisfy TypeScript
			};

			// Start the create operation
			const createPromise = createTask(newTask);

			// Fast-forward past the delay
			jest.advanceTimersByTime(1000);

			// Wait for the creation to complete
			const createdTask = await createPromise;

			expect(createdTask).toEqual({
				...newTask,
				id: expect.any(String),
			});
		});
	});

	describe("updateTask", () => {
		it("updates an existing task", async () => {
			// Properly type the updates
			const updates: Partial<Task> = {
				title: "Título Actualizado",
				status: "completed" as const,
			};

			// Start the update operation
			const updatePromise = updateTask("1", updates);

			// Fast-forward past the delay
			jest.advanceTimersByTime(1000);

			// Wait for the update to complete
			const updatedTask = await updatePromise;

			expect(updatedTask).toEqual({
				id: "1",
				title: "Título Actualizado",
				description: expect.any(String),
				status: "completed",
			});
		});

		it("handles non-existent task error", async () => {
			// Start the update operation
			const updatePromise = updateTask("999", { title: "Test" });

			// Fast-forward past the delay
			jest.advanceTimersByTime(1000);

			// Verify the error is thrown
			await expect(updatePromise).rejects.toThrow("Task not found");
		});
	});

	describe("deleteTask", () => {
		it("deletes an existing task", async () => {
			// Start the delete operation
			const deletePromise = deleteTask("1");

			// Fast-forward past the delay
			jest.advanceTimersByTime(1000);

			// Wait for deletion to complete
			await deletePromise;

			// Start getting the updated task list
			const getTasksPromise = getTasks();

			// Fast-forward past the delay again
			jest.advanceTimersByTime(1000);

			// Wait for the task list
			const tasks = await getTasksPromise;

			const deletedTask = tasks.find((t) => t.id === "1");
			expect(deletedTask).toBeUndefined();
		});
	});
});
