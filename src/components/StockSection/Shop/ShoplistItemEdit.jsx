import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, InputField, styles } from "../../Form/FormComponents";

const ShoplistItemEdit = ({ shoplistItems, onClose, refetchShopItems }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: "",
    section: "",
    uom: "",
    unit_price: "",
  });

  // Populate form when item is selected from the dropdown
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const item = shoplistItems.find((item) => item.id === parseInt(itemId));
    setSelectedItem(item);
    setFormData({
      item_name: item ? item.item_name : "",
      section: item ? item.section : "",
      uom: item ? item.uom : "",
      unit_price: item ? item.unit_price : "",
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update the item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        const response = await axios.put(
          `http://localhost:3000/api/update_shoplist_item/${selectedItem.id}`,
          formData
        );
        console.log("Item updated successfully:", response.data);
        refetchShopItems();
        onClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="shoplist-modal-content">
      <div className="shoplist-modal-header">
        <h2>Edit Shoplist Item</h2>
      </div>
      <select className="shoplist-edit-select" onChange={handleItemChange}>
        <option value="">Select an item to edit</option>
        {shoplistItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.item_name}
          </option>
        ))}
      </select>

      {selectedItem && (
        <>
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
                  placeholder="Unit Price"
                  id="uprice"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="shoplist-modal-footer">
              <button className="okay-button" type="submit">
                Update Item
              </button>
              <button className="close-button" type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ShoplistItemEdit;
