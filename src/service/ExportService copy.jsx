import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// Function to fetch budget details and export to PDF
export const exportToPDF = async (budgetId, apiUrl) => {
  try {
    // Fetch budget header
    const budgetResponse = await axios.get(`${apiUrl}/api/budgets`);
    const allBudgets = budgetResponse.data.data;
    const budget = allBudgets.find((b) => b.id === budgetId);

    if (!budget) {
      console.error("Budget not found");
      return;
    }

    // Fetch budget items
    const detailsResponse = await axios.get(`${apiUrl}/api/budget/${budgetId}/details`);
    const budgetItems = detailsResponse.data.data; // No need to call `.json()` on Axios responses

    // Group budget details by section
    const groupedDetails = budgetItems.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add budget title
    doc.text(`Budget Details - ${budget.budget_head}`, 10, 10);

    // Loop through sections and add tables
    let startY = 20;
    Object.keys(groupedDetails).forEach((section) => {
      doc.text(`${section}`, 10, startY);
      autoTable(doc, {
        startY: startY + 5,
        head: [["Item Name", "Quantity", "UOM", "Price", "Total"]],
        body: groupedDetails[section].map((item) => [
          item.item_name,
          item.quantity,
          item.uom,
          item.unit_price,
          item.total,
        ]),
      });
      startY = doc.lastAutoTable.finalY + 10; // Adjust for next table
    });

    // Save the PDF
    doc.save(`Budget_${budget.budget_head}.pdf`);
  } catch (error) {
    console.error("Error exporting budget PDF:", error);
  }
};
