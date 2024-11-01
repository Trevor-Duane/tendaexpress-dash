import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown, InputField, styles } from "../../Form/FormComponents";

const StockEdit
 = ({ stockItems, onClose, refetchStock }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    stock_item: "",
    uom: "",
    portions_in_stock: "",
    portion_price: "",
    // stock_price: "",
    reorder_level: "",
    section: "",
    category: "",
    tag: "",
  });
  

  // Populate form when item is selected from the dropdown
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const item = stockItems.find((item) => item.id === parseInt(itemId));
    setSelectedItem(item);
    setFormData({
      stock_item: item ? item.stock_item : "",
      uom: item ? item.uom : "",
      portions_in_stock: item ? item.portions_in_stock : "",
      portion_price: item ? item.portion_price : "",
      // stock_price: item ? item.stock_price : "",
      reorder_level: item ? item.reorder_level : "",
      section: item ? item.section : "",
      category: item ? item.category : "",
      tag: item ? item.tag : "",
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
          `http://localhost:3000/api/update_stock/${selectedItem.id}`,
          formData
        );
        console.log("Item updated successfully:", response.data);
        refetchStock()
        onClose(); // Close the modal on success
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2>Edit Stock Item</h2>
      </div>
      {/* <Dropdown label="Select" onChange={handleItemChange} options={inventoryItems} /> */}
      <select className="inventory-edit-select" onChange={handleItemChange}>
        <option value="">Select an item to edit</option>
        {stockItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.stock_item}
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
                  name="stock_item"
                  value={formData.stock_item}
                  onChange={handleChange}
                />
              </div>
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
            </div>

            <div className="inventoryFormRow">
              <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Portions In Stock"
                  id="iinstock"
                  name="portions_in_stock"
                  value={formData.portions_in_stock}
                  onChange={handleChange}
                />
              </div>
              <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Portion Price"
                  id="ipprice"
                  name="portion_price"
                  value={formData.portion_price}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Stock Price"
                  id="iprice"
                  name="stock_price"
                  value={formData.stock_price}
                  onChange={handleChange}
                />
              </div> */}
            </div>

            <div className="inventoryFormRow">
              <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Reorder Level"
                  id="ilevel"
                  name="reorder_level"
                  value={formData.reorder_level}
                  onChange={handleChange}
                />
              </div>
              
              <div className="inventoryFormCol">
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

            <div className="inventoryFormRow">
              <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Category"
                  id="icategory"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              
              <div className="inventoryFormCol">
                <InputField
                  type="text"
                  placeholder="Tag"
                  id="itag"
                  name="tag"
                  value={formData.tag}
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

export default StockEdit
;
