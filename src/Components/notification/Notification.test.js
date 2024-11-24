import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "./Notification";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Notification Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the notification alert with correct text and transaction ID", () => {
    render(
      <MemoryRouter>
        <Notification transactionId="Acxiom_6786_6787_November_04_2024_19:04:00" />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Successfully submitted request/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Your request for generating tags successfully submitted with transaction id : Acxiom_6786_6787_November_04_2024_19:04:00/
      )
    ).toBeInTheDocument();
  });

  test("closes the alert when the close button is clicked", () => {
    render(
      <MemoryRouter>
        <Notification transactionId="Acxiom_6786_6787_November_04_2024_19:04:00" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(
      screen.queryByText(/Successfully submitted request/i)
    ).not.toBeInTheDocument();
  });

  test("navigates to the transactions page when OK button is clicked", () => {
    render(
      <MemoryRouter>
        <Notification transactionId="Acxiom_6786_6787_November_04_2024_19:04:00" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /ok/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");
  });

  test("displays the message and description correctly", () => {
    render(
      <MemoryRouter>
        <Notification
          transactionId="Acxiom_6786_6787_November_04_2024_19:04:00"
          transactionmessage="Request has been accepted for processing"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Request has been accepted for processing/i)
    ).toBeInTheDocument();
  });
});
