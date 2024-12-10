import React, { useState } from "react";
import axios from "axios";
import "./Add.css";
import { AiOutlineClose } from "react-icons/ai";
import { InputField } from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const ShoplistItemAdd = ({ onClose, refetchShopItems }) => {
  const [formData, setFormData] = useState({
    item_name: "",
    section: "",
    uom: "",
    unit_price: "",
  });
  const { apiUrl } = React.useContext(StoreContext)

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'item_name' ? value.toUpperCase() : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/add_shoplist_item`,
        formData
      );
      console.log("Form Submitted Successfully:", response.data);
      refetchShopItems()
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="shoplist-modal-content">
      <div className="shoplist-modal-header">
        <h2>Shoplist Item</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="shoplistFormRow">
          <div className="shoplistFormCol">
            <InputField
              type="text"
              placeholder="Item Name"
              id="iname"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
            />
          </div>
          <div className="shoplistFormCol">
            <InputField
              type="text"
              placeholder="Section"
              id="isection"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="shoplistFormRow">
          <div className="shoplistFormCol">
            <InputField
              type="text"
              placeholder="UOM"
              id="iuom"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
            />
          </div>
          <div className="shoplistFormCol">
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

        <div className="shoplist-modal-footer">
        <button className="okay-button" type="submit">Add Item</button>
        <button className="close-button" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      </form>    
    </div>
  );
};
export default ShoplistItemAdd;
