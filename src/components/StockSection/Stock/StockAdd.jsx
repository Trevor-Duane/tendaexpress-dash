import React, { useState } from "react";
import axios from "axios";
import "./Add.css";
import { AiOutlineClose } from "react-icons/ai";
import { InputField } from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const StockAdd = ({ onClose, refetchStock }) => {
  const [formData, setFormData] = useState({
    stock_item: "",
    uom: "",
    portions_in_stock: "",
    stock_price: "",
    reorder_level: "",
    section: "",
    category: "",
    tags: "",
  });

  const { apiUrl } = React.useContext(StoreContext)

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'inventory_item' ? value.toUpperCase() : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/add_stock`,
        formData
      );
      console.log("Form Submitted Successfully:", response.data);
      refetchStock()
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2>Add Inventroy</h2>
        {/* <button className="close-button" onClick={onClose}>
          <AiOutlineClose size={20} />
        </button> */}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inventoryFormRow">
          <div className="inventoryFormCol">
            <InputField
              type="text"
              placeholder="Item Name"
              id="iname"
              name="inventory_item"
              value={formData.inventory_item}
              onChange={handleChange}
            />
          </div>
          <div className="inventoryFormCol">
            <InputField
              type="text"
              placeholder="Section/Location"
              id="isection"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="inventoryFormRow">
          <div className="inventoryFormCol">
            <InputField
              type="text"
              placeholder="UOM"
              id="iuom"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
            />
          </div>
          <div className="inventoryFormCol">
            <InputField
              type="text"
              x
              placeholder="Unit Price"
              id="iprice"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="inventoryFormRow">
          <div className="inventoryFormCol">
            <InputField
              type="text"
              placeholder="Tags"
              id="itag"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
        <button className="okay-button" type="submit">Add Item</button>
        <button className="close-button" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      </form>    
    </div>
  );
};
export default StockAdd;
