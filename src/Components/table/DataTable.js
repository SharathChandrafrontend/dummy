import React, { useState } from "react";
import { Button, message, Table } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import TabWithPagination from "../segment/Segment";
import "./DataTable.css";

import { v4 as uuidv4 } from "uuid";

const DataTable = ({
  columns,
  data,
  rowSelection,
  selectedRowKeys,
  segmentsData,
  setSegmentsData,
  current,
  selectedVendor,
}) => {
  const [tabNames, setTabNames] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  // displaying the files API

  const fetchTabNames = async (fileId) => {
    console.log("Fetching tab names for fileId:", fileId);
    const apiUrl =
      "https://xyz.com/dev/media-sales/api/vendorFileSegments?fileid=" + fileId;
    try {
      // setVendorLoading(true);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-correlation-id": uuidv4(),
          requesttype: "GetVendorFileSegments",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vendor segments list");
      }
      const result = await response.json();
      //console.log("vendor segments",result.vendorFileSegmentsList)
      const tabIds = result.vendorFileSegmentsList.map((segment) =>
        segment.id.toString()
      );
      return tabIds;
    } catch (error) {
      //console.log(error)
      message.error(`Error fetching vendor segments list: ${error.message}`);
    } finally {
    }
  };

  const expandedRowRender = (record) => {
    return (
      <div>
        <TabWithPagination
          tabs={tabNames}
          record={record}
          segmentsData={segmentsData}
          setSegmentsData={setSegmentsData}
          selectedVendor={selectedVendor}
        />
      </div>
    );
  };

  const expandColumns = [
    ...columns,
    {
      render: (text, record) => (
        <Button
          className="setup-tag-btn"
          onClick={(e) =>
            handleExpand(!expandedRows.includes(record.key), record)
          }
        >
          {!expandedRows.includes(record.key) ? "Setup Tags" : "Edit Tags"}
        </Button>
      ),
    },
  ];
  // whilc clicking on the file we can see the segments

  const handleExpand = async (expanded, record) => {
    console.log("expamnd");
    if (expanded) {
      const fileId = record.fileid || record.id || record.someOtherField;
      if (!fileId) {
        console.error("No fileId found in record:", record);
        return;
      }

      const tabs = ["1000004", "1000005", "1000006"];
      setTabNames(tabs);
      setExpandedRows([record.key]);
    } else {
      setTabNames([]);
      setExpandedRows([]);
    }
  };

  return (
    <div className="table-container">
      {current === 0 && (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ marginTop: 20, padding: "10px" }}
        />
      )}
      {current === 0.5 && (
        <Table
          columns={expandColumns}
          dataSource={data}
          pagination={false}
          style={{ marginTop: 20, padding: "10px" }}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRows,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined onClick={(e) => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={(e) => onExpand(record, e)} />
              ),
            onExpand: handleExpand,
            rowExpandable: (record) => selectedRowKeys.includes(record.key),
          }}
        />
      )}
    </div>
  );
};

export default DataTable;
