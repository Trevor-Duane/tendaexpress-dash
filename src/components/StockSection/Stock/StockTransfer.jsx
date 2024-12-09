import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Add.css";
import { AiOutlineClose } from "react-icons/ai";
import { InputField } from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const StockTransfer = ({ stockItems, onClose, refetchStock }) => {
  const [fromStock, setFromStock] = useState('');
  const [toStock, setToStock] = useState('');
  const [quantity, setQuantity] = useState('');
  const [movementType, setMovementType] = useState('transfer');
  const [section, setSection] = useState('');

  const { apiUrl } = React.useContext(StoreContext)


  const handleSubmit = async (e) => {
    e.preventDefault();

    const foundStockItem = stockItems.find(item => item.id === parseInt(fromStock));
  
  if (!foundStockItem) {
    console.error('Stock item not found for ID:', fromStock);
    return; // Stop the function if the stock item isn't found
  }

  console.log("Stock item:", foundStockItem.stock_item); // Should output the stock item name
    // Log the stock transfer into the stock_movement table
    try {
      const response = await axios.post(`${apiUrl}/api/stock_movement`, {
        stock_item: foundStockItem.stock_item, // Set the stock item name
        from_stock_id: parseInt(fromStock),
        to_stock_id: parseInt(toStock),
        movement_type: movementType,
        quantity: parseFloat(quantity),
       section,
      });
      console.log('Stock transfer logged:', response.data);
      // Reset form fields
      setFromStock('');
      setToStock('');
      setQuantity('');
      setSection('');
    } catch (error) {
      console.error('Error logging stock transfer:', error);
    }
  };
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2>Stock Transfer</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {/* From Stock Item Dropdown */}
        <label className="transfer-label">From Stock Item:</label>
        <select
          className="inventory-edit-select"
          value={fromStock}
          onChange={(e) => setFromStock(e.target.value)}
          required
        >
          <option value="">Select Stock Item</option>
          {stockItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.stock_item}
            </option>
          ))}
        </select>

        {/* To Stock Item Dropdown */}
        <label className="transfer-label">To Stock Item:</label>
        <select
          className="inventory-edit-select"
          value={toStock}
          onChange={(e) => setToStock(e.target.value)}
          required
        >
          <option value="">Select Stock Item</option>
          {stockItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.stock_item}
            </option>
          ))}
        </select>

        {/* Movement Type Dropdown */}
        <label className="transfer-label">Movement Type:</label>
        <select
          className="inventory-edit-select"
          value={movementType}
          onChange={(e) => setMovementType(e.target.value)}
          required
        >
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="transfer">Transfer</option>
        </select>

        {/* Quantity */}
        <label>Quantity:</label>
        <InputField
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0"
          step="any"
        />

        {/* Section */}
        <label>Section:</label>
        <InputField
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="e.g., kitchen, bar"
          required
        />

        {/* Submit Button */}
        <div className="modal-footer">
          <button className="okay-button" type="submit">
            Transfer Stock
          </button>
          <button className="close-button" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransfer;
