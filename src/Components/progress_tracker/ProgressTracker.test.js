import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProgressTracker from "./ProgressTracker";
import "@testing-library/jest-dom";
import { message } from "antd";

// Mocking dependencies
jest.mock("uuid", () => ({ v4: () => "mock-uuid" }));
jest.mock("antd", () => {
  const originalAntd = jest.requireActual("antd");
  return {
    ...originalAntd,
    message: {
      error: jest.fn(),
    },
  };
});

global.fetch = jest.fn();

describe("ProgressTracker Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    message.error.mockClear();
  });

  test("initially renders without errors", () => {
    render(<ProgressTracker />);
    expect(screen.getByText(/Custom Tagging Interface/i)).toBeInTheDocument();
  });

  test("calls fetchVendorFilesList when a vendor is selected", async () => {
    const mockVendorFiles = {
      vendorFilesList: [
        { fileid: 1, name: "File1", inboundRowCount: 100 },
        { fileid: 2, name: "File2", inboundRowCount: 200 },
      ],
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVendorFiles,
    });

    render(<ProgressTracker />);
    fireEvent.click(screen.getByText("SetUp Tags"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText("File1")).toBeInTheDocument();
      expect(screen.getByText("File2")).toBeInTheDocument();
    });
  });

  test("displays error message if fetchVendorFilesList fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API is down"));

    render(<ProgressTracker />);
    fireEvent.click(screen.getByText("SetUp Tags"));

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith(
        "Error fetching vendor list: API is down"
      )
    );
  });

  test("navigates to Review Tags step", async () => {
    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("SetUp Tags"));
    await waitFor(() => screen.getByText("Review Tags"));

    fireEvent.click(screen.getByText("Review Tags"));
    expect(screen.getByText("Generate Tags")).toBeInTheDocument();
  });

  test("calls saveSegmentsData and displays success message on Generate Tags", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Tags generated successfully" }),
    });

    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("SetUp Tags"));
    await waitFor(() => screen.getByText("Review Tags"));

    fireEvent.click(screen.getByText("Review Tags"));
    fireEvent.click(screen.getByText("Generate Tags"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://lxzonaws.com/dev/mea-es/api/gerateTags",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(screen.getByText("View Transactions")).toBeInTheDocument();
    });
  });

  test("handles file export to Excel", () => {
    const writeFileSpy = jest.spyOn(XLSX, "writeFile").mockImplementation();
    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("Export to Excel"));
    expect(writeFileSpy).toHaveBeenCalled();
    writeFileSpy.mockRestore();
  });

  test("applies search filter and highlights matches", async () => {
    render(<ProgressTracker />);

    const searchInput = screen.getByPlaceholderText("Search fileid");
    fireEvent.change(searchInput, { target: { value: "File1" } });
    fireEvent.keyPress(searchInput, { key: "Enter", code: 13 });

    await waitFor(() => {
      expect(screen.getByText("File1")).toHaveClass("highlight");
    });
  });

  test("resets search filter when reset button is clicked", () => {
    render(<ProgressTracker />);

    const searchInput = screen.getByPlaceholderText("Search fileid");
    fireEvent.change(searchInput, { target: { value: "File1" } });
    fireEvent.click(screen.getByText("Reset"));

    expect(searchInput).toHaveValue("");
  });

  test("pagination controls current page", () => {
    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("2"));
    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  test("cancels progress and navigates back to previous step", () => {
    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("SetUp Tags"));
    fireEvent.click(screen.getByText("Review Tags"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText("SetUp Tags")).toBeInTheDocument();
  });

  test("renders ReviewSegments component at step 1.5", async () => {
    render(<ProgressTracker />);

    fireEvent.click(screen.getByText("SetUp Tags"));
    await waitFor(() => fireEvent.click(screen.getByText("Review Tags")));

    expect(screen.getByText("Review Tags")).toBeInTheDocument();
  });
});
