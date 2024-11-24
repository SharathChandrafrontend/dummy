import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import "./vendorSelection.css";

const { Option } = Select;

const VendorSelection = ({
  setSelectedVendor,
  setShowBtns,
  setCurrent,
  setCurrentPage,
  setSearchText,
  resetSearchInput,
  setSearchedColumn,
}) => {
  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(true);

  // Fetch the vendor selection through API

  const vendorsList = ["Acxiom", "Dish", "Experian"];

  useEffect(() => {
    //  fetchVendors();
  }, []);
  // const fetchVendors = async () => {
  //   const apiUrl =
  //     "https://xyz.com/dev/media-sales/api/vendors";
  //   try {
  //     setVendorLoading(true);
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Accept": "application/json",
  //         "x-correlation-id": uuidv4(),
  //         "requesttype": "GetVendors",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch vendor list");
  //     }
  //     const result = await response.json();
  //     setVendorList(result.vendorList);
  //   } catch (error) {
  //     console.log(error)
  //     message.error(`Error fetching vendor list: ${error.message}`);
  //   } finally {
  //     setVendorLoading(false);
  //   }
  // };

  const handleChange = (value) => {
    setSelectedVendor(value);
    setShowBtns(true);
    setCurrent(0);
    setCurrentPage(1);

    // Reset the search states
    setSearchText("");
    resetSearchInput();
    setSearchedColumn("");
  };

  return (
    <div>
      <p>Select the data vendor you are using:</p>
      <Select
        className="vendor-selection-container"
        showSearch
        loading={vendorLoading}
        style={{
          width: "100%",
          border: "none",
          "&:hover": {
            borderColor: "#DD2424 !important",
          },
        }}
        placeholder="Select Vendor"
        optionFilterProp="children"
        onChange={handleChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {vendorsList.map((vendor) => (
          <Option key={vendor} value={vendor}>
            {vendor}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default VendorSelection;
