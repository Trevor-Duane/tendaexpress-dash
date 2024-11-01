import React, { useState, useEffect } from "react";
import axios from "axios";
import { InputField } from "../../Form/FormComponents";

const InventoryEdit = ({ inventoryItems, onClose, refetchStore }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    inventory_item: "",
    section: "",
    uom: "",
    unit_price: "",
    tags: "",
  });
  

  // Populate form when item is selected from the dropdown
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const item = inventoryItems.find((item) => item.id === parseInt(itemId));
    setSelectedItem(item);
    setFormData({
      inventory_item: item ? item.inventory_item : "",
      section: item ? item.section : "",
      uom: item ? item.uom : "",
      unit_price: item ? item.unit_price : "",
      tags: item ? item.tags : "",
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
          `http://localhost:3000/api/update_inventory/${selectedItem.id}`,
          formData
        );
        console.log("Item updated successfully:", response.data);
        refetchStore()
        onClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2>Edit Inventory Item</h2>
      </div>
      {/* <Dropdown label="Select" onChange={handleItemChange} options={inventoryItems} /> */}
      <select className="inventory-edit-select" onChange={handleItemChange}>
        <option value="">Select an item to edit</option>
        {inventoryItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.inventory_item}
          </option>
        ))}
      </select>

      {selectedItem && (
        <>
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
                  id="itags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
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

export default InventoryEdit;
