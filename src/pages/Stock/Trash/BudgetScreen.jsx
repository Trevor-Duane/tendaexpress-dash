import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import "./BudgetScreen.css";
import { StoreContext } from "../../../Context/StoreContext";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";

const BudgetScreen = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totals, setTotals] = useState({});
  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [budgetTitle, setBudgetTitle] = useState("");

  const {apiUrl} = React.useContext(StoreContext)

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/list_inventory`
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

  const exportToExcel = () => {
    const data = Object.keys(totals).flatMap((section) => {
      return totals[section].items.map((item) => ({
        Section: section,
        Item: item.inventory_item,
        Quantity: item.quantity,
        UnitPrice: item.unit_price,
        Subtotal: (item.unit_price * item.quantity).toFixed(2),
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");

    const totalRows = Object.keys(totals).map((section) => ({
      Section: section,
      Item: "Total",
      Quantity: "",
      UnitPrice: "",
      Subtotal: totals[section].total.toFixed(2),
    }));

    const overallTotal = Object.values(totals)
      .reduce((acc, section) => acc + section.total, 0)
      .toFixed(2);
    totalRows.push({
      Section: "Overall Total",
      Item: "",
      Quantity: "",
      UnitPrice: "",
      Subtotal: overallTotal,
    });

    const totalWorksheet = XLSX.utils.json_to_sheet(totalRows);
    XLSX.utils.book_append_sheet(workbook, totalWorksheet, "Totals");

    // Add budget title as a first row in the worksheet
    const titleWorksheet = XLSX.utils.aoa_to_sheet([[budgetTitle]]);
    // Center the title row - note this won't work automatically but will be in the first row
    XLSX.utils.sheet_add_aoa(titleWorksheet, [[budgetTitle]], { origin: "A1" });
    XLSX.utils.sheet_add_aoa(titleWorksheet, [[]], { origin: "A2" }); // Add a blank row for spacing
    XLSX.utils.book_append_sheet(workbook, titleWorksheet, "Title");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "budget.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(budgetTitle, 105, 10, { align: "center" }); // Center the title

    // Add a line break for single spacing
    doc.text("", 105, 15); // Single line break

    // Add main items to PDF
    let y = 16; // Start content a bit lower
    Object.keys(totals).forEach((section) => {
      doc.text(section, 14, y);
      y += 10;

      // Prepare table data
      const tableData = totals[section].items.map((item) => [
        item.inventory_item,
        item.quantity,
        item.unit_price,
        (item.unit_price * item.quantity).toFixed(2),
      ]);

      autoTable(doc, {
        head: [["Item", "Quantity", "Unit Price", "Subtotal"]],
        body: tableData,
        startY: y,
      });

      // Add section total
      doc.text(
        `Total: ${totals[section].total.toFixed(2)}/=`,
        14,
        doc.autoTable.previous.finalY + 10
      );
      y = doc.autoTable.previous.finalY + 15; // Adjust for next section with a little space
    });

    // Add overall total
    const overallTotal = Object.values(totals)
      .reduce((acc, section) => acc + section.total, 0)
      .toFixed(2);
    doc.text(`Overall Total: ${overallTotal}/=`, 14, y);

    doc.save("budget.pdf");
  };

  return (
    <div>
      <h1>Create a Budget</h1>
      <div className="budget-name-field">
        <InputField
          type="text"
          placeholder="Enter budget title"
          value={budgetTitle}
          onChange={(e) => setBudgetTitle(e.target.value)}
        />
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
                {item.inventory_item} - {item.unit_price}/=
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
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems[section].map((item) => (
                    <tr key={item.id}>
                      <td>{item.inventory_item}</td>
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
      <div className="export-buttons">
        <InputButtonOutline onClick={exportToExcel}>
          Export to Excel
        </InputButtonOutline>
        <InputButton onClick={exportToPDF}>Export to PDF</InputButton>
      </div>
    </div>
  );
};

export default BudgetScreen;
