// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// const BudgetScreen = () => {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState({});
//   const [totals, setTotals] = useState({});
//   const [itemQuantity, setItemQuantity] = useState(1); // State for input quantity
//   const [selectedItemId, setSelectedItemId] = useState('');

//   useEffect(() => {
//     // Fetch inventory items
//     const fetchInventoryItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/list_inventory');
//         const items = Array.isArray(response.data.data) ? response.data.data : [];
//         setInventoryItems(items);
//       } catch (error) {
//         console.error('Error fetching inventory items:', error);
//       }
//     };
//     fetchInventoryItems();
//   }, []);

//   const handleItemSelect = (e) => {
//     setSelectedItemId(e.target.value);
//   };

//   const addItemToBudget = () => {
//     const selectedItem = inventoryItems.find(item => item.id === parseInt(selectedItemId));
//     if (selectedItem) {
//       const quantity = itemQuantity;

//       if (quantity > 0) {
//         const newItem = { ...selectedItem, quantity };
//         const section = selectedItem.section || 'Uncategorized';

//         // Update the selected items by section
//         setSelectedItems(prev => {
//           const sectionItems = prev[section] || [];
//           const existingItemIndex = sectionItems.findIndex(item => item.id === newItem.id);
          
//           if (existingItemIndex >= 0) {
//             // Update quantity if item already exists
//             sectionItems[existingItemIndex].quantity += newItem.quantity;
//           } else {
//             sectionItems.push(newItem); // Add new item
//           }

//           return {
//             ...prev,
//             [section]: sectionItems,
//           };
//         });

//         // Recalculate totals
//         calculateTotals({ ...selectedItems, [section]: [...(selectedItems[section] || []), newItem] });
//         setItemQuantity(1); // Reset quantity input
//         setSelectedItemId(''); // Reset selected item
//       } else {
//         alert("Please enter a valid quantity.");
//       }
//     }
//   };

//   const calculateTotals = (items) => {
//     const sectionTotals = {};
//     for (const section in items) {
//       if (items.hasOwnProperty(section)) {
//         const sectionItems = items[section];
//         const total = sectionItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
//         sectionTotals[section] = { total, items: sectionItems };
//       }
//     }
//     setTotals(sectionTotals);
//   };

//   const exportToExcel = () => {
//     const data = Object.keys(totals).flatMap(section => {
//       return totals[section].items.map(item => ({
//         Item: item.inventory_item,
//         Quantity: item.quantity,
//         UnitPrice: item.unit_price,
//         Section: section,
//         Subtotal: (item.unit_price * item.quantity).toFixed(2),
//       }));
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'budget.xlsx');
//   };

//   return (
//     <div>
//       <h1>Create a Budget</h1>
//       <select onChange={handleItemSelect} value={selectedItemId}>
//         <option value="">Select an item</option>
//         {inventoryItems.map(item => (
//           <option key={item.id} value={item.id}>
//             {item.inventory_item} - {item.unit_price}/=
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         min="1"
//         value={itemQuantity}
//         onChange={(e) => setItemQuantity(e.target.value)}
//         placeholder="Enter quantity"
//       />
//       <button onClick={addItemToBudget}>Add to Budget</button>
//       <div>
//         <h2>Selected Items</h2>
//         {Object.keys(selectedItems).length === 0 ? (
//           <p>No items selected yet.</p>
//         ) : (
//           Object.keys(selectedItems).map(section => (
//             <div key={section}>
//               <h3>{section}</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedItems[section].map(item => (
//                     <tr key={item.id}>
//                       <td>{item.inventory_item}</td>
//                       <td>{item.quantity}</td>
//                       <td>{(item.unit_price * item.quantity).toFixed(2)}/=</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h4>Total for {section}: Shs..{totals[section]?.total.toFixed(2) || 0.00}</h4>
//             </div>
//           ))
//         )}
//         <h2>Overall Total: Shs..{Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2)}</h2>
//       </div>
//       <button onClick={exportToExcel}>Export to Excel</button>
//     </div>
//   );
// };

// export default BudgetScreen;












// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// const BudgetScreen = () => {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState({});
//   const [totals, setTotals] = useState({});
//   const [itemQuantity, setItemQuantity] = useState(1); // State for input quantity
//   const [selectedItemId, setSelectedItemId] = useState('');

//   useEffect(() => {
//     // Fetch inventory items
//     const fetchInventoryItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/list_inventory');
//         const items = Array.isArray(response.data.data) ? response.data.data : [];
//         setInventoryItems(items);
//       } catch (error) {
//         console.error('Error fetching inventory items:', error);
//       }
//     };
//     fetchInventoryItems();
//   }, []);

//   const handleItemSelect = (e) => {
//     setSelectedItemId(e.target.value);
//   };

//   const addItemToBudget = () => {
//     const selectedItem = inventoryItems.find(item => item.id === parseInt(selectedItemId));
//     if (selectedItem) {
//       const quantity = itemQuantity;

//       if (quantity > 0) {
//         const newItem = { ...selectedItem, quantity };
//         const section = selectedItem.section || 'Uncategorized';

//         // Update the selected items by section
//         setSelectedItems(prev => {
//           const sectionItems = prev[section] || [];
//           const existingItemIndex = sectionItems.findIndex(item => item.id === newItem.id);
          
//           if (existingItemIndex >= 0) {
//             // Update quantity if item already exists
//             sectionItems[existingItemIndex].quantity += newItem.quantity;
//           } else {
//             sectionItems.push(newItem); // Add new item
//           }

//           return {
//             ...prev,
//             [section]: sectionItems,
//           };
//         });

//         // Calculate totals after adding the item
//         calculateTotals({ ...selectedItems, [section]: [...(selectedItems[section] || []), newItem] });
//         setItemQuantity(1); // Reset quantity input
//         setSelectedItemId(''); // Reset selected item
//       } else {
//         alert("Please enter a valid quantity.");
//       }
//     }
//   };

//   const calculateTotals = (items) => {
//     const sectionTotals = {};
//     for (const section in items) {
//       if (items.hasOwnProperty(section)) {
//         const sectionItems = items[section];
//         const total = sectionItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
//         sectionTotals[section] = { total, items: sectionItems };
//       }
//     }
//     setTotals(sectionTotals);
//   };

//   const exportToExcel = () => {
//     const data = Object.keys(totals).flatMap(section => {
//       return totals[section].items.map(item => ({
//         Section: section,
//         Item: item.inventory_item,
//         Quantity: item.quantity,
//         UnitPrice: item.unit_price,
//         Subtotal: (item.unit_price * item.quantity).toFixed(2),
//       }));
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

//     // Add total rows for each section
//     const totalRows = Object.keys(totals).map(section => ({
//       Section: section,
//       Item: 'Total',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: totals[section].total.toFixed(2),
//     }));

