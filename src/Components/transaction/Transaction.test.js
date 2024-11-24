import React from "react";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Transactions from "./Transactions";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children }) => children,
}));

// jest.mock("fetch");

describe("Transactions Component", () => {
  const mockData = [
    {
      key: "1",
      transactionId: "Sling_67560_67562_67594_October-06-2024-13:03:02",
      vendor: "Sling",
      dateGenerated: "10-10-2024",
      timeStamp: "13:03:02",
      transactionStatus: "View transaction status",
    },
    {
      key: "2",
      transactionId: "Sling_67564_67566_October-06-2024-17:53:02",
      vendor: "Sling",
      dateGenerated: "10-10-2024",
      timeStamp: "17:53:02",
      transactionStatus: "View transaction status",
    },
  ];

  //   beforeEach(() => {
  //     fetch.mockResolvedValue({
  //       data: mockData,
  //     });
  //   });

  test("renders the Transactions component", async () => {
    render(
      <Router>
        <Transactions />
      </Router>
    );

    const transactionId = await screen.findByText(
      /Sling_67560_67562_67594_October-06-2024-13:03:02/
    );
    expect(transactionId).toBeInTheDocument();

    const vendor = screen.getByText(/Sling/);
    expect(vendor).toBeInTheDocument();

    const dateGenerated = screen.getByText(/10-10-2024/);
    expect(dateGenerated).toBeInTheDocument();

    const timeStamp = screen.getByText(/13:03:02/);
    expect(timeStamp).toBeInTheDocument();
  });

  test("clicking on 'View transaction status' button navigates correctly", async () => {
    render(
      <Router>
        <Transactions />
      </Router>
    );

    const viewButton = screen.getByRole("button", {
      name: /View transaction status/,
    });

    fireEvent.click(viewButton);

    expect(window.location.href).toContain("viewTransaction");
  });

  test("renders the table with correct data", () => {
    render(
      <Router>
        <Transactions />
      </Router>
    );

    expect(
      screen.getByText("Sling_67560_67562_67594_October-06-2024-13:03:02")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sling_67564_67566_October-06-2024-17:53:02")
    ).toBeInTheDocument();
  });

  test("correct button color based on transaction status", async () => {
    render(
      <Router>
        <Transactions />
      </Router>
    );

    const statusButton = screen.getByRole("button", {
      name: /View transaction status/,
    });

    expect(statusButton).toHaveStyle({
      backgroundColor: "#DD2424",
    });
  });

  test("displays error message when the API call fails", async () => {
    // fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <Router>
        <Transactions />
      </Router>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Error fetching vendor list: Failed to fetch")
      ).toBeInTheDocument();
    });
  });

  test("renders empty state when no transaction data is available", async () => {
    // fetch.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <Transactions />
      </Router>
    );

    const noDataText = await screen.findByText(/No transactions available/);
    expect(noDataText).toBeInTheDocument();
  });
});
