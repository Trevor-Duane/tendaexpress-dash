import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../styles/tableStyles";
import './Promos.css'

const Promos = () => {


  const [dataFiltered, setDataFiltered] = useState([]);
  // Define the columns
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Item Name",
      selector: (row) => row.stock_item,
      sortable: true,
    },
    {
      name: "UOM",
      selector: (row) => row.uom,
      sortable: true,
    },
    {
      name: "Portions In Stock",
      selector: (row) => row.portions_in_stock,
      sortable: true,
    },
    {
      name: "Portion Price",
      selector: (row) => row.portion_price,
      sortable: true,
    },
    {
      name: "Stock Price",
      selector: (row) => row.stock_price,
      sortable: true,
    },
    {
      name: "Reorder Level",
      selector: (row) => row.reorder_level,
      sortable: true,
    },
    {
      name: "Section",
      selector: (row) => row.section,
      sortable: true,
    },

    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Tags",
      selector: (row) => row.tag,
      sortable: true,
    },
    {
      name: "Manage",
      cell: (row) => (
        <button className="remove-button" onClick={() => removeItem(row.id)}>
          <AiOutlineClose size={18} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  return (
    <>
      <div className="content-page">Promos</div>
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={dataFiltered}
        pagination
        highlightOnHover
      />
    </>
  );
};

export default Promos;
