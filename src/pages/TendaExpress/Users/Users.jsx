import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiOutlineClose } from "react-icons/ai";
import { customStyles } from "../../../styles/tableStyles";
import { StoreContext } from "../../../Context/StoreContext";
import './Users.css';

const Users = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const { apiUrl } = React.useContext(StoreContext);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/users`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching users:", error);
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

  // Handle row click to expand and show form
  const handleRowClick = (row) => {
    setExpandedRow(row.id);
    setFormData({
      username: row.username,
      email: row.email,
      mobile: row.mobile,
      address: row.address,
      isVerified: row.isVerified,
    });
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for updates
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${apiUrl}/api/users/${expandedRow}`, formData);
      if (response.status === 200) {
        const updatedUsers = data.map((user) =>
          user.id === expandedRow ? { ...user, ...formData } : user
        );
        setData(updatedUsers);
        setDataFiltered(updatedUsers);
        setExpandedRow(null); // Close the form after updating
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
        onRowClicked={handleRowClick} // Handle row click
      />

      {/* Form for updating user details */}
      {expandedRow && (
        <div className="user-form">
          <h3>Update User</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Mobile:</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Verified:</label>
              <select
                name="isVerified"
                value={formData.isVerified}
                onChange={handleChange}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <button type="button" onClick={handleSubmit}>Update</button>
              <button
                type="button"
                onClick={() => setExpandedRow(null)}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Users;
