// has a seacrh functionality but its incomplete
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  InputButton,
  InputField,
} from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";
import "./CreateBudget.css";

const CreateBudget = ({ onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totals, setTotals] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("");
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [remarks, setRemarks] = useState("");
  const { user } = useContext(StoreContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/list_shopping_items"
        );
        const items = Array.isArray(response.data.data) ? response.data.data : [];
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };
    fetchInventoryItems();
  }, []);

  const handleItemSelect = (item) => {
    setSelectedItemId(item.id);
    setDropdownOpen(false); // Close dropdown after selecting
  };

  const addItemToBudget = () => {
    const selectedItem = inventoryItems.find(
      (item) => item.id === parseInt(selectedItemId)
    );
    if (selectedItem) {
      const quantity = itemQuantity;

      if (quantity > 0) {
        const newItem = { ...selectedItem, quantity };
        const section = selectedItem.section || "Uncategorized";

        setSelectedItems((prev) => {
          const sectionItems = prev[section] || [];
          const existingItemIndex = sectionItems.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex >= 0) {
            sectionItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            sectionItems.push(newItem);
          }

          return {
            ...prev,
            [section]: sectionItems,
          };
        });

        calculateTotals({
          ...selectedItems,
          [section]: [...(selectedItems[section] || []), newItem],
        });
        setItemQuantity(1);
        setSelectedItemId("");
      } else {
        alert("Please enter a valid quantity.");
      }
    }
  };

  const calculateTotals = (items) => {
    const sectionTotals = {};
    for (const section in items) {
      if (items.hasOwnProperty(section)) {
        const sectionItems = items[section];
        const total = sectionItems.reduce(
          (acc, item) => acc + item.unit_price * item.quantity,
          0
        );
        sectionTotals[section] = { total, items: sectionItems };
      }
    }
    setTotals(sectionTotals);
  };

  const removeItemFromBudget = (section, itemId) => {
    setSelectedItems((prev) => {
      const sectionItems = prev[section].filter((item) => item.id !== itemId);
      return {
        ...prev,
        [section]: sectionItems,
      };
    });
    calculateTotals(selectedItems);
  };

  const updateItemQuantity = (section, itemId, newQuantity) => {
    setSelectedItems((prev) => {
      const sectionItems = prev[section].map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return {
        ...prev,
        [section]: sectionItems,
      };
    });
    calculateTotals(selectedItems);
  };

  const handleSubmitBudget = async () => {
    if (Object.keys(selectedItems).length === 0) {
      alert("Please select some items before submitting the budget");
      return;
    }
    try {
      const totalAmount = Object.values(totals).reduce(
        (acc, section) => acc + section.total,
        0
      );
      const budgetResponse = await axios.post(
        "http://localhost:3000/api/create_budget",
        {
          budget_head: budgetTitle,
          from_date: from_date,
          to_date: to_date,
          budget_total: totalAmount,
          created_by: user.username,
          remarks: remarks,
        }
      );

      const budgetId = budgetResponse.data.budget;

      const budgetDetails = Object.keys(selectedItems).flatMap((section) =>
        selectedItems[section].map((item) => ({
          budget_id: budgetId,
          item_name: item.item_name,
          uom: item.uom,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.unit_price * item.quantity,
          section: item.section,
        }))
      );

      await axios.post("http://localhost:3000/api/create_budget_details", {
        details: budgetDetails,
      });

      alert("Budget successfully saved!");
      onClose(); // Close the form
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("An error occurred while saving the budget. Please try again.");
    }
  };

  return (
    <div className="budget-modal-content">
      <div className="budget-modal-header">
        <h2>Create a Budget</h2>
      </div>
      <div className="budget-details-row">
        <div className="budget-detail-col">
          <InputField
            type="text"
            placeholder="Enter budget title"
            value={budgetTitle}
            onChange={(e) => setBudgetTitle(e.target.value)}
          />
        </div>
        <div className="budget-detail-col">
          <InputField
            type="date"
            placeholder="from_date"
            value={from_date}
            onChange={(e) => setFrom_date(e.target.value)}
          />
        </div>
        <div className="budget-detail-col">
          <InputField
            type="date"
            placeholder="to_date"
            value={to_date}
            onChange={(e) => setTo_date(e.target.value)}
          />
        </div>
        <div className="budget-detail-col">
          <InputField
            type="text"
            placeholder="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>
      <div className="budget-form-controls">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
          />
        </div>

        {/* Custom Dropdown */}
        <div className="custom-dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedItemId
              ? inventoryItems.find((item) => item.id === parseInt(selectedItemId))?.item_name
              : "Select an item"}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {inventoryItems
                .filter(item =>
                  item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
                ) // Filtering based on search query
                .map((item) => (
                  <div
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleItemSelect(item)}
                  >
                    {item.item_name} - {item.unit_price}/=
                  </div>
                ))}
            </div>
          )}
        </div>
        
        <div>
          <InputField
            type="number"
            min="1"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </div>
        <div>
          <InputButton onClick={addItemToBudget}>Add to Budget</InputButton>
        </div>
      </div>
      <div className="budget-wrapper">
        {Object.keys(selectedItems).length === 0 ? (
          <div className="selected-budget-items">
            <p>No items selected yet.</p>
          </div>
        ) : (
          Object.keys(selectedItems).map((section) => (
            <div className="budget-table-wrapper" key={section}>
              <div className="budget-section-head">
                <h3>{section} Items</h3>
              </div>
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems[section].map((item) => (
                    <tr key={item.id}>
                      <td>{item.item_name}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(section, item.id, parseInt(e.target.value))
                          }
                        />
                      </td>
                      <td>{item.unit_price.toFixed(2)}</td>
                      <td>{(item.unit_price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItemFromBudget(section, item.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="budget-total">
                <strong>Total: {totals[section]?.total.toFixed(2) || 0}</strong>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="budget-actions">
        <InputButton onClick={handleSubmitBudget}>Submit Budget</InputButton>
        <InputButton onClick={onClose}>Cancel</InputButton>
      </div>
    </div>
  );
};

export default CreateBudget;
