// Import necessary testing utilities and components
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

// Mock Next.js router to control navigation in tests
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

// Mock the global fetch API to control server responses
global.fetch = jest.fn();

describe("LoginForm", () => {
	// Before each test, set up fresh mocks
	beforeEach(() => {
		// Set up router mock with navigation functions
		(useRouter as jest.Mock).mockReturnValue({
			push: jest.fn(), // For page navigation
			refresh: jest.fn(), // For refreshing the current page
		});
		// Clear any previous fetch calls

		(global.fetch as jest.Mock).mockClear();
	});

	// Test 1: Verify the form renders with all necessary elements
	it("renders the form correctly", () => {
		render(<LoginForm />);
		// Check for presence of email input
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		// Check for presence of password input
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		// Check for presence of login button
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
	});

	// Test 2: Verify successful form submission
	it("submits the form with correct data", async () => {
		// Mock a successful API response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ success: true }),
		});

		render(<LoginForm />);

		// Simulate user typing email
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		// Simulate user typing password
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		// Simulate clicking the login button
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		// Verify the API call was made with correct data
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "test@example.com",
					password: "password123",
				}),
			});
		});
	});

	// Test 3: Verify error handling for failed login
	it("displays error message on login failure", async () => {
		// Mock a failed API response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ error: "Invalid credentials" }),
		});

		render(<LoginForm />);

		// Fill in form with invalid credentials
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "wrongpassword" },
		});

		// Submit the form
		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		// Verify error message appears
		await waitFor(() => {
			expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
		});
	});
});
