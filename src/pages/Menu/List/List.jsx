import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import "./List.css";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import { customStyles } from "../../../styles/tableStyles";
import { InputField } from "../../../components/Form/FormComponents";
import ExpandableMenuItemRow from "../../../components/MenuSection/MenuItems/ExpandableMenuItemRow";

const List = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [expandedRowData, setExpandedRowData] = useState({}); // To store fetched recipe data
  const [loading, setLoading] = useState(false); // Loading state for expanded row

  const { apiUrl } = React.useContext(StoreContext);

  // Fetch menu items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/items`);
      console.log("API Response:", response.data);
      return Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }
  };

  // Fetch and set the data when the component mounts
  useEffect(() => {
    const loadStore = async () => {
      const fetchedData = await fetchList();
      setData(fetchedData);
      setDataFiltered(fetchedData);
    };
    loadStore();
  }, []);

  const removeFood = async (foodId) => {
    const response = await axios.post(`${apiUrl}/api/remove-item`, {
      id: foodId,
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      with: "10px",
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          src={`${apiUrl}/images/${row.item_image}`}
          alt={row.item_name}
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      name: "Item Name",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Subcategory",
      selector: (row) => row.subcategory.subcategory_name,
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => {
        const formattedPrice = Intl.NumberFormat("en-US").format(
          row.item_price
        );
        return `${formattedPrice}/=`;
      },
    },

    {
      name: "Item Status",
      selector: (row) => row.item_status,
      sortable: true,
    },

    {
      name: "Item Ratings",
      selector: (row) => row.item_rating,
      sortable: true,
    },
  ];

  // Fetch recipe data based on row ID when row is expanded
  const fetchRecipeById = async (id) => {
    setLoading(true); // Set loading state
    try {
      const response = await axios.get(`${apiUrl}/api/recipes/${id}`);
      console.log("Recipe response", response);
      setExpandedRowData((prevData) => ({
        ...prevData,
        [id]: response.data.data, // Store the fetched recipe data for the specific row ID
      }));
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Handle filter input
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setDataFiltered(
      data.filter((item) =>
        item.item_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };
  return (
    <>
      <div className="menuPageHeaderWrapper">
        <h1>Products List</h1>
      </div>
      <div className="list add flex-col content-page">
        <div className="data-table-search">
          <div>
            <InputField
              type="text"
              placeholder="Search Inventory"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          <div></div>

          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={dataFiltered}
            pagination
            highlightOnHover
            expandableRows
            expandableRowsComponent={({ data }) => {
              const rowId = data.id;

              // Fetch data for expanded row if not already fetched
              if (!expandedRowData[rowId]) {
                fetchRecipeById(rowId); // Fetch recipe data using row ID
              }

              return (
                <ExpandableMenuItemRow
                  data={expandedRowData[rowId]}
                  loading={loading}
                />
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default List;
