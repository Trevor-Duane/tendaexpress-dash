import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import StockAdd from "../../../components/stock/StockAdd";
import StockEdit from "../../../components/stock/StockEdit";
import { AiOutlineClose } from "react-icons/ai";
import "./StockItems.css";
import {
  InputButton,
  InputButtonBorderless,
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";
import { customStyles } from "../../../styles/tableStyles";
import StockTransfer from "../../../components/stock/StockTransfer";

const StockItems = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [isStockAddModalOpen, setIsStockAddModalOpen] = useState(false);
  const [isStockEditModalOpen, setIsStockEditModalOpen] = useState(false);
  const [isStockTransferModalOpen, setIsStockTransferModalOpen] =
    useState(false);
  const modalRef = useRef(null);

  // Fetch inventory items
  const fetchStockItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/list_stock");
      console.log("API Response:", response.data); // Debugging the API response
      return Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching stock:", error);
      return [];
    }
  };

  // Fetch and set the data when the component mounts
  useEffect(() => {
    const loadStock = async () => {
      const fetchedData = await fetchStockItems();
      setData(fetchedData);
      setDataFiltered(fetchedData);
    };
    loadStock();
  }, []);

  // Refetch inventory data after add/edit
  const refetchStock = async () => {
    const updatedData = await fetchStockItems();
    setData(updatedData);
    setDataFiltered(updatedData); // Apply the filter to the newly fetched data
  };

  /// Close modal on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsStockAddModalOpen(false);
        setIsStockEditModalOpen(false);
        setIsStockTransferModalOpen(false);
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
      await axios.delete(`http://localhost:3000/api/remove_stock/${id}`);
      console.log(`Item with ID ${id} removed successfully.`);
      refetchStock(); // Refetch the inventory to update the list
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

  //Handle filter input
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    setDataFiltered(
      data.filter((item) =>
        item.stock_item.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <h1>Stock Items</h1>
      <div className="stock-search-buttons">
        <div className="stock-search">
          <InputField
            type="text"
            placeholder="Search Stock"
            value={filterText}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <InputButtonBorderless
            onClick={() => setIsStockTransferModalOpen(true)}
          >
            Transfer Stock
          </InputButtonBorderless>
          <InputButtonOutline onClick={() => setIsStockAddModalOpen(true)}>
            Add Stock
          </InputButtonOutline>
          <InputButton onClick={() => setIsStockEditModalOpen(true)}>
            Edit Stock
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

      {isStockAddModalOpen && (
        <div className="modal" ref={modalRef}>
          <StockAdd
            onClose={() => setIsStockAddModalOpen(false)}
            refetchStock={refetchStock} // Trigger refetch after adding
          />
        </div>
      )}

      {isStockEditModalOpen && (
        <div className="modal" ref={modalRef}>
          <StockEdit
            stockItems={data}
            onClose={() => setIsStockEditModalOpen(false)}
            refetchStock={refetchStock} // Trigger refetch after editing
          />
        </div>
      )}

      {isStockTransferModalOpen && (
        <div className="modal" ref={modalRef}>
          <StockTransfer
            stockItems={data}
            onClose={() => setIsStockTransferModalOpen(false)}
            refetchStock={refetchStock} // Trigger refetch after editing
          />
        </div>
      )}
    </div>
  );
};

export default StockItems;
