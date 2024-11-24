import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReviewSegments from "./reviewSegment";
import "@testing-library/jest-dom";
import { Collapse, Button } from "antd";
import ReviewSegmentsEditDelete from "./reviewSegmentsEditDelete";

jest.mock("./reviewSegmentsEditDelete", () => (props) => (
  <div>
    Mocked Segment ID: {props.segmentId}
    <button
      onClick={() =>
        props.onUpdateSegment(props.segmentId, { newData: "test" })
      }
    >
      Update
    </button>
    <button onClick={() => props.deleteSegment(props.segmentId)}>Delete</button>
  </div>
));

describe("ReviewSegments Component", () => {
  const mockSegmentsData = {
    1: [
      { segmentId: "101", data: "Data1" },
      { segmentId: "102", data: "Data2" },
    ],
    2: [{ segmentId: "201", data: "Data3" }],
  };

  const mockSetSegmentsData = jest.fn();

  beforeEach(() => {
    mockSetSegmentsData.mockClear();
  });

  test("renders segment data correctly", () => {
    render(
      <ReviewSegments
        segmentsData={mockSegmentsData}
        setSegmentsData={mockSetSegmentsData}
        disableEdit={false}
      />
    );

    expect(screen.getByText("File ID: 1")).toBeInTheDocument();
    expect(screen.getByText("Mocked Segment ID: 101")).toBeInTheDocument();
    expect(screen.getByText("Mocked Segment ID: 102")).toBeInTheDocument();
    expect(screen.getByText("File ID: 2")).toBeInTheDocument();
    expect(screen.getByText("Mocked Segment ID: 201")).toBeInTheDocument();
  });

  test("calls update function on 'Update All Segments' button click", () => {
    render(
      <ReviewSegments
        segmentsData={mockSegmentsData}
        setSegmentsData={mockSetSegmentsData}
        disableEdit={false}
      />
    );

    fireEvent.click(screen.getAllByText("Update")[0]);

    expect(mockSetSegmentsData).toHaveBeenCalledWith(expect.any(Function));
  });

  test("calls delete function correctly", () => {
    render(
      <ReviewSegments
        segmentsData={mockSegmentsData}
        setSegmentsData={mockSetSegmentsData}
        disableEdit={false}
      />
    );

    fireEvent.click(screen.getAllByText("Delete")[0]);

    expect(mockSetSegmentsData).toHaveBeenCalledWith(expect.any(Object));
  });

  test("disables editing when disableEdit is true", () => {
    render(
      <ReviewSegments
        segmentsData={mockSegmentsData}
        setSegmentsData={mockSetSegmentsData}
        disableEdit={true}
      />
    );

    expect(screen.queryByText("Update All Segments")).not.toBeInTheDocument();
  });
});
