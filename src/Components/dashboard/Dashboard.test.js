import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
import Header from "../header/Header";
import ProgressTracker from "../progress_tracker/ProgressTracker";
import "@testing-library/jest-dom";

// Mock child components
jest.mock("../header/Header", () => () => <div>Mocked Header Component</div>);
jest.mock("../progress_tracker/ProgressTracker", () => () => (
  <div>Mocked Progress Tracker Component</div>
));

describe("Dashboard Component", () => {
  test("renders the Header component", () => {
    render(<Dashboard />);

    expect(screen.getByText("Mocked Header Component")).toBeInTheDocument();
  });

  test("renders the ProgressTracker component", () => {
    render(<Dashboard />);

    expect(
      screen.getByText("Mocked Progress Tracker Component")
    ).toBeInTheDocument();
  });
});
