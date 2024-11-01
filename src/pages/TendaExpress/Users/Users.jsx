import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiOutlineClose } from "react-icons/ai";
import { customStyles } from "../../../styles/tableStyles";
import './Users.css'

const Users = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);


  // Fetch inventory items
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      console.log("API Response:", response.data); // Debugging the API response
      return Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching stock:", error);
      return [];
    }
  };

   // Fetch and set the data when the component mounts
   useEffect(() => {
    const loadUsers = async () => {
      const fetchedData = await fetchUsers();
      setData(fetchedData);
      setDataFiltered(fetchedData);
    };
    loadUsers();
  }, []);


  // Define the columns
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "isVerified",
      selector: (row) => row.isVerified,
      sortable: true,
    },
    {
      name: "Last Active",
      selector: (row) => row.isVerified,
      sortable: true,
    },
    {
      name: "Device",
      selector: (row) => "Android",
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
      <div className="content-page">Users</div>
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

export default Users