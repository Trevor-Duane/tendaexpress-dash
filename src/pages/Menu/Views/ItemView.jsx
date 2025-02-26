import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import "react-toastify/dist/ReactToastify.css";
import "./ItemView.css";

const ItemView = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [addons, setAddons] = useState([]);
  const [recipeCards, setRecipeCards] = useState([]);

  // Base API URL
  const { apiUrl } = React.useContext(StoreContext);

  const baseURL = import.meta.env.VITE_API_URL;
  console.log("baseURL", baseURL);

  // Fetch data based on the active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "categories") {
          const response = await axios.get(`${apiUrl}/api/categories`);
          setCategories(response.data.data);
        } else if (activeTab === "subcategories") {
          const response = await axios.get(`${apiUrl}/api/subcategories`);
          setSubcategories(response.data.data);
        } else if (activeTab === "menuItems") {
          const response = await axios.get(`${apiUrl}/api/items`);
          setMenuItems(response.data.data);
        } else if (activeTab === "addons") {
          const response = await axios.get(`${apiUrl}/api/addons`);
          setAddons(response.data.data);
        } else if (activeTab === "recipeCards") {
          const response = await axios.get(`${apiUrl}/api/items`);
          console.log("recipe response", response);
          // Filter items to include only those with a non-empty recipes array
          const filteredItems = response.data.data.filter(
            (item) => Array.isArray(item.recipes) && item.recipes.length > 0
          );

          console.log("Filtered Items with Recipes:", filteredItems);

          // Set the filtered items to state
          setRecipeCards(filteredItems);
        }
      } catch (error) {
        toast.error(`Error fetching ${activeTab}: ${error.message}`);
      }
    };

    fetchData();
  }, [activeTab]);

  const renderTable = (items, columns) => (
    <table className="dashboard-table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col}>{item[col.toLowerCase()] || ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRecipeCards = (recipes) => (
    <div className="recipe-cards">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          {/* Recipe Name */}
          <div className="recipe-title">
            <h3>{recipe.item_name}</h3>
          </div>
  
          {/* Recipe Image */}
          <div className="recipe-image-container">
            <img
              src={`${apiUrl}/images/${recipe.item_image}`}
              alt={recipe.item_name}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite error loop
                e.target.src = "https://via.placeholder.com/150"; // Fallback image
              }}
            />
          </div>
  
          {/* Ingredients Table */}
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>Recipe Item</th>
                <th>Grammage</th>
              </tr>
            </thead>
            <tbody>
              {recipe.recipes.map((ingredient, index) => (
                <tr key={index}>
                  <td>
                    {ingredient.store
                      ? ingredient.store.item_name
                      : "No Store Info Available"}
                  </td>
                  <td>
                    {ingredient.usage_amount} {ingredient.uom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
  

  return (
    <div className="content-page dashboard">
      <div className="dashboard-header">
        <h4 className="dashboard-head">Manage Items</h4>
        <div className="tabs">
          {[
            "categories",
            "subcategories",
            "menuItems",
            "addons",
            "recipeCards",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() +
                tab.slice(1).replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>
      </div>

      <section className="table-section">
        {activeTab === "categories" &&
          renderTable(categories, [
            "ID",
            "Category_Name",
            "Category_Description",
          ])}
        {activeTab === "subcategories" &&
          renderTable(subcategories, ["ID", "Subcategory_Name", "Category_Id"])}
        {activeTab === "menuItems" &&
          renderTable(menuItems, [
            "ID",
            "Item_Name",
            "Item_Price",
            "Item_Description",
          ])}
        {activeTab === "addons" &&
          renderTable(addons, [
            "ID",
            "Addon_Name",
            "Addon_Price",
            "Addon_Description",
          ])}
        {activeTab === "recipeCards" && renderRecipeCards(recipeCards)}
      </section>
      <ToastContainer />
    </div>
  );
};

export default ItemView;
