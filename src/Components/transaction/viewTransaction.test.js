import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewTransaction from "./viewTransaction";
import { BrowserRouter as Router } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Collapse: ({ children }) => <div>{children}</div>,
  Pagination: ({ onChange }) => (
    <div data-testid="pagination" onClick={() => onChange(2)}></div>
  ),
}));

describe("ViewTransaction Component", () => {
  const sample = {
    6786: [
      {
        AttributeID: 1000003,
        AttributeCode: "Q320240F4243",
        AttributeName: "202024Q3-0F4243-CA Smart Tacoma-T",
        AttributeType: "Target Test",
        StartDate: "2024-11-04",
        EndDate: "2024-11-08",
        PoliticalCampaign: "False",
        count: {
          Destination: "freewheel_custom_attributes",
          attrcode: "40 accounts",
          Accounts: "410414",
        },
        FileInfo: {
          Vendor: "Acxiom",
          Filename: "SlingMarketing_OTA_Target_BlueCombo_20191119.TXT",
          Segment: "1000004",
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ViewTransaction component correctly", () => {
    render(
      <Router>
        <ViewTransaction />
      </Router>
    );

    expect(screen.getByText(/Campaign File Selection/)).toBeInTheDocument();

    expect(
      screen.getByText(/Go to Campaign File Selection/)
    ).toBeInTheDocument();

    const attributeInfo = screen.getByText(/ATTIBUTE INFO/);
    expect(attributeInfo).toBeInTheDocument();

    expect(screen.getByText(/Vendor: Acxiom/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Filename: SlingMarketing_OTA_Target_BlueCombo_20191119.TXT/
      )
    ).toBeInTheDocument();
  });

  test("handles Go to Campaign File Selection button click", async () => {
    const mockNavigate = jest.fn();
    render(
      <Router>
        <ViewTransaction />
      </Router>
    );

    const button = screen.getByText(/Go to Campaign File Selection/);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("tests pagination functionality", async () => {
    render(
      <Router>
        <ViewTransaction />
      </Router>
    );

    const paginationElement = screen.getByTestId("pagination");
    await act(async () => {
      fireEvent.click(paginationElement);
    });

    expect(screen.queryByText(/Page 2/)).toBeInTheDocument();
  });

  test("Collapse expand/collapse icon works correctly", async () => {
    render(
      <Router>
        <ViewTransaction />
      </Router>
    );

    const collapseIcon = screen.getByTestId("collapse-icon");

    fireEvent.click(collapseIcon);

    await waitFor(() => {
      expect(screen.getByText(/AttributeID : 1000003/)).toBeInTheDocument();
    });

    expect(collapseIcon).toHaveStyle({ transform: "rotate(90deg)" });
  });

  test("renders correctly with empty data", () => {
    const emptyData = {};

    render(
      <Router>
        <ViewTransaction />
      </Router>
    );

    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });
});
