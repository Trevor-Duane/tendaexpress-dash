import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./EditBudget.css";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const EditBudget = ({ budgetId, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totals, setTotals] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("");
  const [from_date, setFrom_date] = useState("");
  const [to_date, setTo_date] = useState("");
  const [remarks, setRemarks] = useState("");

  const { user, apiUrl } = useContext(StoreContext);

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/list_shopping_items`
        );
        const items = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    const fetchBudgetData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/get_budget/${budgetId}`
        );
        const budgetData = response.data;

        setBudgetTitle(budgetData.budget.budget_head);
        setFrom_date(budgetData.budget.from_date);
        setTo_date(budgetData.budget.to_date);
        setRemarks(budgetData.budget.remarks);

        const loadedItems = budgetData.items.reduce((acc, detail) => {
          const section = detail.section || "Uncategorized";
          if (!acc[section]) acc[section] = [];
          acc[section].push(detail);
          return acc;
        }, {});
        setSelectedItems(loadedItems);
        calculateTotals(loadedItems);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchInventoryItems();
    fetchBudgetData();
  }, [budgetId]);

  const handleItemSelect = (e) => {
    setSelectedItemId(e.target.value);
  };
  const addItemToBudget = () => {
    const selectedItem = inventoryItems.find(
      (item) => item.id === parseInt(selectedItemId)
    );
    if (selectedItem) {
      const newItem = { ...selectedItem, quantity: 1 }; // Default quantity set to 1
      const section = selectedItem.section || "Uncategorized";

      // Check if the item already exists in the selected items
      const existingItemIndex = (selectedItems[section] || []).findIndex(
        (item) => item.id === newItem.id
      );
      if (existingItemIndex >= 0) {
        alert("This item already exists in the budget.");
        return; // Exit the function early
      }

      setSelectedItems((prev) => {
        const sectionItems = prev[section] || [];
        const updatedItems = [...sectionItems, newItem]; // Add new item
        return { ...prev, [section]: updatedItems };
      });

      // Recalculate totals immediately
      calculateTotals({
        ...selectedItems,
        [section]: [...(selectedItems[section] || []), newItem],
      });

      setSelectedItemId(""); // Clear selection
    } else {
      alert("Please select a valid item.");
    }
  };

  const calculateTotals = (items) => {
    const sectionTotals = {};
    for (const section in items) {
      const sectionItems = items[section];
      const total = sectionItems.reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0
      );
      sectionTotals[section] = { total, items: sectionItems };
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

    // Recalculate totals after removing the item
    calculateTotals({
      ...selectedItems,
      [section]: selectedItems[section].filter((item) => item.id !== itemId),
    });
  };

  const updateItemQuantity = (section, itemId, newQuantity) => {
    const quantity = Math.max(1, Number(newQuantity)); // Ensure quantity is at least 1
    setSelectedItems((prev) => {
      const sectionItems = prev[section].map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
      return {
        ...prev,
        [section]: sectionItems,
      };
    });

    // Recalculate totals based on the updated state
    const updatedItems = {
      ...selectedItems,
      [section]: selectedItems[section].map((item) => ({
        ...item,
        quantity: item.id === itemId ? quantity : item.quantity,
      })),
    };
    calculateTotals(updatedItems);
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

      await axios.put(`${apiUrl}/api/update_budget/${budgetId}`, {
        budget_head: budgetTitle,
        from_date: from_date,
        to_date: to_date,
        budget_total: totalAmount,
        created_by: user.username,
        remarks: remarks,
        details: budgetDetails,
      });

      alert("Budget successfully updated!");
      onClose(); // Close the form
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("An error occurred while saving the budget. Please try again.");
    }
  };

  return (
    <div className="budget-modal-content">
      <div className="budget-modal-header">
        <h2>Edit Budget</h2>
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
            placeholder="From Date"
            value={from_date}
            onChange={(e) => setFrom_date(e.target.value)}
          />
        </div>
        <div className="budget-detail-col">
          <InputField
            type="date"
            placeholder="To Date"
            value={to_date}
            onChange={(e) => setTo_date(e.target.value)}
          />
        </div>
        <div className="budget-detail-col">
          <InputField
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>
      <div className="budget-form-controls">
        <div className="custom-selectWrapper">
          <select
            className="mycustom-select"
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
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems[section].map((item) => (
                    <tr key={item.id}>
                      <td>{item.item_name}</td>
                      <td>{item.unit_price}</td>
                      <td>
                        <InputField
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(section, item.id, e.target.value)
                          }
                        />
                      </td>
                      <td>{item.unit_price * item.quantity}</td>
                      <td>
                        <button
                          className="budgetedit-remove-item-button"
                          onClick={() => removeItemFromBudget(section, item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="budget-section-total">
                <strong>Total: </strong>{" "}
                {totals[section]?.total
                  ? totals[section].total.toLocaleString()
                  : 0}/=
              </div>
            </div>
          ))
        )}
      </div>
      <div className="edit-budget-actions">
        <div>
          <InputButtonOutline id="edit-okay" onClick={handleSubmitBudget}>
            Update Budget
          </InputButtonOutline>
        </div>
        <div>
          <InputButton id="edit-cancel" onClick={onClose}>
            Cancel
          </InputButton>
        </div>
      </div>
    </div>
  );
};

export default EditBudget;
