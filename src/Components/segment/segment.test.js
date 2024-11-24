import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabWithPagination from "./Segment";
import { message } from "antd";
import { v4 as uuidv4 } from "uuid";

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Select: {
    Option: jest
      .fn()
      .mockImplementation(({ children }) => <div>{children}</div>),
  },
  DatePicker: jest.fn(),
  Pagination: jest.fn(),
  Button: jest.fn(),
  Radio: {
    Group: jest.fn(),
    Button: jest.fn(),
  },
  Form: {
    useForm: jest.fn().mockReturnValue([jest.fn()]),
  },
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("mock-uuid"),
}));

jest.mock("moment", () =>
  jest.fn().mockReturnValue({
    format: jest.fn().mockReturnValue("2023-11-08"),
    isAfter: jest.fn().mockReturnValue(false),
  })
);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        tagTypeList: [
          { tagType: "Target Test" },
          { tagType: "Non Target Test" },
        ],
        inventorySourceList: [
          { inventorySource: "Sling Addressable", fulfillmentType: "SA" },
        ],
      }),
  })
);

const mockTabs = ["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"];
const mockRecord = {
  fileid: "file-1",
  name: "Sample File",
  inboundRowCount: 100,
  inboundAccountCount: 200,
};

describe("TabWithPagination", () => {
  let setSegmentsData;

  beforeEach(() => {
    setSegmentsData = jest.fn();
    render(
      <TabWithPagination
        tabs={mockTabs}
        record={mockRecord}
        segmentsData={{}}
        setSegmentsData={setSegmentsData}
        selectedVendor="Vendor 1"
      />
    );
  });

  it("renders the correct number of tabs", () => {
    const tabLabels = screen.getAllByText(/Tab/);
    expect(tabLabels.length).toBe(4);
  });

  it("switches tabs when clicked", async () => {
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    const tabs = screen.getAllByText("Tab");
    fireEvent.click(tabs[1]);
    expect(tabs[1].textContent).toBe("Tab 2");
  });

  it("handles form data submission", async () => {
    fireEvent.change(screen.getByPlaceholderText("Type here..."), {
      target: { value: "Test Label" },
    });

    const saveButton = screen.getByText("Save Draft");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith("Draft saved successfully!");
    });
  });

  it("displays an error message when fields are empty and user tries to save draft", async () => {
    const saveButton = screen.getByText("Save Draft");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Please fill in the required fields before saving!"
      );
    });
  });

  it("displays the active household count", async () => {
    const activeHouseholdInput = screen.getByPlaceholderText("N/A");
    expect(activeHouseholdInput.value).toBe("1");
  });

  it("fetches inventory sources correctly", async () => {
    await waitFor(() => {
      const inventorySourceOptions = screen.getAllByText("Sling Addressable");
      expect(inventorySourceOptions.length).toBe(1);
    });
  });

  it("handles DatePicker changes", async () => {
    const startDatePicker = screen
      .getByLabelText(/Activation Range/i)
      .querySelector("input");
    fireEvent.change(startDatePicker, { target: { value: "2023-11-08" } });

    expect(startDatePicker.value).toBe("2023-11-08");
  });

  it("handles page change and updates active tab", async () => {
    const nextPageButton = screen.getByText("Next");
    fireEvent.click(nextPageButton);

    const tab = screen.getByText("Tab 5");
    fireEvent.click(tab);

    expect(setSegmentsData).toHaveBeenCalled();
  });
});
