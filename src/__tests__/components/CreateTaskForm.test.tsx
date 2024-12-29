// Test suite for CreateTaskForm component that handles task creation functionality
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CreateTaskForm } from "@/components/create-task-form";
import { createTask } from "@/lib/api";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";

// Mock external dependencies to isolate component testing
jest.mock("@/lib/api");
jest.mock("next/navigation");

// Create a simplified mock of the Radix UI Select component for testing
// This replaces the complex UI component with a basic select element
jest.mock("@/components/ui/select", () => ({
	Select: ({ value, onValueChange, children }: any) => (
		<select
			value={value}
			onChange={(e) => onValueChange(e.target.value)}
			data-testid="status-select"
		>
			{children}
		</select>
	),
	// Additional mock components needed for the Select composition
	SelectContent: ({ children }: any) => children,
	SelectItem: ({ value, children }: any) => (
		<option value={value}>{children}</option>
	),
	SelectTrigger: () => null,
	SelectValue: () => null,
}));

describe("CreateTaskForm", () => {
	const user = userEvent.setup();

	// Reset mocks before each test to ensure clean state
	beforeEach(() => {
		(createTask as jest.Mock).mockClear();
		(useRouter as jest.Mock).mockReturnValue({ refresh: jest.fn() });
	});

	// Test form submission with valid data
	it("submits the form with correct data", async () => {
		render(<CreateTaskForm />);

		// Simulate user typing in form fields
		await user.type(screen.getByLabelText(/title/i), "New Task");
		await user.type(screen.getByLabelText(/description/i), "Task Description");
		await user.selectOptions(
			screen.getByTestId("status-select"),
			"in-progress"
		);
		await user.click(screen.getByRole("button", { name: /create task/i }));

		// Verify API call was made with correct data
		await waitFor(() => {
			expect(createTask).toHaveBeenCalledWith({
				title: "New Task",
				description: "Task Description",
				status: "in-progress",
			});
		});
	});

	// Test initial form state
	it("starts with empty fields", () => {
		render(<CreateTaskForm />);

		// Verify all fields start empty with default values
		expect(screen.getByLabelText(/title/i)).toHaveValue("");
		expect(screen.getByLabelText(/description/i)).toHaveValue("");
		expect(screen.getByTestId("status-select")).toHaveValue("todo");
	});

	// Test form reset after successful submission
	it("resets form after successful submission", async () => {
		const router = { refresh: jest.fn() };
		(useRouter as jest.Mock).mockReturnValue(router);

		render(<CreateTaskForm />);

		// Fill and submit form
		await user.type(screen.getByLabelText(/title/i), "New Task");
		await user.type(screen.getByLabelText(/description/i), "Task Description");
		await user.selectOptions(
			screen.getByTestId("status-select"),
			"in-progress"
		);
		await user.click(screen.getByRole("button", { name: /create task/i }));

		// Verify form resets and router refreshes
		await waitFor(() => {
			expect(screen.getByLabelText(/title/i)).toHaveValue("");
			expect(screen.getByLabelText(/description/i)).toHaveValue("");
			expect(screen.getByTestId("status-select")).toHaveValue("todo");
			expect(router.refresh).toHaveBeenCalled();
		});
	});
});
