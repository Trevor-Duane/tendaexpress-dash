import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./ShareBudget.css";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../Form/FormComponents";
import { StoreContext } from "../../../Context/StoreContext";

const ShareBudget = ({ budgetId, onClose }) => {
  const [systemUsers, setSystemUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});

  const { user, apiUrl } = useContext(StoreContext);

  useEffect(() => {
    const fetchSystemUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users`);
        const items = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setSystemUsers(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchSystemUsers();
  }, [budgetId]);


  const handleShareBudget = async () => {
    if (Object.keys(selectedUsers).length === 0) {
      alert("Please select some items before submitting the budget");
      return;
    }

    try {
     
      await axios.post(`${apiUrl}/api/update_budget/${budgetId}`, {
        budget_head: budgetTitle,
      });

      alert("Budget Shared Succesfully!");
      onClose(); // Close the form
    } catch (error) {
      console.error("Error sharing budget:", error);
      alert("An error occurred while sharing the budget. Please try again.");
    }
  };

  return (
    <div className="budget-modal-content">
      <div className="budget-modal-header">
        <h2>Share Budget</h2>
      </div>
      <div className="budget-users">
        
      </div>
      <div className="share-budget-actions">
        <div>
          <InputButtonOutline id="edit-okay" onClick={handleShareBudget}>
            Share Budget
          </InputButtonOutline>
        </div>
        <div>
          <InputButton id="edit-cancel" onClick={onClose}>
            Cancel Share
          </InputButton>
        </div>
      </div>
    </div>
  );
};

export default ShareBudget;
