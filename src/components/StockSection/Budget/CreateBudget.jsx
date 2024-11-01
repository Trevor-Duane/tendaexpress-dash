import React, { useState, useEffect, useContext } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import "./CreateBudget.css";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const CreateBudget = ({ onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totals, setTotals] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("");
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [remarks, setRemarks] = useState("");

  const { user, token } = useContext(StoreContext)
  console.log("this is a create budget user", token)

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/list_shopping_items"
        );
        const items = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };
    fetchInventoryItems();
  }, []);

  const handleItemSelect = (e) => {
    setSelectedItemId(e.target.value);
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
    //first check if there are any selected items
    if (Object.keys(selectedItems).length === 0) {
      alert("Please select some items before submitting the budget");
      return;
    }
    try {
      //prepare data for the budget table
      const totalAmount = Object.values(totals).reduce(
        (acc, section) => acc + section.total,
        0
      );
      //create a new budget in the budgets table
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

      // Get the newly created budget ID
      console.log("this should be the id of the budget", budgetResponse)
      const budgetId = budgetResponse.data.budget;

      // Prepare data for the `budget_details` table
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

      // Insert items into the `budget_details` table
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
        <div>
          <select
            className="inventory-edit-select"
            onChange={handleItemSelect}
            value={selectedItemId}
          >
            <option value="">Select an item</option>
            {inventoryItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name} - {item.unit_price}/=
              </option>
            ))}
          </select>
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
        {/* <h3>Selected Items</h3> */}
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
                    <th>Item</th>
                    <th>InStock</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems[section].map((item) => (
                    <tr key={item.id}>
                      <td>{item.item_name}</td>
                      <td>{item.stores[0]?.amount_in_store}</td>
                      <td>
                        <InputField
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(
                              section,
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>
                      <td>{(item.unit_price * item.quantity).toFixed(2)}/=</td>
                      <td>
                        <InputButton
                          onClick={() => removeItemFromBudget(section, item.id)}
                        >
                          Remove
                        </InputButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="budget-total-wrapper">
                <h4 id="budget-total">
                  Total for {section}:&nbsp;
                  {(totals[section]?.total || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  /=
                </h4>
              </div>
              {/* <h4 id="budget-total">
                Total for {section}: Shs.{totals[section]?.total.toFixed(2) || 0.0}
              </h4> */}
            </div>
          ))
        )}
      </div>
      <div className="budget-modal-footer">
        <button className="budget-okay-button" type="submit" onClick={handleSubmitBudget}>
          Save Budget
        </button>
        <button className="budget-close-button" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
export default CreateBudget;