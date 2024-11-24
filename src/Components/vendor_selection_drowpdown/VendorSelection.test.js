import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import VendorSelection from "./VendorSelection";
import "@testing-library/jest-dom";
import { message } from "antd";

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

const mockProps = {
  setSelectedVendor: jest.fn(),
  setShowBtns: jest.fn(),
  setCurrent: jest.fn(),
  setCurrentPage: jest.fn(),
  setSearchText: jest.fn(),
  resetSearchInput: jest.fn(),
  setSearchedColumn: jest.fn(),
};

describe("VendorSelection Component", () => {
  beforeEach(() => {
    fetch.mockClear();
    mockProps.setSelectedVendor.mockClear();
    mockProps.setShowBtns.mockClear();
  });

  test("fetches vendor list and populates options", async () => {
    const mockVendorList = { vendorList: ["Vendor1", "Vendor2", "Vendor3"] };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVendorList,
    });

    render(<VendorSelection {...mockProps} />);

    // Trigger dropdown open
    fireEvent.mouseDown(screen.getByRole("combobox"));

    await waitFor(() => {
      // Check if options are rendered by searching for each vendor's text
      expect(screen.getAllByText("Vendor1")[0]).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("Vendor2")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByText("Vendor3")).toBeInTheDocument();
    });
  });

  test("shows error message if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API is down"));

    render(<VendorSelection {...mockProps} />);

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith(
        "Error fetching vendor list: API is down"
      )
    );
  });
});
