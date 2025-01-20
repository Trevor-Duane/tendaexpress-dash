import React from "react";
import "./Reports.css";

const Reports = () => {
  return (
    <div className="reports-page">
      <h1 className="page-title">Reports Overview</h1>
      <div className="filters">
        <select className="filter-select">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input type="date" className="filter-date" />
        <button className="filter-btn">Apply Filters</button>
      </div>

      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Report Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01/01/2025</td>
              <td>Sales Report</td>
              <td>Completed</td>
              <td><button className="download-btn">Download</button></td>
            </tr>
            <tr>
              <td>02/01/2025</td>
              <td>Inventory Report</td>
              <td>Pending</td>
              <td><button className="download-btn">Download</button></td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
