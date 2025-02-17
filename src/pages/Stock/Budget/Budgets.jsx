import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../styles/tableStyles";
import CreateBudget from "../../../components/StockSection/Budget/CreateBudget";
import BudgetDetails from "./BudgetDetail/BudgetDetails";
import { StoreContext } from "../../../Context/StoreContext";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";
import "./Budget.css";
import EditBudget from "../../../components/StockSection/Budget/EditBudget";
import CreateAddendum from "../../../components/StockSection/Addendum/CreateAddendum";

const Budgets = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBudgetEditModalOpen, setIsBudgetEditModalOpen] = useState(false);
  const [isAddendumModalOpen, setIsAddendumModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [activeTab, setActiveTab] = useState("weekly"); // Default to 'weekly' tab
  const modalRef = useRef(null);

  const {apiUrl} = React.useContext(StoreContext)

  // Fetch weekly budgets
  const fetchWeeklyBudgets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/budgets`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching weekly budgets:", error);
      return [];
    }
  };

  // Fetch additional budgets
  const fetchAdditionalBudgets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/addendum_budgets`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching additional budgets:", error);
      return [];
    }
  };

  // Load budgets based on active tab
  const loadBudgets = async () => {
    const fetchedData =
      activeTab === "weekly"
        ? await fetchWeeklyBudgets()
        : await fetchAdditionalBudgets();
    setData(fetchedData);
    setDataFiltered(fetchedData);
  };

  // Fetch and set the data when the component mounts or when the active tab changes
  useEffect(() => {
    loadBudgets();
  }, [activeTab]);

  // Handle row click to view budget details
  const handleRowClick = (row) => {
    setSelectedBudget(row);
  };

  // Handle tab switch between weekly and additional budgets
  const handleTabSwitch = (tab) => {
    setActiveTab(tab); // Set the active tab
    setSelectedBudget(null); // Clear any selected budget
  };

  // Close the modal and refetch data
  const handleGoBack = async () => {
    setSelectedBudget(null);
    loadBudgets(); // Refetch the data based on the active tab
  };

  const handleReload = () => {
    loadBudgets();
    toast.info("Budgets List Reloaded.");
  };

  const shareCurrentBudget = async (budget_id)=> {
    try {
     const shareResponse = await axios.post(`${apiUrl}/api/share_budget`, {budget_id})
     toast.info("Budget Shared Successfully");
    } catch (error) {
      console.error("Error sharing budget:", error);
    }
  }

  // Define columns for the DataTable
  const columns = [
    { name: "Budget Head", selector: (row) => row.budget_head, sortable: true },
    {
      name: "Budget Total",
      selector: (row) =>
        `${Intl.NumberFormat("en-US").format(row.budget_total)}/=`,
      sortable: true,
    },
    { name: "Created By", selector: (row) => row.created_by, sortable: true },
    { name: "Remarks", selector: (row) => row.remarks, sortable: true },
    {
      name: "Budget Status",
      selector: (row) => row.budget_status,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="budget-actions-buttons">
          <button
          className="budget-edit-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the row click from firing
            setCurrentBudget(row.id);
            setIsBudgetEditModalOpen(true);
          }}
        >
          <img src={assets.editt} alt=""/>
          {/* Edit */}
        </button>

        <button
          className="budget-edit-button"
          onClick={(e) => {
            e.stopPropagation();
            shareCurrentBudget(row.id)
          }}
        >
          <img src={assets.network} alt=""/>
        </button>
        </div>
        
      ),
      ignoreRowClick: true,
      // allowOverflow: true,
      // button: true,
    },
  ];

  // Handle filter input
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setDataFiltered(
      data.filter((item) =>
        item.budget_head.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  // Close the create budget modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsCreateModalOpen(false);
        setIsBudgetEditModalOpen(false);
        setIsAddendumModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div>
      {selectedBudget ? (
        <BudgetDetails budget={selectedBudget} goBack={handleGoBack} />
      ) : (
        <div>
          <div className="budgetPageHeaderWrapper">
            <h1>Budgets</h1>
          </div>

          <div className="content-page">
            {/* Tabs for Weekly Budgets and Additional Budgets */}
            <div className="budget-tabs">
              <button
                className={activeTab === "weekly" ? "tab-active" : "tab"}
                onClick={() => handleTabSwitch("weekly")}
              >
                Weekly Budgets
              </button>
              <button
              disabled
                className={activeTab === "additional" ? "tab-active" : "tab"}
                onClick={() => handleTabSwitch("additional")}
              >
                Addendum Budgets
              </button>
            </div>

            {/* Search and buttons */}
            <div className="budget-search-buttons">
              <div>
              <InputField
                type="text"
                placeholder="Search Budget"
                value={filterText}
                onChange={handleFilterChange}
              />
              </div>
              <div>
              <InputButtonOutline onClick={() => setIsCreateModalOpen(true)}>
                New Budget
              </InputButtonOutline>
              <InputButton onClick={() => handleReload()}>
                Refresh List
              </InputButton>
              </div>
            </div>

            {/* DataTable to display budgets */}
            <DataTable
              customStyles={customStyles}
              columns={columns}
              data={dataFiltered}
              onRowClicked={handleRowClick}
              pagination
              pointerOnHover
              highlightOnHover
            />

            {/* Modal for creating a new budget */}
            {isCreateModalOpen && (
              <div className="budget-modal" ref={modalRef}>
                <CreateBudget onClose={() => setIsCreateModalOpen(false)} />
              </div>
            )}

            {/* Modal for editing an existing budget */}
            {isBudgetEditModalOpen && (
              <div className="budget-modal" ref={modalRef}>
                <EditBudget
                  budgetId={currentBudget}
                  onClose={() => setIsBudgetEditModalOpen(false)}
                />
              </div>
            )}

            {/* Modal for editing an existing budget */}
            {isAddendumModalOpen && (
              <div className="budget-modal" ref={modalRef}>
                <CreateAddendum
                  budgetId={currentBudget}
                  onClose={() => setIsAddendumModalOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
