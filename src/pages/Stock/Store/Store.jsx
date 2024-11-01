import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../styles/tableStyles";
import InventoryAdd from "../../../components/StockSection/Inventory/InventoryAdd";
import InventoryEdit from "../../../components/StockSection/Inventory/InventoryEdit";
import "./Store.css";
import {
  InputButton,
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";

const Store = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Fetch inventory items
  const fetchStoreItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/store_items");
      console.log("API Response:", response.data); // Debugging the API response
      return Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }
  };

  // Fetch and set the data when the component mounts
  useEffect(() => {
    const loadStore = async () => {
      const fetchedData = await fetchStoreItems();
      setData(fetchedData);
      setDataFiltered(fetchedData);
    };
    loadStore();
  }, []);

  // Refetch inventory data after add/edit
  const refetchStore = async () => {
    const updatedData = await fetchStoreItems();
    setData(updatedData);
    setDataFiltered(updatedData); // Apply the filter to the newly fetched data
  };

  /// Close modal on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  // Remove item function
  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/remove_inventory/${id}`);
      console.log(`Item with ID ${id} removed successfully.`);
      refetchStore(); // Refetch the inventory to update the list
    } catch (error) {
      console.error("Error removing item:", error);
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
      name: "Item Name",
      selector: (row) => row.item_name,
      sortable: true,
    },
    {
      name: "Section",
      selector: (row) => row.section,
      sortable: true,
    },
    {
      name: "Amount in Store",
      selector: (row) => {
        const formattedAmount = row.amount_in_store;

        return `${formattedAmount}g`;
      },
      sortable: true,
    },
    {
      name: "Reorder Level",
      selector: (row) => {
        const reorderLevel = row.reorder_level;

        return `${reorderLevel}g`;
      },
      sortable: true,
    },
    {
      name: "UOM",
      selector: (row) => {
        const formattedUOM = row.uom;

        return `(${formattedUOM})`;
      },
      sortable: true,
    },
  ];

  // Handle filter input
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setDataFiltered(
      data.filter((item) =>
        item.inventory_item.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="storePageHeaderWrapper">
        <h1>Store Items</h1>
      </div>
      <div className="content-page">
        <div className="store-search-buttons">
          <div>
            <InputField
              type="text"
              placeholder="Search Inventory"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <InputButtonOutline onClick={() => setIsAddModalOpen(true)}>
              Replenish Store
            </InputButtonOutline>

            <InputButton onClick={() => setIsEditModalOpen(false)}>
              Edit Item
            </InputButton>
          </div>
        </div>
        <DataTable
          customStyles={customStyles}
          columns={columns}
          data={dataFiltered}
          pagination
          highlightOnHover
        />

        {isAddModalOpen && (
          <div className="inventory-modal" ref={modalRef}>
            <InventoryAdd
              onClose={() => setIsAddModalOpen(false)}
              refetchStore={refetchStore} // Trigger refetch after adding
            />
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal" ref={modalRef}>
            <InventoryEdit
              inventoryItems={data}
              onClose={() => setIsEditModalOpen(false)}
              refetchStore={refetchStore} // Trigger refetch after editing
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Store;
