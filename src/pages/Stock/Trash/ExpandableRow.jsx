// ExpandableRow.js
import React from "react";

const ExpandableRow = ({ details }) => {
  return (
    <div style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
      <h4>Budget Details:</h4>
      {details &&   details.length > 0 ? (
        <ul>
          {data.details.map((item) => (
            <li key={item.id}>
              <strong>Item Name:</strong> {item.item_name} | 
              <strong> Quantity:</strong> {item.quantity} | 
              <strong> UOM:</strong> {item.uom} | 
              <strong> Price:</strong> {item.price} | 
              <strong> Total:</strong> {item.total}
            </li>
          ))}
        </ul>
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
};

export default ExpandableRow;
