import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Button, Pagination } from "antd";
import ReviewSegmentsEditDelete from "./reviewSegmentsEditDelete";

const ReviewSegments = ({ segmentsData, disableEdit, setSegmentsData }) => {
  const [activeFileId, setActiveFileId] = useState(null);
  const [paginationState, setPaginationState] = useState({});

  const handleUpdate = (fileId, segmentId, updatedData) => {
    setSegmentsData((prevData) => {
      const updatedFileData = prevData[fileId].map((segment) =>
        segment.segmentId === segmentId
          ? { ...segment, ...updatedData }
          : segment
      );
      return { ...prevData, [fileId]: updatedFileData };
    });
  };

  const deleteSegment = (fileId, segmentId) => {
    const updatedData = segmentsData[fileId].filter(
      (segment) => segment.segmentId !== segmentId
    );
    const newSegmentsData = { ...segmentsData };
    if (updatedData.length === 0) {
      delete newSegmentsData[fileId];
    } else {
      newSegmentsData[fileId] = updatedData;
    }
    setSegmentsData(newSegmentsData);
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{
        margin: "0 auto",
        maxWidth: "1200px",
      }}
    >
      {Object.keys(segmentsData).map((fileId, index) => (
        <Collapse.Panel
          key={String(index + 1)}
          header={`File ID: ${fileId}`}
          extra={
            activeFileId === fileId && (
              <Button type="primary" onClick={() => handleUpdate(fileId)}>
                Update All Segments
              </Button>
            )
          }
          style={{
            marginBottom: 10,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",

              gap: "10px",
              marginBottom: "10px",
       
            }}
          >
            {segmentsData[fileId]
              .slice(
                (paginationState[fileId] - 1 || 0) * 4,
                (paginationState[fileId] || 1) * 4
              )
              .map((segment, idx) => (
                <ReviewSegmentsEditDelete
                  key={segment.segmentId}
                  data={segment}
                  index={idx}
                  segmentId={segment.segmentId}
                  activeFileId={activeFileId}
                  setActiveFileId={setActiveFileId}
                  onUpdateSegment={(segmentId, updatedData) =>
                    handleUpdate(fileId, segmentId, updatedData)
                  }
                  deleteSegment={() => deleteSegment(fileId, segment.segmentId)}
                  disableEdit={disableEdit}
                />
              ))}
          </div>
          {/* Pagination positioned directly below each file's segments */}
          <Pagination
            current={paginationState[fileId] || 1}
            pageSize={4}
            total={segmentsData[fileId].length}
            onChange={(page) =>
              setPaginationState((prevState) => ({
                ...prevState,
                [fileId]: page,
              }))
            }
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </Collapse.Panel>
      ))}
      {/* Media Queries */}
      <style jsx>{`
        @media (min-width: 1200px) {
          .ant-collapse {
            max-width: 100%;
          }
          .ant-collapse-item {
            padding: 15px;
            font-size: 16px;
          }
        }
        @media (min-width: 992px) and (max-width: 1199px) {
          .ant-collapse {
            max-width: 100%;
            padding: 12px;
          }
          .ant-collapse-item {
            padding: 12px;
            font-size: 15px;
          }
        }
        @media (min-width: 768px) and (max-width: 991px) {
          .ant-collapse {
            max-width: 100%;
            padding: 10px;
          }
          .ant-collapse-item {
            padding: 10px;
            font-size: 14px;
          }
        }
        @media (max-width: 767px) {
          .ant-collapse {
            width: 100%;
            padding: 8px;
          }
          .ant-collapse-item {
            padding: 8px;
            font-size: 13px;
          }
          .ant-pagination {
            margin-top: 5px;
          }
        }
      `}</style>
    </Collapse>
  );
};

export default ReviewSegments;
