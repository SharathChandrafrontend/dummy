import React, { useState, useEffect } from "react";
import {
  Tabs,
  Pagination,
  DatePicker,
  Input,
  Select,
  Radio,
  Button,
  message,
  Form,
} from "antd";
import moment from "moment";
import "./Segment.css";
import { v4 as uuidv4, validate } from "uuid";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const TabWithPagination = ({
  tabs,
  record,
  segmentsData,
  setSegmentsData,
  selectedVendor,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("0");
  const [savedTabs, setSavedTabs] = useState([]);

  const tabsPerPage = 4;
  const totalTabs = tabs.length;
  const dateFormat = "YYYY-MM-DD";
  const dateFormatYear = "YYYY";
  const [form] = Form.useForm();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [campaignYear, setCampaignYear] = useState(null);
  const [currentQuarter, setCurrentQuarter] = useState(null);
  const [tagType, setTagType] = useState([]);
  const [inventorySource, setInventorySource] = useState(null);
  const [tagLabel, setTagLabel] = useState("");
  const [politicalTag, setPoliticalTag] = useState("No");

  const [tagTypeOptions, setTagTypeOptions] = useState([]);
  const [inventorySourceOptions, setInventorySourceOptions] = useState([]);
  const [savedSegments, setSavedSegments] = useState({});
  const [currentTabName, setCurrentTabName] = useState("");
  const [activeHouseholdCount, setActiveHouseholdCount] = useState(null);
  const [inventorySourceChanged, setInventorySourceChanged] = useState(false);

  useEffect(() => {
    if (activeTab !== null) {
      const initialTabName = tabs[activeTab];
      setCurrentTabName(initialTabName);
    }
  }, [activeTab]);
  console.log("record", currentTabName);

  // fetch tag types API
  const fetchTagTypes = async () => {
    const apiUrl = "https://xyz.com/dev/media-sales/api/tagTypes";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-correlation-id": uuidv4(),
          requesttype: "GetTagTypes",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tag types");
      }
      const result = await response.json();
      // console.log("tag types",result.tagTypeList)
      const options = result.tagTypeList.map((tag) => ({
        name: tag.tagType,
        id: tag.tagType,
      }));
      setTagTypeOptions(options);
    } catch (error) {
      console.log(error);
      message.error(`Error fetching tag types : ${error.message}`);
    } finally {
    }
  };
  // Inventory source API
  const fetchInventorySources = async () => {
    // try {
    //   const response = await fetch(
    //     "https://xyz.com/dev/media-sales/api/inventorySources",
    //     {
    //       "Accept": "application/json",
    //       "x-correlation-id": uuidv4(),
    //       "requesttype": "GetInventorySources",
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error("Failed to fetch tagtypes list");
    //   }
    //   const result = await response.json();
    //   console.log("tag types",result);

    //   setInventorySourceOptions(
    //     response.data.inventorySourceList.map(
    //       (inventory) => inventory.inventorySource
    //     )
    //   );
    // } catch (error) {
    //   console.error("Failed to fetch inventory sources:", error);
    // }
    const apiUrl = "https://xyz.com/dev/media-sales/api/inventorySources";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-correlation-id": uuidv4(),
          requesttype: "GetInventorySources",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inventory sources");
      }
      const result = await response.json();
      // console.log("inventory sources",result)
      const options = result.inventorySourceList.map((inventory) => ({
        name: inventory.inventorySource,
        id: inventory.fulfillmentType,
      }));
      setInventorySourceOptions(options);
    } catch (error) {
      console.log(error);
      message.error(`Error fetching inventory sources : ${error.message}`);
    } finally {
    }
  };

  // housebound count API

  // const handleinventorysource = async (value) => {
  //   const apiUrl = `https://xyz.com/dev/media-sales/api/activeHouseholdCount?fulfillmentType=${value}&vendor=${selectedVendor}&fileid=${record.fileid}&segmentid=${currentTabName}`;
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "x-correlation-id": uuidv4(),
  //         requesttype: "GetActiveHouseholdCount",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch inventory sources");
  //     }
  //     const result = await response.json();
  //     // console.log("inventory sources",result)
  //     const options = result.inventorySourceList.map((inventory) => ({
  //       name: inventory.inventorySource,
  //       id: inventory.fulfillmentType,
  //     }));
  //     setInventorySourceOptions(options);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(`Error fetching inventory sources : ${error.message}`);
  //   } finally {
  //   }
  // };

  useEffect(() => {
    //fetchTagTypes();
    const tagOptions = [
      { name: "Target Test", id: "Target Test" },
      { name: "Non Target Test", id: "Non Target Test" },
    ];
    const inventoryOptions = [
      { name: "Sling Addressable", id: "SA" },
      { name: "Sling ", id: "Sk" },
    ];
    setInventorySourceOptions(inventoryOptions);
    setTagTypeOptions(tagOptions);
    //fetchInventorySources();
  }, []);

  const disabledStartDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const disabledEndDate = (current) => {
    return (
      current &&
      (current < moment().startOf("day") ||
        (startDate && current < moment(startDate)))
    );
  };

  const disabledYear = (current) => {
    return current && current.year() < moment().year();
  };

  const calculateQuarter = (date) => {
    const month = moment(date).month() + 1;
    if (month >= 1 && month <= 3) return "1";
    if (month >= 4 && month <= 6) return "2";
    if (month >= 7 && month <= 9) return "3";
    return "4";
  };

  useEffect(() => {
    const systemDateQuarter = calculateQuarter(moment());
    setCurrentQuarter(systemDateQuarter);
  }, []);

  const handleCampaignYearChange = (date) => {
    const formattedYear = date ? date.year().toString() : null;
    setCampaignYear(formattedYear);
  };

  const handleStartDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setStartDate(formattedDate);
    form.setFieldsValue({ startDate: formattedDate });

    if (date && endDate && moment(date).isAfter(moment(endDate))) {
      setEndDate(null);
      form.setFieldsValue({ endDate: null });
    }
  };

  const handleEndDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setEndDate(formattedDate);
    form.setFieldsValue({ endDate: formattedDate });
    form.validateFields(["endDate", "activationRange"]);
  };

  const saveTabData = () => {
    form
      .validateFields()
      .then(() => {
        const data = {
          activeTab: String(activeTab),
          startDate,
          endDate,
          tagType,
          inventorySource,
          tagLabel,
          politicalTag,
          segmentId: tabs[activeTab],
          fileName: record.name,
          inboundRowCount: record.inboundRowCount,
          outBoundRowCount: record.inboundAccountCount,
          campaignYear,
          quarter: currentQuarter,
          activeHouseholdCount: activeHouseholdCount,
        };

        setSegmentsData((prevState) => {
          const updatedSegments = prevState[record.fileid]
            ? prevState[record.fileid]
            : [];
          const dataPresent = updatedSegments.filter(
            (each) => each.activeTab === String(activeTab)
          );
          if (dataPresent.length === 0) {
            updatedSegments.push(data);
          }
          return {
            ...prevState,
            [record.fileid]: updatedSegments,
          };
        });
        setSavedSegments((prevSavedSegments) => ({
          ...prevSavedSegments,
          [activeTab]: true,
        }));
        console.log("segments data", segmentsData);

        // message.success("Draft saved successfully!");
      })
      .catch(() => {
        message.error("Please fill in the required fields before saving!");
      });
  };

  // const loadTabData = (tabIndex) => {
  //   console.log("tabIndex", tabIndex);
  //   const data = segmentsData[record.fileid]?.find(
  //     (segment) => segment.activeTab === String(tabIndex)
  //   );
  //   console.log("data", data);
  //   if (data) {
  //     setStartDate(data.startDate || null);
  //     setEndDate(data.endDate || null);
  //     setTagType(data.tagType || null);
  //     setInventorySource(null);
  //     setTagLabel(data.tagLabel || "");
  //     setPoliticalTag(data.politicalTag || "no");
  //   }
  // };

  // const handleTabChange = (key) => {
  //   // Validate and save current tab data before switching tabs
  //   form
  //     .validateFields()
  //     .then(() => {
  //       saveTabData();
  //       loadTabData(key);
  //       setActiveTab(key);
  //       setInventorySource(null); // Reset inventory source when switching tabs

  //       setInventorySourceChanged(false); // Reset on tab change

  //       const tabName = tabs[key]; // Assuming `tabs` is an array of strings
  //       setCurrentTabName(tabName);
  //     })
  //     .catch(() => {
  //       message.error(
  //         "Please fill in the required fields before switching tabs!"
  //       );
  //     });
  // };

  const loadTabData = (tabIndex) => {
    const data = segmentsData[record.fileid]?.find(
      (segment) => segment.activeTab === String(tabIndex)
    );

    if (data) {
      setStartDate(data.startDate || null);
      setEndDate(data.endDate || null);
      setTagType(data.tagType || null);
      setTagLabel(data.tagLabel || "");
      setPoliticalTag(data.politicalTag || "No");
      setCampaignYear(data.campaignYear || null);
      setInventorySource(null);
      setActiveHouseholdCount(null);
    }
  };

  const handleTabChange = (key) => {
    // Validate and save current tab data before switching tabs
    form
      .validateFields()
      .then(() => {
        saveTabData();
        setActiveTab(key);
        loadTabData(key);
        setInventorySource(null); // Clear Inventory Source on tab switch
        setActiveHouseholdCount(null); // Clear Household Count on tab switch
        const tabName = tabs[key];
        setCurrentTabName(tabName);
        form.resetFields(["inventorySource"]);
      })
      .catch(() => {
        message.error(
          "Please fill in the required fields before switching tabs!"
        );
      });
  };

  const handleNextPage = () => {
    const newActiveTab = (currentPage - 1) * tabsPerPage + 1;
    saveTabData();
    setActiveTab(String(newActiveTab));
    setCurrentPage((prev) => prev + 1);
  };

  const calculatePaddingLeft = () => {
    const index = parseInt(activeTab, 10) % tabsPerPage;
    const paddingLeftValues = [0, 25, 50, 75];
    console.log("padding index", index, paddingLeftValues[index]);
    return `${paddingLeftValues[index]}%`;
  };

  // Mock householdcount
  const fetchActiveHouseholdCount = async (source) => {
    try {
      const data = { activeHouseholdCount: 1 };
      setActiveHouseholdCount(data.activeHouseholdCount || 0);
    } catch (error) {
      message.error("Failed to fetch household count.");
    }
  };
  const handleInventorySourceChange = (value) => {
    setInventorySource(value);
    fetchActiveHouseholdCount(value);
  };

  const renderTabContent = () => {
    const index = parseInt(activeTab, 10);
    console.log("content tb index", index);
    if (!tabs[index]) return null;

    return (
      <div
        key={index}
        style={{
          marginBottom: "20px",
          padding: "10px",
          paddingLeft: calculatePaddingLeft(),
          marginRight: "10px",
          width: "25%",
          border: "1px solid #e0e0e0",
          marginLeft: calculatePaddingLeft(),
        }}
        className="tab-content-container"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="File ID">
            <p style={{ fontWeight: 500 }}>{record.fileid}</p>
          </Form.Item>

          <Form.Item label="File name">
            <p style={{ fontWeight: 500 }}>{record.name}</p>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item label="Inbound RowCount">
              <p style={{ fontWeight: 500 }}>{record.inboundRowCount}</p>
            </Form.Item>
            <Form.Item label="Outbound Account Count">
              <p style={{ fontWeight: 500 }}>{record.inboundAccountCount}</p>
            </Form.Item>
          </div>

          <Form.Item label="Active Household Count">
            <Input
              value={activeHouseholdCount !== null ? activeHouseholdCount : ""}
              placeholder="N/A"
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Tag Type"
            name="tagType"
            rules={[{ required: true, message: "Please select a tag type!" }]}
          >
            <Select
              style={{ width: "100%" }}
              mode="multiple"
              value={tagType}
              onChange={(value) => setTagType(value)}
              placeholder="Select"
            >
              {tagTypeOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Inventory Source"
            name="inventorySource"
            rules={[
              { required: true, message: "Please select an inventory source!" },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              value={inventorySource}
              onChange={handleInventorySourceChange}
              placeholder="Please select"
            >
              {inventorySourceOptions.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tag Label"
            name="tagLabel"
            rules={[{ required: true, message: "Please enter a tag label!" }]}
          >
            <Input
              type="text"
              value={tagLabel}
              onChange={(e) => setTagLabel(e.target.value)}
              placeholder="Type here... "
            />
          </Form.Item>

          <Form.Item
            label="Campaign Year"
            name="campaignYear"
            rules={[
              { required: true, message: "Please select a campaign year!" },
            ]}
          >
            <DatePicker
              picker="year"
              disabledDate={disabledYear}
              value={campaignYear ? moment(campaignYear, "YYYY") : null}
              onChange={handleCampaignYearChange}
              format="YYYY"
            />
          </Form.Item>

          <Form.Item label="D2 Political Tag">
            <Radio.Group
              onChange={(e) => setPoliticalTag(e.target.value)}
              value={politicalTag}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Activation Range"
            name="activationRange"
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                validator: (_, value) => {
                  if (!startDate || !endDate) {
                    return Promise.reject(
                      new Error("Please select an activation range!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <div style={{ display: "flex" }}>
              <DatePicker
                style={{ marginRight: 5 }}
                format={dateFormat}
                value={startDate ? moment(startDate) : null}
                onChange={handleStartDateChange}
                disabledDate={disabledStartDate}
              />
              <DatePicker
                format={dateFormat}
                value={endDate ? moment(endDate) : null}
                onChange={handleEndDateChange}
                disabledDate={disabledEndDate}
              />
            </div>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 20 }}>
          <Button
            onClick={saveTabData}
            type="primary"
            style={{ marginRight: 10, backgroundColor: "#DD2424" }}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => {
              saveTabData();
              setActiveTab(parseInt(activeTab) + 1);
            }}
            type="default"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // const getCurrentTabs = () => {
  //   const startIndex = (currentPage - 1) * tabsPerPage;
  //   const endIndex = startIndex + tabsPerPage;
  //   const slicedTabs = tabs.slice(startIndex, endIndex);

  //   return slicedTabs.map((tab, index) => ({
  //     label: (
  //       <span>
  //         {tab}{" "}
  //         {savedTabs.includes(String(startIndex + index)) && (
  //           <CheckCircleOutlined style={{ color: "green" }} />
  //         )}
  //       </span>
  //     ),
  //     key: `${startIndex + index}`,
  //   }));
  // };

  // While clicking the tabs move the tabs
  const getCurrentTabs = () => {
    const startIndex = (currentPage - 1) * tabsPerPage;
    const endIndex = startIndex + tabsPerPage;
    const slicedTabs = tabs.slice(startIndex, endIndex);

    return slicedTabs.map((tab, index) => {
      const tabName = typeof tab === "object" && tab.label ? tab.label : tab; // Use `tab.label` if it's an object, otherwise use the string
      const tabKey = startIndex + index;

      return {
        label: (
          <span>
            {tabName}{" "}
            {savedSegments[String(tabKey)] && (
              <CheckCircleOutlined style={{ color: "green" }} />
            )}
          </span>
        ),
        key: `${tabKey}`,
      };
    });
  };
  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          handleTabChange(key);
        }}
        items={getCurrentTabs()}
      />

      {renderTabContent()}

      {totalTabs > tabsPerPage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Pagination
            current={currentPage}
            total={totalTabs}
            pageSize={tabsPerPage}
            onChange={(page) => {
              const newActiveTab = (page - 1) * tabsPerPage;
              setActiveTab(String(newActiveTab));
              setCurrentPage(page);
              loadTabData(String(newActiveTab));
            }}
            style={{ marginTop: "16px", textAlign: "center" }}
          />
        </div>
      )}
    </div>
  );
};

export default TabWithPagination;
