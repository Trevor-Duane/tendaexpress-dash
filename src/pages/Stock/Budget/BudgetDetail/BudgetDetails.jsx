import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Ensure axios is imported
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai"; // Icons for expand/collapse
import {
  InputButton,
  InputButtonOutline,
} from "../../../../components/Form/FormComponents";
import "./BudgetDetails.css";
import { StoreContext } from "../../../../Context/StoreContext";
import { exportToPDF } from "../../../../service/ExportService";

const BudgetDetails = ({ budget, goBack }) => {
  const MySwal = withReactContent(Swal);

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [expandedSections, setExpandedSections] = useState({}); // Track expanded sections
  const [updatingStatus, setUpdatingStatus] = useState(false); // For handling status update loading
  const [status, setStatus] = useState(budget.budget_status); // For tracking status

  const { user, apiUrl } = useContext(StoreContext); // Get user from context
  // const userInfo  = JSON.parse(localStorage.getItem("userInfo"))

  console.log("user at budget details", user);
  // console.log("userinfo at budget details", userInfo);

  // Fetch budget details for the clicked budget using budgetId
  const fetchBudgetDetails = async (id) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/budget/${id}/details`
      );
      console.log("details", response.data.data);
      return response.data.data; // Assuming the API returns an array of budget items in data
    } catch (error) {
      console.error("Error fetching budget details:", error);
      return [];
    }
  };

  // Group details by section
  const groupBySection = (details) => {
    return details.reduce((acc, item) => {
      const section = item.section || "Uncategorized"; // Fallback to "Uncategorized" if section is missing
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {});
  };

  // Component to display details of a selected budget
  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const fetchedDetails = await fetchBudgetDetails(budget.id); // Use budget.id to fetch related items
      setDetails(fetchedDetails);
      setLoading(false);

      // Initialize all sections to be expanded by default
      const sections = groupBySection(fetchedDetails);
      const expanded = Object.keys(sections).reduce((acc, section) => {
        acc[section] = true; // Set each section to true for expanded state
        return acc;
      }, {});
      setExpandedSections(expanded);
    };
    loadDetails();
  }, [budget.id]);

  // Format items grouped by section into rows
  const groupedDetails = groupBySection(details);

  // Toggle section visibility
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to handle budget status update based on selected status
  const budgetStatusHandler = async (e) => {
    const selectedStatus = e.target.value;

    // Show SweetAlert2 confirmation dialog
    MySwal.fire({
      title: `Are you sure?`,
      text: `You are about to update the budget status to "${selectedStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#663399",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUpdatingStatus(true); 

          const response = await axios.post(
            `${apiUrl}/api/budget_status`,
            {
              id: budget.id,
              budget_status: selectedStatus,
            }
          );

          if (response.data.success) {
            setStatus(selectedStatus); 
            toast.success(`Budget status updated to ${selectedStatus}`);
            goBack();
          } else {
            toast.error("Failed to update the budget status");
          }
        } catch (error) {
          console.error("Error updating budget status:", error);
          toast.error("An error occurred while updating the status.");
        } finally {
          setUpdatingStatus(false); 
        }
      }
    });
  };

  return (
    <>
      <div className="budgetDetailPageHeaderWrapper">
        <h1>Budget Details ({budget.budget_head})</h1>
      </div>
      <div className="content-page">
        <div className="budget-details-header">
          <div className="budget-details-details">
            <p>
              Budget Total: <span className="budget-detail-total">{budget.budget_total.toLocaleString("en-US")}/=</span>
            </p>
            <p>
              Status: <span className={`status-${status} budget-detail-status`}>{status}</span>
            </p>
          </div>
          <div className="budget_details_buttons">
            <div>
              <select
                value={status}
                onChange={budgetStatusHandler}
                disabled={updatingStatus}
                className="mycustom-select"
              >
                <option value="" disabled>
                  Change Budget Status
                </option>
                {/* Conditionally render options based on user permissions */}
                {/* {user.permissions.includes("acknowledge_budget_reciept") && (
                  <option value="Recieved">Acknowledge Receipt</option>
                )} */}
                <option value="New">New budget</option> 
                <option value="Recieved">Acknowledge Receipt</option> 
                <option value="Accepted">Accept Budget</option>
                <option value="Rejected">Reject Budget</option>
                <option value="Approved">Approve Budget</option>
              </select>
            </div>
            <div>
              <InputButton onClick={goBack}>Go Back</InputButton>
            </div>
            <div>
              <InputButtonOutline onClick={() => exportToPDF(budget.id, apiUrl)}>PDF</InputButtonOutline>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading budget details...</p>
        ) : Object.keys(groupedDetails).length === 0 ? (
          <p>No items found for this budget.</p>
        ) : (
          <div>
            {Object.keys(groupedDetails).map((section) => {
              const items = groupedDetails[section];
              const sectionTotal = items.reduce(
                (total, item) => total + item.total,
                0
              ); // Calculate section total

              return (
                <div key={section}>
                  <div
                    className="section-header"
                    onClick={() => toggleSection(section)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3>{section}</h3>
                    {expandedSections[section] ? (
                      <AiOutlineArrowUp />
                    ) : (
                      <AiOutlineArrowDown />
                    )}
                  </div>
                  {expandedSections[section] && ( // Render items only if section is expanded
                    <table className="budget-details-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Unit of Measure</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.item_name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.uom}</td>
                            <td>
                              {Intl.NumberFormat("en-US").format(
                                item.unit_price
                              )}
                              /=
                            </td>
                            <td>
                              {Intl.NumberFormat("en-US").format(item.total)}/=
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td
                            colSpan="4"
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            Section Total:
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {Intl.NumberFormat("en-US").format(
                              sectionTotal.toFixed(2)
                            )}
                            /=
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  <hr style={{ margin: "20px 0" }} />{" "}
                  {/* Horizontal separator */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default BudgetDetails;
