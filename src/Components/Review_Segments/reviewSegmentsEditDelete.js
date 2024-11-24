import React, { useContext } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import { Radio, Select, DatePicker, Button, Input, Pagination } from "antd";
import moment from "moment";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./reviewSegments.css";

export default function ReviewSegmentsEditDelete({
  data,
  index,
  segmentId,
  activeFileId,
  setActiveFileId,
  onUpdateSegment,
  deleteSegment,
  disableEdit,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const [tagTypeOptions, setTagTypeOptions] = useState([]);
  const [inventorySourceOptions, setInventorySourceOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tabsPerPage = 4;
  // const [value, setValue] = useMyContext();

  console.log("data", data);

  const headers = {
    Accept: "application/json",
    "x-correlation-id": uuidv4(),
    requesttype: "GetVendorFiles",
  };

  // TagTypes API
  const fetchTagTypes = async () => {
    try {
      const response = await axios.get(
        "https://xyz..com/dev/media-sales/api/tagTypes",
        {
          headers,
        }
      );
      const options = response.data.tagTypeList.map((tag) => ({
        name: tag.tagType,
        id: tag.tagType,
      }));
      setTagTypeOptions(options);
    } catch (error) {
      console.error("Failed to fetch tag types:", error);
    }
  };

  //console.log("tag types1111", tagTypeOptions, inventorySourceOptions);
  // Inventorysource API
  const fetchInventorySources = async () => {
    try {
      const response = await axios.get(
        "https://xyz.com/dev/media-sales/api/inventorySources",
        {
          headers,
        }
      );
      const options = response.data.inventorySourceList.map((inventory) => ({
        name: inventory.inventorySource,
        id: inventory.fulfillmentType,
      }));
      setInventorySourceOptions(options);
    } catch (error) {
      console.error("Failed to fetch inventory sources:", error);
    }
  };

  useEffect(() => {
    // fetchTagTypes();
    // fetchInventorySources();
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
  }, []);

  const handleEditSegment = () => {
    setActiveFileId(data.fileId);
    setIsEdit(true);
  };

  const handleUpdateSegment = () => {
    setIsEdit(false);
    onUpdateSegment(segmentId, editedData);
  };

  const handleTagLabelChange = (tagLabel) => {
    setEditedData({ ...editedData, tagLabel });
  };

  const handleTagTypeEdit = (tagType) => {
    setEditedData({ ...editedData, tagType });
  };

  const handleInventorySourceEdit = (inventorySource) => {
    setEditedData({ ...editedData, inventorySource });
  };

  const handleEditPoliticalTag = (politicalTag) => {
    setEditedData({ ...editedData, politicalTag });
  };

  const handleCampaignYearChange = (date) => {
    const formattedYear = date ? date.format("YYYY") : null;
    setEditedData({ ...editedData, campaignYear: formattedYear });
  };
  const disabledYear = (current) => {
    return current && current.year() < moment().year();
  };
  const handleStartDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setEditedData({ ...editedData, startDate: formattedDate });
    if (
      date &&
      editedData.endDate &&
      date.isAfter(moment(editedData.endDate))
    ) {
      setEditedData({ ...editedData, endDate: null });
    }
  };

  const handleEndDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    setEditedData({ ...editedData, endDate: formattedDate });
  };

  const disabledStartDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const disabledEndDate = (current) => {
    return (
      current &&
      (current < moment().startOf("day") ||
        current < moment(editedData.startDate))
    );
  };

  // console.log("sdfasddf",data.inventorySource,inventorySourceOptions,inventorySourceOptions.length > 0 && inventorySourceOptions.filter(
  //   (inventory) =>
  //     inventory.id === data.inventorySource
  // ))

  console.log("editedData", editedData);
  // Edit and delete form
  return (
    <div className="review-tag-container">
      {console.log("data", data)}
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "white",
          width: "90%",
        }}
      >
        <div>
          <p>File Name: </p>
          <p className="review-delete-font-size-bold file-text-overflow">
            {data.fileName}
          </p>
          <div style={{ width: "50%", marginRight: "5px" }}>
            <p className="review-delete-font-size">Tag Label:</p>
            {isEdit ? (
              <Input
                style={{ width: "50%" }}
                type="text"
                value={editedData.tagLabel}
                onChange={(e) => handleTagLabelChange(e.target.value)}
                placeholder="Type here... "
              />
            ) : (
              <p className="review-delete-font-size-bold">{data.tagLabel}</p>
            )}
          </div>
          <div className="edit-delete-container">
            <div style={{ width: "50%", marginRight: "5px" }}>
              <p>Inbound Row Count : </p>
              <p className="review-delete-font-size-bold">
                {data.inboundRowCount}
              </p>
            </div>
            <div>
              <p>Inbound Account Count : </p>
              <p className="review-delete-font-size-bold">
                {data.outBoundRowCount}
              </p>
            </div>
          </div>

          <div className="edit-delete-container">
            <div>
              <p>Segment : </p>
              <p className="review-delete-font-size-bold">{data.segmentId}</p>
            </div>

            <div>
              <p>Active household Count : </p>
              <p className="review-delete-font-size-bold">
                {data.activeHouseholdCount}
              </p>
            </div>
          </div>

          <div className="edit-delete-container">
            <div style={{ width: "50%", marginRight: "5px" }}>
              <p className="review-delete-font-size">Tag type:</p>
              {isEdit ? (
                <Select
                  style={{ width: "100%" }}
                  mode="multiple"
                  value={editedData.tagType}
                  onChange={(value) => handleTagTypeEdit(value)}
                  placeholder="Select"
                >
                  {tagTypeOptions.map((option) => (
                    <Option
                      key={option.id}
                      value={option.id}
                      className="review-delete-font-size-bold"
                    >
                      {option.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <p>{data.tagType.join(", ")}</p>
              )}
            </div>

            <div style={{ width: "50%" }}>
              <p className="review-delete-font-size">Inventory source:</p>
              {isEdit ? (
                <Select
                  style={{ width: "100%" }}
                  value={editedData.inventorySource}
                  onChange={(value) => handleInventorySourceEdit(value)}
                  placeholder="Select"
                >
                  {inventorySourceOptions.map((option) => (
                    <Option
                      key={option.id}
                      value={option.id}
                      className="review-delete-font-size-bold"
                    >
                      {option.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <div>
                  {/* <p>{data.inventorySource}</p> */}
                  <p>
                    {inventorySourceOptions.length > 0 &&
                      inventorySourceOptions.filter(
                        (inventory) => inventory.id === data.inventorySource
                      )[0].name}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="edit-delete-container">
              <div
                className="segment-field"
                style={{ width: "50%", marginRight: "5px" }}
              >
                <p className="review-delete-font-size">Campaign Year:</p>
                {isEdit ? (
                  <DatePicker
                    className="review-delete-font-size-bold"
                    picker="year"
                    disabledDate={disabledYear}
                    value={
                      editedData.campaignYear
                        ? moment(editedData.campaignYear, "YYYY")
                        : null
                    }
                    onChange={handleCampaignYearChange}
                    format="YYYY"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <p className="review-delete-font-size-bold">
                    {data.campaignYear}
                  </p>
                )}
              </div>

              <div className="segment-field" style={{ width: "50%" }}>
                <p className="review-delete-font-size">Political Tag:</p>
                {isEdit ? (
                  <Radio.Group
                    onChange={(e) => handleEditPoliticalTag(e.target.value)}
                    value={editedData.politicalTag}
                  >
                    <Radio value={"Yes"}>Yes</Radio>
                    <Radio value={"No"}>No</Radio>
                  </Radio.Group>
                ) : (
                  <p className="review-delete-font-size-bold">
                    {data.politicalTag}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="edit-delete-container">
            <div style={{ width: "50%", marginRight: "5px" }}>
              <p className="review-delete-font-size">Start Date:</p>
              {isEdit ? (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={
                    editedData.startDate ? moment(editedData.startDate) : null
                  }
                  onChange={handleStartDateChange}
                  disabledDate={disabledStartDate}
                  style={{ width: "100%" }}
                />
              ) : (
                <p className="review-delete-font-size-bold">{data.startDate}</p>
              )}
            </div>
            <div style={{ width: "50%" }}>
              <p className="review-delete-font-size">End Date:</p>
              {isEdit ? (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={editedData.endDate ? moment(editedData.endDate) : null}
                  onChange={handleEndDateChange}
                  disabledDate={disabledEndDate}
                  style={{ width: "100%" }}
                />
              ) : (
                <p className="review-delete-font-size-bold">{data.endDate}</p>
              )}
            </div>
          </div>
          <div>
            {isEdit && (
              <Button
                type="primary"
                style={{ backgroundColor: "#DD2424", marginTop: "5px" }}
                onClick={handleUpdateSegment}
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </div>
      {!disableEdit && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "5px",
            width: "94%",
          }}
        >
          <RiDeleteBin6Line
            size={20}
            className="delete-icon"
            onClick={() => deleteSegment(data.segmentId)}
          />
          <MdOutlineEdit
            size={20}
            className="edit-icon"
            onClick={handleEditSegment}
          />
        </div>
      )}
      {/* <Pagination
        current={currentPage}
        total={data.length}
        pageSize={tabsPerPage}
        onChange={(page) => {
          const newActiveTab = (page - 1) * tabsPerPage;
          // setActiveTab(String(newActiveTab));
          setCurrentPage(page);
          // loadTabData(String(newActiveTab));
        }}
        style={{ marginTop: "16px", textAlign: "center" }}
      /> */}
    </div>
  );
}
