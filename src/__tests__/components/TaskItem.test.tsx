// TaskItem Test Suite - Tests for individual task item component functionality
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskItem } from "@/components/task-item";
import { updateTask, deleteTask } from "@/lib/api";
import { useRouter } from "next/navigation";

// Mock external dependencies to isolate the component for testing
// This prevents actual API calls and router navigation during tests
jest.mock("@/lib/api");
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

// Create a mock task object to use across all tests
// The 'as const' ensures TypeScript treats status as a literal type
const mockTask = {
	id: "1",
	title: "Test Task",
	description: "Test Description",
	status: "todo" as const,
};

describe("TaskItem", () => {
	// Reset all mocks before each test to ensure clean state
	beforeEach(() => {
		(updateTask as jest.Mock).mockClear(); // Clear update task mock
		(deleteTask as jest.Mock).mockClear(); // Clear delete task mock
		(useRouter as jest.Mock).mockReturnValue({ refresh: jest.fn() }); // Mock router refresh function
	});

	// Test 1: Verify the task item displays all its information correctly
	it("renders task details correctly", () => {
		render(<TaskItem task={mockTask} />);
		// Check if all task details are visible in the document
		expect(screen.getByText("Test Task")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
		expect(screen.getByText("todo")).toBeInTheDocument();
	});

	// Test 2: Verify the task editing functionality
	it("allows editing of task", async () => {
		render(<TaskItem task={mockTask} />);

		// Simulate clicking the edit button to enter edit mode
		fireEvent.click(screen.getByRole("button", { name: /edit/i }));

		// Simulate user updating the task title
		fireEvent.change(screen.getByLabelText(/title/i), {
			target: { value: "Updated Task" },
		});

		// Simulate user updating the task description
		fireEvent.change(screen.getByLabelText(/description/i), {
			target: { value: "Updated Description" },
		});

		// Simulate opening the status dropdown
		fireEvent.click(screen.getByRole("combobox"));

		// Simulate selecting "In Progress" from the dropdown
		fireEvent.click(screen.getByRole("option", { name: /in progress/i }));

		// Simulate saving the changes
		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		// Verify the updateTask API was called with correct updated data
		await waitFor(() => {
			expect(updateTask).toHaveBeenCalledWith("1", {
				id: "1",
				title: "Updated Task",
				description: "Updated Description",
				status: "in-progress",
			});
		});
	});

	// Test 3: Verify the task deletion functionality
	it("allows deletion of task", async () => {
		render(<TaskItem task={mockTask} />);

		// Simulate clicking the delete button
		fireEvent.click(screen.getByRole("button", { name: /delete/i }));

		// Verify the deleteTask API was called with correct task ID
		await waitFor(() => {
			expect(deleteTask).toHaveBeenCalledWith("1");
		});
	});
});
