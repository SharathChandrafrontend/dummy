import React, { useEffect, useState } from "react";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Notification = ({
  transactionId,
  transactionmessage,
  setshowViewtransctionbtn,
}) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setshowViewtransctionbtn(false);
  }, []);

  // when we clickon the view transaction it will navigate to the transcations screen
  const handleOkClick = () => {
    navigate("/transactions");
  };

  const handleviewTransction = () => {
    setshowViewtransctionbtn(true);
  };
  // To display the notification
  return (
    <div style={{ marginBottom: "15px", marginTop: "15px" }}>
      {visible && (
        <Alert
          style={{ backgroundColor: "#32821B", color: "#fff" }}
          message={
            <span style={{ color: "#fff" }}>
              Successfully submitted request
            </span>
          }
          description={
            <div style={{ color: "#fff" }}>
              <p>{`Your request for generating tags successfully submitted with transaction id : Acxiom_6786_6787_November_04_2024_19:04:00 , you will receive an email for confirmation.`}</p>
              <p>Request has been accepted for processing</p>
              <Button
                type="primary"
                onClick={handleOkClick}
                style={{ backgroundColor: "#32821B", border: "1px solid #fff" }}
              >
                OK
              </Button>
              {/* <div>
                <Button style={{ backgroundColor: "#DD2424 !important",
                            color:"#FFFFFF !important",
                             border:"none !important"}}>
                  View Transactions
                </Button>
                </div> */}
            </div>
          }
          type="success"
          showIcon
          closable
          onClose={() => {
            setVisible(false);
            handleviewTransction();
          }}
        />
      )}
    </div>
  );
};

export default Notification;
