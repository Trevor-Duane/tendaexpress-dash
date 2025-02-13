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
    const budgetItems = detailsResponse.data.data;

    // Group budget details by section and calculate section totals
    const groupedDetails = {};
    const sectionTotals = {};
    let grandTotal = 0;

    budgetItems.forEach((item) => {
      if (!groupedDetails[item.section]) {
        groupedDetails[item.section] = [];
        sectionTotals[item.section] = 0;
      }
      groupedDetails[item.section].push(item);
      sectionTotals[item.section] += parseFloat(item.total);
      grandTotal += parseFloat(item.total);
    });

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add budget title
    doc.setFontSize(14);
    doc.text(`Budget Details - ${budget.budget_head}`, 10, 10);

    // Loop through sections and add tables
    let startY = 20;
    Object.keys(groupedDetails).forEach((section) => {
      doc.setFontSize(12);
      doc.text(`${section}`, 10, startY);
      
      autoTable(doc, {
        startY: startY + 5,
        head: [["Item Name", "Quantity", "UOM", "Price", "Total"]],
        body: [
          ...groupedDetails[section].map((item) => [
            item.item_name,
            item.quantity,
            item.uom,
            item.unit_price,
            item.total,
          ]),
          ["Section Total:", "", "", "", sectionTotals[section].toFixed(2)], // Section total row
        ],
        styles: {
          lineColor: [0, 0, 0], // Black borders
          lineWidth: 0.5,
          fillColor: false, // No background
          textColor: [0, 0, 0], // Black text
        },
        headStyles: {
          fillColor: false, // No background for headers
          textColor: [0, 0, 0], // Black text for headers
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
        },
        theme: "grid", // Ensures visible borders
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    // Add Grand Total at the end
    doc.setFontSize(14);
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 10, startY);

    // Save the PDF
    doc.save(`Budget_${budget.budget_head}.pdf`);
  } catch (error) {
    console.error("Error exporting budget PDF:", error);
  }
};
