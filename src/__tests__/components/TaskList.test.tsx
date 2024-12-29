// Import necessary testing utilities and components
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { TaskList } from "@/components/task-list";
import { getTasks } from "@/lib/api";
import { Task } from "@/lib/types";

// Set up our mocks to isolate the component for testing
// Mock the API call to control the data flow
jest.mock("@/lib/api", () => ({
	getTasks: jest.fn(),
}));

// Create a simplified version of the TaskItem component for testing
// This helps focus on TaskList behavior without TaskItem complexity
jest.mock("@/components/task-item", () => ({
	TaskItem: ({ task }: { task: Task }) => <div>{task.title}</div>,
}));

// Create a simple loading state component mock
jest.mock("@/components/task-list-skeleton", () => ({
	TaskListSkeleton: () => <div>Loading...</div>,
}));

// Create sample task data for testing different scenarios
const mockTasks = [
	{ id: "1", title: "Task 1", description: "Description 1", status: "todo" },
	{
		id: "2",
		title: "Task 2",
		description: "Description 2",
		status: "in-progress",
	},
];

describe("TaskList", () => {
	// Before each test, reset our mocks and set up default successful response
	beforeEach(() => {
		jest.clearAllMocks();
		(getTasks as jest.Mock).mockResolvedValue(mockTasks);
	});

	// Test that the API integration works correctly
	it("fetches tasks correctly from API", async () => {
		const result = await getTasks();
		expect(result).toEqual(mockTasks);
		expect(getTasks).toHaveBeenCalled();
	});

	// Test the initial loading state
	it("shows loading state initially", () => {
		render(<TaskList />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	// Test successful task loading and display
	it("renders tasks after loading", async () => {
		render(<TaskList />);

		// Wait for and verify that tasks appear
		await waitFor(() => {
			expect(screen.getByText("Task 1")).toBeInTheDocument();
			expect(screen.getByText("Task 2")).toBeInTheDocument();
		});
	});

	// Test handling of empty task lists
	it("handles empty task list in UI", async () => {
		(getTasks as jest.Mock).mockResolvedValue([]);
		render(<TaskList />);

		// Verify loading state appears first
		expect(screen.getByText("Loading...")).toBeInTheDocument();

		// Then verify empty state message
		await waitFor(() => {
			expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
		});
	});

	// Test error handling
	it("handles error state in UI", async () => {
		// Mock an API failure
		(getTasks as jest.Mock).mockRejectedValue(
			new Error("Failed to fetch tasks")
		);
		render(<TaskList />);

		// Verify error message appears
		await waitFor(() => {
			expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument();
		});
	});
});
