import React from "react";
import { Card, Button } from "react-bootstrap";




const SellerHomeDet = ({ demand, onClose, onAccept, onReject }) => {
  if (!demand) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
      onClick={onClose}
    >
      <Card
        className="p-4 shadow"
        style={{ width: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>Product: {demand.productName}</h5>
        <p>Price: {demand.productPrice}</p>
        <p>
          Link:{" "}
          <a
            href={demand.productLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {demand.productLink}
          </a>
        </p>
        <p>Delivery Date: {demand.deliveryDate?.slice(0, 10)}</p>
        <div className="d-flex justify-content-between mt-3">
          <Button variant="success" onClick={onAccept}>
            Accept
          </Button>
          <Button variant="danger" onClick={onReject}>
            Reject
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SellerHomeDet;
