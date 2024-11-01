import React from "react";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
import Navbar from "../Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
  return (
    <>
      <Navbar />
      <hr />
      <div className="app-content">
        <div className="sidebar">
          <div className="sidebar-options">
            {/* overall dashboard */}
            <div className="main-dashboard">
              <div className="sidebar-options-head">
                <img src={assets.layout_white} alt="" />
                <h4>Main Dashboard</h4>
              </div>
              <div>
                <NavLink to="/dashboard" className="sidebar-option">
                  <p>Dashboard</p>
                </NavLink>

                {/* <NavLink to="/dashboard" className="sidebar-option">
                <p>User Configurations</p>
              </NavLink> */}

                {/* <NavLink to="/dashboard" className="sidebar-option">
                <p>Tools</p>
              </NavLink> */}
              </div>
            </div>

            {/* Menu Management */}
            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.menu_white} alt="" />
                <h4>Menu Management</h4>
              </div>
              <NavLink to="/add" className="sidebar-option">
                <p>Add Items</p>
              </NavLink>
              <NavLink to="/list" className="sidebar-option">
                <p>Menu Items</p>
              </NavLink>
              {/* <NavLink to="/item_recipes" className="sidebar-option">
                <p>Item Recipes</p>
              </NavLink> */}
            </div>

            
            {/* Stock and Inventory */}
            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.inventory_white} alt="" />
                <h4>Stock and Inventory</h4>
              </div>
              <NavLink to="/shopping_list" className="sidebar-option">
                <p>Shopping List</p>
              </NavLink>

              <NavLink to="/inventory_in_store" className="sidebar-option">
                <p>Store Management</p>
              </NavLink>

              <NavLink to="/budgets" className="sidebar-option">
                <p>Budget Management</p>
              </NavLink>

              

              

              {/* <NavLink to="/stock_transfer" className="sidebar-option">
                <p>Stock Transfer</p>
              </NavLink> */}

              {/* <NavLink to="/budget" className="sidebar-option">
                <p>Create Budget</p>
              </NavLink> */}
            </div>

            {/* TendaExpress */}
            <div className="tenda-express">
              <div className="sidebar-options-head">
                <img src={assets.motorbike_white} alt="" />
                <h4>Tenda Express</h4>
              </div>
              <NavLink to="/orders" className="sidebar-option">
                <p>Orders</p>
              </NavLink>
              <NavLink to="/feedbacks" className="sidebar-option">
                <p>Feedbacks</p>
              </NavLink>
              <NavLink to="/promos" className="sidebar-option">
                <p>Promos</p>
              </NavLink>
              <NavLink to="/users" className="sidebar-option">
                <p>App Users</p>
              </NavLink>
            </div>

            {/* Sales and Reports */}
            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.sales_white} alt="" />
                <h4>Sales and Reports</h4>
              </div>
              <NavLink to="" className="sidebar-option">
                <p>Items</p>
              </NavLink>

              <NavLink to="" className="sidebar-option">
                <p>Sales Link</p>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="main-content">
          <ToastContainer />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
