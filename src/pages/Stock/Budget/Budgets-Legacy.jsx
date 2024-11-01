import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../styles/tableStyles";
import CreateBudget from "../../../components/StockSection/Budget/CreateBudget";
import BudgetDetails from "./BudgetDetail/BudgetDetails";
import {
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";
import "./Budget.css";
import EditBudget from "../../../components/StockSection/Budget/EditBudget";

const Budgets = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBudgetEditModalOpen, setIsBudgetEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // Tracks which tab is active (draft or active budgets)
  const modalRef = useRef(null);

  // Fetch active budgets from the budgets table
  const fetchActiveBudgets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/budgets");
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching active budgets:", error);
      return [];
    }
  };

  // Fetch draft budgets from the budget_drafts table
  const fetchDraftBudgets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/budget_drafts"
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching draft budgets:", error);
      return [];
    }
  };

  // Load budgets based on active tab
  const loadBudgets = async () => {
    const fetchedData =
      activeTab === "active"
        ? await fetchActiveBudgets()
        : await fetchDraftBudgets();
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

  // Handle tab switch between draft and active budgets
  const handleTabSwitch = (tab) => {
    setActiveTab(tab); // Set the active tab
    setSelectedBudget(null); // Clear any selected budget
  };

  // Close the modal and refetch data
  const handleGoBack = async () => {
    setSelectedBudget(null);
    loadBudgets(); // Refetch the data based on the active tab
  };

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
    ...(activeTab === "draft"
      ? [
          {
            name: "Actions",
            cell: (row) => (
              <button
              className="budget-edit-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the row click from firing
                  setCurrentBudget(row.id);
                  setIsBudgetEditModalOpen(true);
                }}
              >
                Edit
              </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          },
        ]
      : []),
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
            {/* Tabs for Draft Budgets and Active Budgets */}
            <div className="budget-tabs">
              <button
                className={activeTab === "active" ? "tab-active" : "tab"}
                onClick={() => handleTabSwitch("active")}
              >
                Active Budgets
              </button>
              <button
                className={activeTab === "draft" ? "tab-active" : "tab"}
                onClick={() => handleTabSwitch("draft")}
              >
                Draft Budgets
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
                Create New Budget
              </InputButtonOutline>
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

            {/* {Modal for editing an existing budget} */}
            {isBudgetEditModalOpen && (
              <div className="budget-modal" ref={modalRef}>
                <EditBudget
                  budgetId={currentBudget}
                  onClose={() => setIsBudgetEditModalOpen(false)}
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
