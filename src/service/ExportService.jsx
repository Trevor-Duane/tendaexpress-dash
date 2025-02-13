import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

/**
 * Fetches budget details and exports them to a PDF document.
 * @param {string} budgetId - The ID of the budget to export.
 * @param {string} apiUrl - The base URL of the API.
 */
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

    // Define section order for grouping
    const sectionOrder = ["Bar", "Kitchen", "Service", "Other Items"];

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

    // Sort sections based on predefined order
    const sortedSections = sectionOrder.filter((section) => groupedDetails[section]);

    // Initialize jsPDF document
    const doc = new jsPDF();
    const formattedDate = new Date(budget.createdAt).toLocaleString(); 

    // Set font for the entire document
    doc.setFont("helvetica");

    // Add budget title (center-aligned)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${budget.budget_head}`;
    const createdAt = `Created At: ${formattedDate}`;

    // Center-align the title
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    // Add creation date below the title (center-aligned)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(createdAt, pageWidth / 2, 27, { align: "center" });

    // Prepare table data
    let tableData = [];

    sortedSections.forEach((section) => {
      // Add section header (bold and center-aligned)
      tableData.push([
        { content: `${section}`, colSpan: 5, styles: { fontStyle: "bold", halign: "center" } },
      ]);

      // Add section items
      groupedDetails[section].forEach((item) => {
        tableData.push([item.item_name, item.uom, item.quantity, parseFloat(item.unit_price).toLocaleString(), parseFloat(item.total).toLocaleString()]);
      });

      // Add section total (bold)
      tableData.push([
        { content: "Section Total:", colSpan: 4, styles: { fontStyle: "bold" } },
        { content: `${sectionTotals[section].toLocaleString()}`, styles: { fontStyle: "bold" } },
      ]);
    });

    // Generate the table
    autoTable(doc, {
      startY: 35, // Start table below the title and date
      head: [["Item Name", "UOM", "Quantity", "Unit Price", "Total Amount"]],
      body: tableData,
      styles: { lineColor: [0, 0, 0], lineWidth: 0.2, fontSize: 10 },
      headStyles: { textColor: [0, 0, 0], fontStyle: "bold" },
      theme: "plain", // Clean and minimal table design
    });

    // Add grand total below the table, aligned to the right
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Calculate the X-coordinate for right alignment
    const grandTotalText = `Budget Total: ${grandTotal.toLocaleString()} /=`;
    const textWidth = doc.getStringUnitWidth(grandTotalText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const rightMargin = 14; // Right margin for alignment
    const xCoordinate = pageWidth - textWidth - rightMargin;

    doc.text(grandTotalText, xCoordinate, finalY);

    // Save the PDF with a descriptive filename
    doc.save(`Budget_${budget.budget_head}.pdf`);
  } catch (error) {
    console.error("Error exporting budget PDF:", error);
  }
};