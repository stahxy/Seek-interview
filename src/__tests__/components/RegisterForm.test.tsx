// RegisterForm tests - This suite tests the user registration functionality
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "@/components/register-form";
import { useRouter } from "next/navigation";

// Mock Next.js router to avoid actual navigation during tests
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

// Mock the global fetch API to control API responses
global.fetch = jest.fn();

describe("RegisterForm", () => {
	// Before each test, reset our mocks to ensure clean state
	beforeEach(() => {
		// Set up router mock with necessary functions
		(useRouter as jest.Mock).mockReturnValue({
			push: jest.fn(), // For navigation
			refresh: jest.fn(), // For page refreshes
		});
		(global.fetch as jest.Mock).mockClear(); // Clear fetch mock calls
	});

	// Test 1: Verify the form renders with all necessary elements
	it("renders the form correctly", () => {
		render(<RegisterForm />);
		// Check for presence of key form elements
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /register/i })
		).toBeInTheDocument();
	});

	// Test 2: Verify successful form submission
	it("submits the form with correct data", async () => {
		// Mock a successful API response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ success: true }),
		});

		render(<RegisterForm />);

		// Simulate user input
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		// Simulate form submission
		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		// Verify API call was made with correct data
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "test@example.com",
					password: "password123",
				}),
			});
		});
	});

	// Test 3: Verify error handling for registration failures
	it("displays error message on registration failure", async () => {
		// Mock an API error response
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve({ error: "User already exists" }),
		});

		render(<RegisterForm />);

		// Simulate form submission with existing user
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "existing@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		// Verify error message appears
		await waitFor(() => {
			expect(screen.getByText("User already exists")).toBeInTheDocument();
		});
	});
});
