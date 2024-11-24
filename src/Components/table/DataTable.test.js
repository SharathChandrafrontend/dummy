// DataTable.test.js

import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DataTable from "./DataTable";
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Sample props for DataTable
const columns = [
  { title: "Column 1", dataIndex: "column1", key: "column1" },
  { title: "Column 2", dataIndex: "column2", key: "column2" },
];
const data = [
  { key: 1, column1: "Row 1 Col 1", column2: "Row 1 Col 2" },
  { key: 2, column1: "Row 2 Col 1", column2: "Row 2 Col 2" },
];
const rowSelection = {
  selectedRowKeys: [],
  onChange: jest.fn(),
};
const selectedRowKeys = [1];
const segmentsData = {};
const setSegmentsData = jest.fn();

describe("DataTable Component", () => {
  test("renders DataTable with columns and data", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        selectedRowKeys={selectedRowKeys}
        segmentsData={segmentsData}
        setSegmentsData={setSegmentsData}
        current={0}
      />
    );

    // Check that column titles are in the document
    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();

    // Check that data rows are rendered
    expect(screen.getByText("Row 1 Col 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2 Col 2")).toBeInTheDocument();
  });

  test("renders setup button in expandable row", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        selectedRowKeys={selectedRowKeys}
        segmentsData={segmentsData}
        setSegmentsData={setSegmentsData}
        current={0.5}
      />
    );

    const setupButton = screen.getByText("Setup Tags");
    expect(setupButton).toBeInTheDocument();
    fireEvent.click(setupButton);

    // After clicking, check that the button toggles
    expect(screen.getByText("Edit Tags")).toBeInTheDocument();
  });

  test("expands row and renders TabWithPagination component", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        selectedRowKeys={selectedRowKeys}
        segmentsData={segmentsData}
        setSegmentsData={setSegmentsData}
        current={0.5}
      />
    );

    const expandIcon = screen.getByRole("button", { name: /setup tags/i });
    fireEvent.click(expandIcon);

    // Verify that tab names are loaded (mocked tab names)
    expect(screen.getByText("Edit Tags")).toBeInTheDocument();
  });

  test("handles row selection correctly", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        selectedRowKeys={selectedRowKeys}
        segmentsData={segmentsData}
        setSegmentsData={setSegmentsData}
        current={0}
      />
    );

    // Simulate row selection by checking a row
    const rowCheckbox = screen.getByRole("checkbox", { name: "Row 1 Col 1" });
    fireEvent.click(rowCheckbox);

    expect(rowSelection.onChange).toHaveBeenCalled();
  });
});