//     // Add overall total row
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     totalRows.push({
//       Section: 'Overall Total',
//       Item: '',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: overallTotal,
//     });

//     // Append total rows to a new worksheet
//     const totalWorksheet = XLSX.utils.json_to_sheet(totalRows);
//     XLSX.utils.book_append_sheet(workbook, totalWorksheet, 'Totals');

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'budget.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Budget Report', 14, 10);
    
//     // Add main items to PDF
//     let y = 20;
//     Object.keys(totals).forEach(section => {
//       doc.text(section, 14, y);
//       y += 10;

//       // Prepare table data
//       const tableData = totals[section].items.map(item => [
//         item.inventory_item,
//         item.quantity,
//         item.unit_price,
//         (item.unit_price * item.quantity).toFixed(2),
//       ]);

//       autoTable(doc, {
//         head: [['Item', 'Quantity', 'Unit Price', 'Subtotal']],
//         body: tableData,
//         startY: y,
//       });

//       // Add section total
//       doc.text(`Total: $${totals[section].total.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
//       y = doc.autoTable.previous.finalY + 20; // Update y for next section
//     });

//     // Add overall total
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     doc.text(`Overall Total: $${overallTotal}`, 14, y);
    
//     doc.save('budget.pdf');
//   };

//   return (
//     <div>
//       <h1>Create a Budget</h1>
//       <select onChange={handleItemSelect} value={selectedItemId}>
//         <option value="">Select an item</option>
//         {inventoryItems.map(item => (
//           <option key={item.id} value={item.id}>
//             {item.inventory_item} - ${item.unit_price}
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         min="1"
//         value={itemQuantity}
//         onChange={(e) => setItemQuantity(e.target.value)}
//         placeholder="Enter quantity"
//       />
//       <button onClick={addItemToBudget}>Add to Budget</button>
//       <div>
//         <h2>Selected Items</h2>
//         {Object.keys(selectedItems).length === 0 ? (
//           <p>No items selected yet.</p>
//         ) : (
//           Object.keys(selectedItems).map(section => (
//             <div key={section}>
//               <h3>{section}</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedItems[section].map(item => (
//                     <tr key={item.id}>
//                       <td>{item.inventory_item}</td>
//                       <td>{item.quantity}</td>
//                       <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h4>Total for {section}: ${totals[section]?.total.toFixed(2) || 0.00}</h4>
//             </div>
//           ))
//         )}
//         <h2>Overall Total: ${Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2)}</h2>
//       </div>
//       <button onClick={exportToExcel}>Export to Excel</button>
//       <button onClick={exportToPDF}>Export to PDF</button>
//     </div>
//   );
// };

// export default BudgetScreen;



// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// const BudgetScreen = () => {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState({});
//   const [totals, setTotals] = useState({});
//   const [itemQuantity, setItemQuantity] = useState(1); // State for input quantity
//   const [selectedItemId, setSelectedItemId] = useState('');
//   const [budgetTitle, setBudgetTitle] = useState(''); // State for budget title

//   useEffect(() => {
//     // Fetch inventory items
//     const fetchInventoryItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/list_inventory');
//         const items = Array.isArray(response.data.data) ? response.data.data : [];
//         setInventoryItems(items);
//       } catch (error) {
//         console.error('Error fetching inventory items:', error);
//       }
//     };
//     fetchInventoryItems();
//   }, []);

//   const handleItemSelect = (e) => {
//     setSelectedItemId(e.target.value);
//   };

//   const addItemToBudget = () => {
//     const selectedItem = inventoryItems.find(item => item.id === parseInt(selectedItemId));
//     if (selectedItem) {
//       const quantity = itemQuantity;

//       if (quantity > 0) {
//         const newItem = { ...selectedItem, quantity };
//         const section = selectedItem.section || 'Uncategorized';

//         // Update the selected items by section
//         setSelectedItems(prev => {
//           const sectionItems = prev[section] || [];
//           const existingItemIndex = sectionItems.findIndex(item => item.id === newItem.id);
          
//           if (existingItemIndex >= 0) {
//             // Update quantity if item already exists
//             sectionItems[existingItemIndex].quantity += newItem.quantity;
//           } else {
//             sectionItems.push(newItem); // Add new item
//           }

//           return {
//             ...prev,
//             [section]: sectionItems,
//           };
//         });

//         // Calculate totals after adding the item
//         calculateTotals({ ...selectedItems, [section]: [...(selectedItems[section] || []), newItem] });
//         setItemQuantity(1); // Reset quantity input
//         setSelectedItemId(''); // Reset selected item
//       } else {
//         alert("Please enter a valid quantity.");
//       }
//     }
//   };

//   const calculateTotals = (items) => {
//     const sectionTotals = {};
//     for (const section in items) {
//       if (items.hasOwnProperty(section)) {
//         const sectionItems = items[section];
//         const total = sectionItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
//         sectionTotals[section] = { total, items: sectionItems };
//       }
//     }
//     setTotals(sectionTotals);
//   };

//   const exportToExcel = () => {
//     const data = Object.keys(totals).flatMap(section => {
//       return totals[section].items.map(item => ({
//         Section: section,
//         Item: item.inventory_item,
//         Quantity: item.quantity,
//         UnitPrice: item.unit_price,
//         Subtotal: (item.unit_price * item.quantity).toFixed(2),
//       }));
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

//     // Add total rows for each section
//     const totalRows = Object.keys(totals).map(section => ({
//       Section: section,
//       Item: 'Total',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: totals[section].total.toFixed(2),
//     }));

//     // Add overall total row
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     totalRows.push({
//       Section: 'Overall Total',
//       Item: '',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: overallTotal,
//     });

//     // Append total rows to a new worksheet
//     const totalWorksheet = XLSX.utils.json_to_sheet(totalRows);
//     XLSX.utils.book_append_sheet(workbook, totalWorksheet, 'Totals');

//     // Add budget title as a first row in the worksheet
//     const titleWorksheet = XLSX.utils.aoa_to_sheet([[budgetTitle]]);
//     XLSX.utils.book_append_sheet(workbook, titleWorksheet, 'Title');

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'budget.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Budget Report', 14, 10);
//     doc.text(budgetTitle, 14, 20); // Add budget title to the PDF
    
//     // Add main items to PDF
//     let y = 30;
//     Object.keys(totals).forEach(section => {
//       doc.text(section, 14, y);
//       y += 10;

//       // Prepare table data
//       const tableData = totals[section].items.map(item => [
//         item.inventory_item,
//         item.quantity,
//         item.unit_price,
//         (item.unit_price * item.quantity).toFixed(2),
//       ]);

//       autoTable(doc, {
//         head: [['Item', 'Quantity', 'Unit Price', 'Subtotal']],
//         body: tableData,
//         startY: y,
//       });

//       // Add section total
//       doc.text(`Total: $${totals[section].total.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
//       y = doc.autoTable.previous.finalY + 20; // Update y for next section
//     });

//     // Add overall total
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     doc.text(`Overall Total: $${overallTotal}`, 14, y);
    
//     doc.save('budget.pdf');
//   };

//   return (
//     <div>
//       <h1>Create a Budget</h1>
//       <input
//         type="text"
//         placeholder="Enter budget title"
//         value={budgetTitle}
//         onChange={(e) => setBudgetTitle(e.target.value)}
//       />
//       <select onChange={handleItemSelect} value={selectedItemId}>
//         <option value="">Select an item</option>
//         {inventoryItems.map(item => (
//           <option key={item.id} value={item.id}>
//             {item.inventory_item} - ${item.unit_price}
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         min="1"
//         value={itemQuantity}
//         onChange={(e) => setItemQuantity(e.target.value)}
//         placeholder="Enter quantity"
//       />
//       <button onClick={addItemToBudget}>Add to Budget</button>
//       <div>
//         <h2>Selected Items</h2>
//         {Object.keys(selectedItems).length === 0 ? (
//           <p>No items selected yet.</p>
//         ) : (
//           Object.keys(selectedItems).map(section => (
//             <div key={section}>
//               <h3>{section}</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedItems[section].map(item => (
//                     <tr key={item.id}>
//                       <td>{item.inventory_item}</td>
//                       <td>{item.quantity}</td>
//                       <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h4>Total for {section}: ${totals[section]?.total.toFixed(2) || 0.00}</h4>
//             </div>
//           ))
//         )}
//         <h2>Overall Total: ${Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2)}</h2>
//       </div>
//       <button onClick={exportToExcel}>Export to Excel</button>
//       <button onClick={exportToPDF}>Export to PDF</button>
//     </div>
//   );
// };

// export default BudgetScreen;


//single  header queryt

// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// const BudgetScreen = () => {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState({});
//   const [totals, setTotals] = useState({});
//   const [itemQuantity, setItemQuantity] = useState(1); // State for input quantity
//   const [selectedItemId, setSelectedItemId] = useState('');
//   const [budgetTitle, setBudgetTitle] = useState(''); // State for budget title

//   useEffect(() => {
//     // Fetch inventory items
//     const fetchInventoryItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/list_inventory');
//         const items = Array.isArray(response.data.data) ? response.data.data : [];
//         setInventoryItems(items);
//       } catch (error) {
//         console.error('Error fetching inventory items:', error);
//       }
//     };
//     fetchInventoryItems();
//   }, []);

//   const handleItemSelect = (e) => {
//     setSelectedItemId(e.target.value);
//   };

//   const addItemToBudget = () => {
//     const selectedItem = inventoryItems.find(item => item.id === parseInt(selectedItemId));
//     if (selectedItem) {
//       const quantity = itemQuantity;

//       if (quantity > 0) {
//         const newItem = { ...selectedItem, quantity };
//         const section = selectedItem.section || 'Uncategorized';

//         // Update the selected items by section
//         setSelectedItems(prev => {
//           const sectionItems = prev[section] || [];
//           const existingItemIndex = sectionItems.findIndex(item => item.id === newItem.id);
          
//           if (existingItemIndex >= 0) {
//             // Update quantity if item already exists
//             sectionItems[existingItemIndex].quantity += newItem.quantity;
//           } else {
//             sectionItems.push(newItem); // Add new item
//           }

//           return {
//             ...prev,
//             [section]: sectionItems,
//           };
//         });

//         // Calculate totals after adding the item
//         calculateTotals({ ...selectedItems, [section]: [...(selectedItems[section] || []), newItem] });
//         setItemQuantity(1); // Reset quantity input
//         setSelectedItemId(''); // Reset selected item
//       } else {
//         alert("Please enter a valid quantity.");
//       }
//     }
//   };

//   const calculateTotals = (items) => {
//     const sectionTotals = {};
//     for (const section in items) {
//       if (items.hasOwnProperty(section)) {
//         const sectionItems = items[section];
//         const total = sectionItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
//         sectionTotals[section] = { total, items: sectionItems };
//       }
//     }
//     setTotals(sectionTotals);
//   };

//   const exportToExcel = () => {
//     const data = Object.keys(totals).flatMap(section => {
//       return totals[section].items.map(item => ({
//         Section: section,
//         Item: item.inventory_item,
//         Quantity: item.quantity,
//         UnitPrice: item.unit_price,
//         Subtotal: (item.unit_price * item.quantity).toFixed(2),
//       }));
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

//     // Add total rows for each section
//     const totalRows = Object.keys(totals).map(section => ({
//       Section: section,
//       Item: 'Total',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: totals[section].total.toFixed(2),
//     }));

//     // Add overall total row
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     totalRows.push({
//       Section: 'Overall Total',
//       Item: '',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: overallTotal,
//     });

//     // Append total rows to a new worksheet
//     const totalWorksheet = XLSX.utils.json_to_sheet(totalRows);
//     XLSX.utils.book_append_sheet(workbook, totalWorksheet, 'Totals');

//     // Add budget title as a first row in the worksheet
//     const titleWorksheet = XLSX.utils.aoa_to_sheet([[budgetTitle]]);
//     XLSX.utils.sheet_add_aoa(titleWorksheet, [[budgetTitle]], { origin: 'A1' });

//     // Centering the title in Excel is not straightforward with js-xlsx
//     // You can manually adjust the title formatting after opening the file
//     XLSX.utils.book_append_sheet(workbook, titleWorksheet, 'Title');

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'budget.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(budgetTitle, 105, 10, { align: 'center' }); // Center the title

//     // Add a line break for spacing
//     doc.text('', 105, 20); // Adjust as necessary for spacing
    
//     // Add main items to PDF
//     let y = 30;
//     Object.keys(totals).forEach(section => {
//       doc.text(section, 14, y);
//       y += 10;

//       // Prepare table data
//       const tableData = totals[section].items.map(item => [
//         item.inventory_item,
//         item.quantity,
//         item.unit_price,
//         (item.unit_price * item.quantity).toFixed(2),
//       ]);

//       autoTable(doc, {
//         head: [['Item', 'Quantity', 'Unit Price', 'Subtotal']],
//         body: tableData,
//         startY: y,
//       });

//       // Add section total
//       doc.text(`Total: $${totals[section].total.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
//       y = doc.autoTable.previous.finalY + 20; // Update y for next section
//     });

//     // Add overall total
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     doc.text(`Overall Total: $${overallTotal}`, 14, y);
    
//     doc.save('budget.pdf');
//   };

//   return (
//     <div>
//       <h1>Create a Budget</h1>
//       <input
//         type="text"
//         placeholder="Enter budget title"
//         value={budgetTitle}
//         onChange={(e) => setBudgetTitle(e.target.value)}
//       />
//       <select onChange={handleItemSelect} value={selectedItemId}>
//         <option value="">Select an item</option>
//         {inventoryItems.map(item => (
//           <option key={item.id} value={item.id}>
//             {item.inventory_item} - ${item.unit_price}
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         min="1"
//         value={itemQuantity}
//         onChange={(e) => setItemQuantity(e.target.value)}
//         placeholder="Enter quantity"
//       />
//       <button onClick={addItemToBudget}>Add to Budget</button>
//       <div>
//         <h2>Selected Items</h2>
//         {Object.keys(selectedItems).length === 0 ? (
//           <p>No items selected yet.</p>
//         ) : (
//           Object.keys(selectedItems).map(section => (
//             <div key={section}>
//               <h3>{section}</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedItems[section].map(item => (
//                     <tr key={item.id}>
//                       <td>{item.inventory_item}</td>
//                       <td>{item.quantity}</td>
//                       <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h4>Total for {section}: ${totals[section]?.total.toFixed(2) || 0.00}</h4>
//             </div>
//           ))
//         )}
//         <h2>Overall Total: ${Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2)}</h2>
//       </div>
//       <button onClick={exportToExcel}>Export to Excel</button>
//       <button onClick={exportToPDF}>Export to PDF</button>
//     </div>
//   );
// };

// export default BudgetScreen;



// single and doubleline query

// import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// const BudgetScreen = () => {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState({});
//   const [totals, setTotals] = useState({});
//   const [itemQuantity, setItemQuantity] = useState(1);
//   const [selectedItemId, setSelectedItemId] = useState('');
//   const [budgetTitle, setBudgetTitle] = useState('');

//   useEffect(() => {
//     const fetchInventoryItems = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/list_inventory');
//         const items = Array.isArray(response.data.data) ? response.data.data : [];
//         setInventoryItems(items);
//       } catch (error) {
//         console.error('Error fetching inventory items:', error);
//       }
//     };
//     fetchInventoryItems();
//   }, []);

//   const handleItemSelect = (e) => {
//     setSelectedItemId(e.target.value);
//   };

//   const addItemToBudget = () => {
//     const selectedItem = inventoryItems.find(item => item.id === parseInt(selectedItemId));
//     if (selectedItem) {
//       const quantity = itemQuantity;

//       if (quantity > 0) {
//         const newItem = { ...selectedItem, quantity };
//         const section = selectedItem.section || 'Uncategorized';

//         setSelectedItems(prev => {
//           const sectionItems = prev[section] || [];
//           const existingItemIndex = sectionItems.findIndex(item => item.id === newItem.id);
          
//           if (existingItemIndex >= 0) {
//             sectionItems[existingItemIndex].quantity += newItem.quantity;
//           } else {
//             sectionItems.push(newItem);
//           }

//           return {
//             ...prev,
//             [section]: sectionItems,
//           };
//         });

//         calculateTotals({ ...selectedItems, [section]: [...(selectedItems[section] || []), newItem] });
//         setItemQuantity(1);
//         setSelectedItemId('');
//       } else {
//         alert("Please enter a valid quantity.");
//       }
//     }
//   };

//   const calculateTotals = (items) => {
//     const sectionTotals = {};
//     for (const section in items) {
//       if (items.hasOwnProperty(section)) {
//         const sectionItems = items[section];
//         const total = sectionItems.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
//         sectionTotals[section] = { total, items: sectionItems };
//       }
//     }
//     setTotals(sectionTotals);
//   };

//   const exportToExcel = () => {
//     const data = Object.keys(totals).flatMap(section => {
//       return totals[section].items.map(item => ({
//         Section: section,
//         Item: item.inventory_item,
//         Quantity: item.quantity,
//         UnitPrice: item.unit_price,
//         Subtotal: (item.unit_price * item.quantity).toFixed(2),
//       }));
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Budget');

//     const totalRows = Object.keys(totals).map(section => ({
//       Section: section,
//       Item: 'Total',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: totals[section].total.toFixed(2),
//     }));

//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     totalRows.push({
//       Section: 'Overall Total',
//       Item: '',
//       Quantity: '',
//       UnitPrice: '',
//       Subtotal: overallTotal,
//     });

//     const totalWorksheet = XLSX.utils.json_to_sheet(totalRows);
//     XLSX.utils.book_append_sheet(workbook, totalWorksheet, 'Totals');

//     // Add budget title as a first row in the worksheet
//     const titleWorksheet = XLSX.utils.aoa_to_sheet([[budgetTitle]]);
//     // Center the title row - note this won't work automatically but will be in the first row
//     XLSX.utils.sheet_add_aoa(titleWorksheet, [[budgetTitle]], { origin: 'A1' });
//     XLSX.utils.sheet_add_aoa(titleWorksheet, [[]], { origin: 'A2' }); // Add a blank row for spacing
//     XLSX.utils.book_append_sheet(workbook, titleWorksheet, 'Title');

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(blob, 'budget.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(budgetTitle, 105, 10, { align: 'center' }); // Center the title

//     // Add a line break for single spacing
//     doc.text('', 105, 15); // Single line break

//     // Add main items to PDF
//     let y = 20; // Start content a bit lower
//     Object.keys(totals).forEach(section => {
//       doc.text(section, 14, y);
//       y += 10;

//       // Prepare table data
//       const tableData = totals[section].items.map(item => [
//         item.inventory_item,
//         item.quantity,
//         item.unit_price,
//         (item.unit_price * item.quantity).toFixed(2),
//       ]);

//       autoTable(doc, {
//         head: [['Item', 'Quantity', 'Unit Price', 'Subtotal']],
//         body: tableData,
//         startY: y,
//       });

//       // Add section total
//       doc.text(`Total: $${totals[section].total.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
//       y = doc.autoTable.previous.finalY + 15; // Adjust for next section with a little space
//     });

//     // Add overall total
//     const overallTotal = Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2);
//     doc.text(`Overall Total: $${overallTotal}`, 14, y);
    
//     doc.save('budget.pdf');
//   };

//   return (
//     <div>
//       <h1>Create a Budget</h1>
//       <input
//         type="text"
//         placeholder="Enter budget title"
//         value={budgetTitle}
//         onChange={(e) => setBudgetTitle(e.target.value)}
//       />
//       <select onChange={handleItemSelect} value={selectedItemId}>
//         <option value="">Select an item</option>
//         {inventoryItems.map(item => (
//           <option key={item.id} value={item.id}>
//             {item.inventory_item} - ${item.unit_price}
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         min="1"
//         value={itemQuantity}
//         onChange={(e) => setItemQuantity(e.target.value)}
//         placeholder="Enter quantity"
//       />
//       <button onClick={addItemToBudget}>Add to Budget</button>
//       <div>
//         <h2>Selected Items</h2>
//         {Object.keys(selectedItems).length === 0 ? (
//           <p>No items selected yet.</p>
//         ) : (
//           Object.keys(selectedItems).map(section => (
//             <div key={section}>
//               <h3>{section}</h3>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Item</th>
//                     <th>Quantity</th>
//                     <th>Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedItems[section].map(item => (
//                     <tr key={item.id}>
//                       <td>{item.inventory_item}</td>
//                       <td>{item.quantity}</td>
//                       <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <h4>Total for {section}: ${totals[section]?.total.toFixed(2) || 0.00}</h4>
//             </div>
//           ))
//         )}
//         <h2>Overall Total: ${Object.values(totals).reduce((acc, section) => acc + section.total, 0).toFixed(2)}</h2>
//       </div>
//       <button onClick={exportToExcel}>Export to Excel</button>
//       <button onClick={exportToPDF}>Export to PDF</button>
//     </div>
//   );
// };

// export default BudgetScreen;


//to remove and edit items in the budget

