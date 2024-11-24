import { Button, Steps, theme, Pagination, Space, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import "./progressTracker.css";
import VendorSelection from "../vendor_selection_drowpdown/VendorSelection";
import DataTable from "../table/DataTable";
import {
  DownloadOutlined,
  DownOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { steps } from "../utils/utils";
import ReviewSegments from "../Review_Segments/reviewSegment";
import { LiaFileExportSolid } from "react-icons/lia";
import { v4 as uuidv4 } from "uuid";
import Notification from "../notification/Notification";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

// MockData to show the files based on the vendors

const sampleData = {
  Acxiom: [
    {
      key: "1",
      fileid: "6786",
      name: "SlingMarketing_OTA_Target_BlueCombo_20191119.TXT",
      modified: "2024-06-04",
      downloaded: "2024-06-04",
      inboundRowCount: 126963,
      inboundAccountCount: 126963,
    },
    {
      key: "2",
      fileid: "6787",
      name: "SlingMarketing_OTA_Target_Orange_20191119.TXT",
      modified: "2024-06-05",
      downloaded: "2024-06-05",
      inboundRowCount: 54009,
      inboundAccountCount: 54009,
    },
    {
      key: "3",
      fileid: "6788",
      name: "SlingMarketing_Sports-ACC_control_20191119.TXT",
      modified: "2024-06-04",
      downloaded: "2024-06-04",
      inboundRowCount: 82028,
      inboundAccountCount: 82028,
    },
    {
      key: "4",
      fileid: "6789",
      name: "SlingMarketing_Lifestyle-BET_control_20191119.TXT",
      modified: "2024-06-05",
      downloaded: "2024-06-05",
      inboundRowCount: 75266,
      inboundAccountCount: 75266,
    },
    {
      key: "5",
      fileid: "6790",
      name: "SlingMarketing_Sports-ACC_target_20191119.TXT",
      modified: "2024-06-04",
      downloaded: "2024-06-04",
      inboundRowCount: 738268,
      inboundAccountCount: 73826,
    },
    // {
    //   key: "6",
    //   fileId: "67594",
    //   fileName: "File_Vendor1_002",
    //   dateModified: "2023-06-05",
    //   dateDownloaded: "2023-06-05",
    //   rowCount: 100,
    //   accountCount: 50,
    // },
  ],
  Dish: [
    {
      key: "1",
      fileid: "6798",
      name: "Lionsgate_RamboLastBlood_112019.txt",
      dateModified: "2023-06-06",
      dateDownloaded: "2023-06-06",
      rowCount: 555000,
      accountCount: 555000,
    },
    {
      key: "2",
      fileId: "6799",
      fileName: "Paramount_MobTown_112019.txt",
      dateModified: "2023-06-07",
      dateDownloaded: "2023-06-07",
      rowCount: 415000,
      accountCount: 415000,
    },
    // Add more sample rows for vendor2
  ],
  vendor3: [
    {
      key: "1",
      fileId: "6831",
      fileName: "DISHADTGT_Ford_20191122181804.txt.gz",
      dateModified: "2023-06-08",
      dateDownloaded: "2023-06-08",
      rowCount: 2747708,
      accountCount: 2747708,
    },
    {
      key: "2",
      fileId: "6832",
      fileName: "FDISHADTGT_Ford_Control_20191122181804.txt.gz",
      dateModified: "2023-06-09",
      dateDownloaded: "2023-06-09",
      rowCount: 286133,
      accountCount: 286133,
    },
  ],
};

const ProgressTracker = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(-1);
  const [showBtns, setShowBtns] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableRowSelection, setTableRowSelection] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [segmentsData, setSegmentsData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [transctionId, setNewtransctionId] = useState("");
  const [transctionmessage, setTransctionmessage] = useState("");
  const [showviewtransctionbtn, setshowViewtransctionbtn] = useState(true);

  const resetSearchInput = () => {
    searchInput.current = null;
  };
  const [initialData, setInitialData] = useState([]);
  const [disableEdit, setDisableEdit] = useState(false);

  // To show the files based on the vendor we are doing the API call

  useEffect(() => {
    // const fetchvendorFilesList = async (selectedVendor) => {
    //   const apiUrl = `https://kjhdfkjhfkjkj.com/dev/media-sales/api/vendorFiles?vendor=${selectedVendor}`;
    //   try {
    //     const response = await fetch(apiUrl, {
    //       method: "GET",
    //       headers: {
    //         Accept: "application/json",
    //         "x-correlation-id": uuidv4(),
    //         requesttype: "GetVendorFiles",
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch vendor list");
    //     }

    //     const result = await response.json();
    //     console.log("result", result);
    //     const updatedData = result.vendorFilesList.map((vendor, index) => {
    //       vendor["key"] = index + 1;
    //       return vendor;
    //     });
    //     setData(updatedData);
    //     setInitialData(updatedData);
    //     // setData(sampleData[selectedVendor])
    //   } catch (error) {
    //     // console.log(error)
    //     message.error(`Error fetching vendor list: ${error.message}`);
    //   } finally {
    //   }
    // };

    setTableRowSelection(true);
    setSelectedRowKeys([]);
    setSearchText("");
    setSearchedColumn("");
    resetSearchInput();
    if (searchInput.current) {
      searchInput.current.input.value = "";
    }

    setData(sampleData[selectedVendor]);
    // api call
    if (selectedVendor) {
      //fetchvendorFilesList(selectedVendor);
    }
  }, [selectedVendor]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Segment Next and Prev buttons
  const next = () => {
    if (selectedRowKeys.length > 0) {
      setCurrent(current + 0.5);
      const selectedRowsData = data.filter((each) => {
        return selectedRowKeys.includes(each.key);
      });
      setData(selectedRowsData);
      setTableRowSelection(false);
    }
  };
  const prev = () => {
    if (current === 0.5) {
      setCurrent(0);
      setData(initialData);
      setSelectedRowKeys([]);
      setSegmentsData([]);
    } else if (current === 1.5) {
      setCurrent(0.5);
    }
    setTableRowSelection(true);
  };

  const items = steps.map((item, index) => ({
    key: item.title,
    title: item.title,
    icon: (
      <div
        style={{
          width: "40px",
          height: "40px",
          lineHeight: "22px",
          borderRadius: "50%",
          backgroundColor: index <= current ? "#51515A" : "#f5f5f6",
          color: index <= current ? "#fff" : "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        {index + 1}
      </div>
    ),
  }));

  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  // const onShowSizeChange = (current, pageSize) => {
  //   console.log("pagination page change",current, pageSize);
  // };

  const handlePageChange = (page, size) => {
    console.log("pagination page change", page, size);
    setCurrentPage(page);
    setPageSize(size);
  };

  const goToNextPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
            border: "grey 1px solid",
          }}
        />
        <Space>
          <Button
            type="#DD2424"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
          <Button
            type="link"
            size="small"
            style={{ color: "#DD2424" }}
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (searchText === "") {
        value = "";
      }
      const fileIdMatches = record.fileid
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
      const fileNameMatches = record.name
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
      return fileIdMatches || fileNameMatches;
    },
    // record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => {
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      );
    },
  });

  // DataTable coloumns Name

  const columns = [
    {
      title: (
        <div>
          <span>File ID</span>
          <DownOutlined />
        </div>
      ),
      dataIndex: "fileid",

      key: "fleid",

      // sorter: (a, b) => a.fileId.localeCompare(b.fileId),
      width: 100,
      height: 40,
      render: (fileId) => (
        <p style={{ color: "red", fontWeight: 500 }}>{fileId}</p>
      ),
    },
    {
      title: (
        <>
          <span>File Name</span>
          <DownOutlined />
        </>
      ),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("fileName"),
      // sorter: (a, b) => a.fileName.localeCompare(b.fileName),
    },
    {
      title: "Date Modified",
      dataIndex: "modified",
      key: "modified",
      sorter: (a, b) => new Date(a.modified) - new Date(b.modified),
    },
    {
      title: "Date Downloaded",
      dataIndex: "downloaded",
      key: "downloaded",
      // sorter: (a, b) => new Date(a.dateDownloaded) - new Date(b.dateDownloaded),
    },
    {
      title: "Inbound Row Count",
      dataIndex: "inboundRowCount",
      key: "inboundRowCount",
      // sorter: (a, b) => a.rowCount - b.rowCount,
    },
    {
      title: "Inbound Account Count",
      dataIndex: "inboundAccountCount",
      key: "inboundAccountCount",
      // sorter: (a, b) => a.accountCount - b.accountCount,
    },
  ];

  //console.log("curr", current);
  // Transfer the data from one segment to another segment
  function transformData(inputData) {
    const files = [];
    for (const [fileId, segments] of Object.entries(inputData)) {
      const { fileName, inboundRowCount } = segments[0];
      const transformedSegments = segments.map((segment) => ({
        segmentId: segment.segmentId,
        fulfillmentType: segment.inventorySource,
        tagLabel: segment.tagLabel,
        politicalTag: segment.politicalTag,
        campaignYear: segment.campaignYear,
        activationStartDate: segment.startDate,
        activationEndDate: segment.endDate,
        quarter: segment.quarter,
        tagTypes: segment.tagType,
      }));
      files.push({
        fileid: parseInt(fileId),
        name: fileName,
        inboundRowCount: inboundRowCount,
        inboundAccountCount: inboundRowCount,
        segments: transformedSegments,
      });
    }

    return files;
  }

  // Save segment API call

  const saveSegmentsData = async () => {
    // console.log("segmentsData",segmentsData)
    const data = {};
    data["userId"] = "xyz@dish.com";
    data["vendor"] = selectedVendor;
    data["files"] = transformData(segmentsData);

    const apiUrl = "https://xyz.com/dev/media-sales/api/generateTags";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "x-correlation-id": uuidv4(),
          requesttype: "SubmitGenerateTagsRequest",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error while generating tags");
      }
      const result = await response.json();
      console.log("result", result);
      setNewtransctionId(result.transactionId);
      setTransctionmessage(result.message);
      setCurrent(2);
      setDisableEdit(true);
    } catch (error) {
      console.log(error);
      message.error(`Error while generating tags : ${error.message}`);
    } finally {
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Exporting as file
    XLSX.writeFile(workbook, "sample.xlsx");
  };

  const navigate = useNavigate();

  const handleViewTransactions = () => {
    navigate("/transactions");
  };

  return (
    <div className="table-conatiner">
      {current < 2 && (
        <div style={{ maxWidth: "626px", margin: "auto", marginTop: "10px" }}>
          <Steps current={current} items={items} labelPlacement="vertical" />
        </div>
      )}
      <div className="content-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          {(Object.keys(segmentsData).length === 0 ||
            (Object.keys(segmentsData).length > 0 && current === 0.5)) && (
            <div style={{ maxWidth: "289px", marginTop: "0px" }}>
              <VendorSelection
                setSelectedVendor={setSelectedVendor}
                setShowBtns={setShowBtns}
                setCurrent={setCurrent}
                setCurrentPage={setCurrentPage}
                setSearchText={setSearchText}
                resetSearchInput={resetSearchInput}
                setSearchedColumn={setSearchedColumn}
              />
            </div>
          )}

          {showBtns && showviewtransctionbtn && (
            <div style={{ marginLeft: "auto" }}>
              <Button
                onClick={handleViewTransactions}
                style={{
                  backgroundColor: "#DD2424",
                  color: "#fff",
                  borderColor: "#DD2424",
                }}
              >
                View Transactions
              </Button>
            </div>
          )}
        </div>

        {showBtns && (
          <div>
            {current !== 2 && (
              <div className="btns-container">
                <Pagination
                  showSizeChanger
                  onShowSizeChange={handlePageChange}
                  defaultCurrent={1}
                  total={sampleData[selectedVendor]?.length || 0}
                  onChange={handlePageChange}
                  current={currentPage}
                  pageSize={pageSize}
                />
                {current < 0.5 && (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      marginLeft: 5,
                      border: "1px solid black",
                    }}
                    icon={<LiaFileExportSolid />}
                    size={"middle"}
                    onClick={exportToExcel}
                  >
                    Export to Excel
                  </Button>
                )}
              </div>
            )}
            {(Object.keys(segmentsData).length === 0 ||
              (Object.keys(segmentsData).length > 0 && current === 0.5)) && (
              <div style={contentStyle}>
                <DataTable
                  columns={columns}
                  selectedVendor={selectedVendor}
                  data={data}
                  rowSelection={rowSelection}
                  selectedRowKeys={selectedRowKeys}
                  tableRowSelection={tableRowSelection}
                  segmentsData={segmentsData}
                  setSegmentsData={setSegmentsData}
                  current={current}
                />
              </div>
            )}

            {Object.keys(segmentsData).length > 0 && current === 1.5 && (
              <ReviewSegments
                segmentsData={segmentsData}
                setSegmentsData={setSegmentsData}
                disableEdit={disableEdit}
              />
            )}

            {Object.keys(segmentsData).length > 0 && current === 2 && (
              <div>
                <Notification
                  transactionId={transctionId}
                  transactionmessage={transctionmessage}
                  setshowViewtransctionbtn={setshowViewtransctionbtn}
                />
                <ReviewSegments
                  segmentsData={segmentsData}
                  disableEdit={disableEdit}
                />
              </div>
            )}

            {current !== 2 && (
              <div className="btns-container">
                <Pagination
                  showSizeChanger
                  onShowSizeChange={handlePageChange}
                  defaultCurrent={1}
                  total={sampleData[selectedVendor]?.length || 0}
                  onChange={handlePageChange}
                  current={currentPage}
                  pageSize={pageSize}
                />
              </div>
            )}
            <div className="btns-container">
              {current > 0 && current < 2 && (
                <Button className="cancel-btn" onClick={() => prev()}>
                  Cancel
                </Button>
              )}
              {/* {current === 2 && (
                <Button className="setup-tags-button">View Transactions</Button>
              )} */}
              {current === 0 && (
                <Button className="setup-tags-button" onClick={() => next()}>
                  SetUp Tags
                </Button>
              )}
              {current === 0.5 && (
                <Button
                  className="setup-tags-button"
                  onClick={() => {
                    if (Object.keys(segmentsData).length > 0) {
                      setCurrent(1.5);
                    }
                  }}
                >
                  Review Tags
                </Button>
              )}
              {current === 1.5 && (
                <Button
                  className="setup-tags-button"
                  onClick={() => {
                    //saveSegmentsData()
                    setNewtransctionId("transaction1");
                    setTransctionmessage("your data saved");
                    setCurrent(2);
                    setDisableEdit(true);
                  }}
                >
                  Generate Tags
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
