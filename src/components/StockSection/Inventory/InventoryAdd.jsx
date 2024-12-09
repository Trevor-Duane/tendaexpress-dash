import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryAdd.css";
import {
  InputField,
  InputButtonOutline,
  InputButton,
} from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const InventoryAdd = ({ onClose, refetchStore }) => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [budgetDetails, setBudgetDetails] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  const {apiUrl} = React.useContext(StoreContext)

  // Fetch all budgets for the dropdown
  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/budgets`);
      setBudgets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  // Fetch budget details based on selected budget
  const fetchBudgetDetails = async (budgetId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/get_budget/${budgetId}`
      );

      const details = response.data;
      setBudgetDetails(details.budget);
      setInventoryItems(details.items || []); // Assuming budget contains inventory items
    } catch (error) {
      console.error("Error fetching budget details:", error);
    }
  };

  // Handle budget selection
  const handleBudgetSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedBudgetId(selectedId);
    if (selectedId) {
      fetchBudgetDetails(selectedId);
    }
  };

  // Handle quantity change for inventory items
  const handleQuantityChange = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value,
    }));
  };

  // Handle submission of the form
  const handleSubmit = async () => {
    // Map over the inventory items and create a payload with the details of each item
    const payload = inventoryItems.map((item) => ({
      item_name: item.item_name,
      uom: item.uom,
      section: item.section,
      quantity: quantities[item.id] || 0, // Set default to 0 if no quantity is provided
    }));

    // Log the payload to check the data structure before sending
    console.log("Payload for submission:", payload);

    try {
      // Post each item to the server using Axios
      // for (const itemData of payload) {
      await axios.post(`${apiUrl}/api/inventory/add`, {
        budgetId: selectedBudgetId,
        payload, // Spread the individual item data
      });
      // }

      onClose(); // Close the modal after success
      refetchStore(); // Optionally refetch the updated inventory
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  // Fetch budgets on modal mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="inventory-modal-content">
      <div className="inventory-modal-header">
        <h2>Replenish Stock Levels From Budget</h2>
      </div>

      <div className="store-select-wrapper">
        <select
          className="mycustom-select"
          value={selectedBudgetId}
          onChange={handleBudgetSelect}
        >
          <option value="">Select a Budget</option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.budget_head}
            </option>
          ))}
        </select>
      </div>

      {/* Display budget details if a budget is selected */}
      {budgetDetails && (
        <div>
          <div className="inventory-budget-details">
            <p>
              Budget Total:{" "}
              {Intl.NumberFormat("en-US").format(budgetDetails.budget_total)}/=
            </p>
            
          </div>

          {/* Display inventory items */}
          <div className="inventory-items">
            {inventoryItems.map((item) => (
              <div key={item.id} className="inventory-item-row">
                <div className="inventory-item-col">
                  <InputField
                    name="item_name"
                    type="text"
                    readOnly
                    value={item.item_name}
                  />
                </div>
                <div className="inventory-item-col">
                  <InputField
                    name="item.section"
                    type="text"
                    readOnly
                    value={item.section}
                  />
                </div>
                <div className="inventory-item-col">
                  <InputField
                    name="item.uom"
                    type="text"
                    readOnly
                    value={item.uom}
                  />
                </div>
                <div className="inventory-item-col">
                  <InputField
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={quantities[item.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit and Close buttons */}
      <div className="inventory-modal-buttons">
        <InputButtonOutline onClick={handleSubmit}>
          Add Inventory
        </InputButtonOutline>
        <InputButton onClick={onClose}>Cancel</InputButton>
      </div>
    </div>
  );
};

export default InventoryAdd;
