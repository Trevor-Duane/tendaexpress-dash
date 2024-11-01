import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { AiOutlineClose } from "react-icons/ai";
import "./ShoppingList.css";
import {
  InputButton,
  InputButtonBorderless,
  InputButtonOutline,
  InputField,
} from "../../../components/Form/FormComponents";
import { customStyles } from "../../../styles/tableStyles";
import ShoplistItemEdit from "../../../components/StockSection/Shop/ShoplistItemEdit";
import ShoplistItemAdd from "../../../components/StockSection/Shop/ShoplistItemAdd";

const ShoppingList = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [dataFiltered, setDataFiltered] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Fetch inventory items
  const fetchShopItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/list_shopping_items"
      );
      console.log("API Response:", response.data); // Debugging the API response
      return Array.isArray(response.data.data) ? response.data.data : []; // Ensure it's an array
    } catch (error) {
      console.error("Error fetching stock:", error);
      return [];
    }
  };

  // Fetch and set the data when the component mounts
  useEffect(() => {
    const loadItems = async () => {
      const fetchedData = await fetchShopItems();
      setData(fetchedData);
      setDataFiltered(fetchedData);
    };
    loadItems();
  }, []);

  // Refetch inventory data after add/edit
  const refetchShopItems = async () => {
    const updatedData = await fetchShopItems();
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
      await axios.delete(`http://localhost:3000/api/remove_shop_item/${id}`);
      console.log(`Item with ID ${id} removed successfully.`);
      refetchShopItems(); // Refetch the inventory to update the list
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
      name: "UOM",
      selector: (row) => row.uom,
      sortable: true,
    },
    {
      name: "Unit Price",
      selector: (row) => {
        const formattedPrice = Intl.NumberFormat("en-US").format(
          row.unit_price
        );
        return `${formattedPrice}/=`;
      },
    },
   
    {
      name: "Manage Item",
      cell: (row) => (
        <button className="shoplist-remove-button" onClick={() => removeItem(row.id)}>
          <AiOutlineClose size={12} />
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
        item.item_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="shoplistPageHeaderWrapper">
        <h1>Shopping List Items</h1>
      </div>
      <div className="content-page">
        <div className="shoplist-search-buttons">
          <div className="shoplist-search">
            <InputField
              type="text"
              placeholder="Search for shop item"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <InputButtonOutline onClick={() => setIsAddModalOpen(true)}>
              Add Item
            </InputButtonOutline>
            <InputButton onClick={() => setIsEditModalOpen(true)}>
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
          <div className="shoplist-modal" ref={modalRef}>
            <ShoplistItemAdd
              onClose={() => setIsAddModalOpen(false)}
              refetchStock={refetchShopItems} // Trigger refetch after adding
            />
          </div>
        )}

        {isEditModalOpen && (
          <div className="shoplist-modal" ref={modalRef}>
            <ShoplistItemEdit
              shoplistItems={data}
              onClose={() => setIsEditModalOpen(false)}
              refetchStock={refetchShopItems} // Trigger refetch after editing
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingList;
