import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Pagination } from "antd";
import Header from "../header/Header";
import "../transaction/Transactions.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    {
      AttributeID: 1000004,
      AttributeCode: "Q320240F4244",
      AttributeName: "202024Q3-0F4244-CA Smart Tacoma-N",
      AttributeType: "Non Target Test",
      StartDate: "2024-11-04",
      EndDate: "2024-11-08",
      PoliticalCampaign: "False",
      count: {
        Destination: "freewheel_custom_attributes",
        attrcode: "20 accounts",
        Accounts: "410414",
      },
      FileInfo: {
        Vendor: "Acxiom",
        Filename: "SlingMarketing_OTA_Target_BlueCombo_20191119.TXT",
        Segment: "1000004",
      },
    },
  ],
  6787: [
    {
      AttributeID: 35422,
      AttributeCode: "Z12300A85E",
      AttributeName: "2024Q2-003R5E-Sling_GSK_Q2Q4_1381988-T",
      AttributeType: "Target",
      StartDate: "2024-11-04",
      EndDate: "2024-07-13",
      PoliticalCampaign: false,
      count: {
        Destination: "freewheel_custom_attributes",
        AttributeCode: "Q22400A85E",
        Accounts: "410414",
      },
      FileInfo: {
        Vendor: "Acxiom",
        Filename: "SlingMarketing_OTA_Target_Orange_20191119.TXT",
        Segment: "1000004",
      },
    },
  ],
};

const ViewTransaction = () => {
  const [paginationState, setPaginationState] = useState({});
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      <div className="content-container">
        <Header />
      </div>

      <div className="content-container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px",
          }}
        >
          <button
            style={{
              color: "#fff",
              backgroundColor: "#DD2424",
              borderRadius: "20px",
              padding: "10px",
              borderColor: "#DD2424",
              borderWidth: "1px",
              borderStyle: "solid",
              cursor: "pointer",
            }}
            onClick={handleNavigate}
          >
            Go to Campaign File Selection
          </button>
        </div>

        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          {Object.keys(sample).map((fileId, index) => (
            <Collapse.Panel
              key={String(index + 1)}
              header={`File ID: ${fileId}`}
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
                  flexWrap: "wrap",
                  gap: "10px",
                  overflowX: "auto",
                }}
              >
                {sample[fileId]
                  .slice(
                    (paginationState[fileId] - 1 || 0) * 4,
                    (paginationState[fileId] || 1) * 4
                  )
                  .map((each, idx) => (
                    <div
                      key={each.AttributeID}
                      style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        width: "350px",
                        marginBottom: "10px",
                      }}
                    >
                      <p style={{ fontWeight: "700" }}>ATTRIBUTE INFO</p>
                      <p>AttributeID : {each.AttributeID}</p>
                      <p>AttributeCode: {each.AttributeCode}</p>
                      <p>AttributeName : {each.AttributeName}</p>
                      <p>AttributeType: {each.AttributeType}</p>
                      <p>StartDate: {each.StartDate}</p>
                      <p>EndDate: {each.EndDate}</p>
                      <p>PoliticalCampaign: {each.PoliticalCampaign}</p>
                      <p style={{ fontWeight: "700" }}>Counts</p>
                      <p>
                        {each.count.attrcode}: {each.count.Accounts}
                      </p>
                      <p style={{ fontWeight: "700" }}>File Info</p>
                      <p>Vendor: {each.FileInfo.Vendor}</p>
                      <p>Filename: {each.FileInfo.Filename}</p>
                      <p>Segment: {each.FileInfo.Segment}</p>
                    </div>
                  ))}
              </div>
              <Pagination
                current={paginationState[fileId] || 1}
                pageSize={4}
                total={sample[fileId].length}
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
        </Collapse>

        <style jsx>{`
          /* Large desktop */
          @media (min-width: 1200px) {
            .content-container {
              max-width: 100%;
            }
            .ant-collapse-item {
              padding: 15px;
              font-size: 16px;
            }
          }

          /* Desktop */
          @media (min-width: 992px) and (max-width: 1199px) {
            .content-container {
              max-width: 100%;
              padding: 12px;
            }
            .ant-collapse-item {
              padding: 12px;
              font-size: 15px;
            }
          }

          /* Tablet */
          @media (min-width: 768px) and (max-width: 991px) {
            .content-container {
              max-width: 100%;
              padding: 10px;
            }
            .ant-collapse-item {
              padding: 10px;
              font-size: 14px;
            }
          }

          /* Mobile */
          @media (max-width: 767px) {
            .content-container {
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
      </div>
    </>
  );
};

export default ViewTransaction;
