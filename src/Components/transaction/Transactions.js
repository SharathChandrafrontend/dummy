import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import { Button, message, Table, Tag } from "antd";
import "./Transactions.css";
import { Link } from "react-router-dom";

export default function Transactions() {
  const [transactionsData, setTransactionsData] = useState([]);

  // Fetch the view Transactions through API
  // useEffect(() => {
  //     const fetchVendors = async () => {
  //       const apiUrl =
  //         "https://xyz.com/dev/media-sales/api/vendors";
  //       try {
  //         // setVendorLoading(true);
  //         const response = await fetch(apiUrl, {
  //           method: "GET",
  //           headers: {
  //             "Accept": "application/json",
  //             "x-correlation-id": uuidv4(),
  //             "requesttype": "GetUserTransactions",
  //           },
  //         });

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch vendor list");
  //         }
  //         const result = await response.json();
  //         // setVendorList(result.vendorList);
  //       } catch (error) {
  //         console.log(error)
  //         message.error(`Error fetching vendor list: ${error.message}`);
  //       } finally {
  //         // setVendorLoading(false);
  //       }
  //     };
  //     console.log("api is calling")
  //     fetchVendors();
  //   }, []);
  // const handleTransactionClick = async (transactionId) => {
  //   try {
  //     const response = await axios.get(`https://xyz.com/dev/media-sales/api/tags?`, {

  //       params: { transactionId },
  //       headers: {
  //                 Accept: "application/json",
  //                 "x-correlation-id": uuidv4(),
  //                 requesttype: "GetVendorFiles",
  //               },
  //     });

  //     const transactionDetails = response.data;

  //     navigate(`/transactions/${transactionId}/viewTransaction`, {
  //       state: { transactionDetails },
  //     });
  //   } catch (error) {
  //     console.error('Error fetching transaction details:', error);
  //     message.error('Failed to fetch transaction details.');
  //   }
  // };

  // View Transactions Table
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
    },
    {
      title: "Date Generated",
      dataIndex: "dateGenerated",
      key: "dateGenerated",
    },
    {
      title: "Time Stamp",
      dataIndex: "timeStamp",
      key: "timeStamp",
    },
    {
      title: "Transaction Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",

      render: (status) => (
        <Link
          to={`/Acxiom_6786_6787_November_04_2024_19:04:00/viewTransaction`}
        >
          <Button
            className="view-transaction-btn"
            style={{
              backgroundColor:
                status === "View transaction status" ? "#DD2424" : "#808080",
              color: "#fff", // Text color
              borderColor:
                status === "View transaction status" ? "#DD2424" : "#808080",
            }}
          >
            {status}
          </Button>
        </Link>
        //
        // ={() => handleTransactionClick(record.transactionId)}
      ),
    },
  ];

  const data = [
    {
      key: "1",
      transactionId: "Sling_67560_67562_67594_October-06-2024-13:03:02",
      vendor: "Sling",
      dateGenerated: "10-10-2024",
      timeStamp: "13:03:02",
      transactionStatus: "View transaction status",
    },
    {
      key: "2",
      transactionId: "Sling_67564_67566_October-06-2024-17:53:02",
      vendor: "Sling",
      dateGenerated: "10-10-2024",
      timeStamp: "17:53:02",
      transactionStatus: "View transaction status",
    },
    {
      key: "3",
      transactionId: "Sling_67598_67599_67601_October-07-2024-09:00:02",
      vendor: "Sling",
      dateGenerated: "10-10-2024",
      timeStamp: "09:00:02",
      transactionStatus: "View transaction status",
    },
    {
      key: "4",
      transactionId: "Acxiom_6786_6787_November_04_2024_19:04:00",
      vendor: "Acxiom",
      dateGenerated: "04-11-2024",
      timeStamp: "19:04:00",
      transactionStatus: "View transaction status",
    },
  ];

  //   const App = () => (
  //     <Table columns={columns} dataSource={data} pagination={false} />
  //   );
  return (
    <div>
      <Header />
      <div className="content-container transaction-table">
        <Table dataSource={data} columns={columns} className="custom-row" />
      </div>
    </div>
  );
}
