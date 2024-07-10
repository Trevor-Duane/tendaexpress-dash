import React from "react";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
import Navbar from "../Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Sidebar = () => {
  return (
    <>
      <Navbar />
      <hr />
      <div className="app-content">
        <div className="sidebar">
          <div className="sidebar-options">
            <div className="main-dashboard">
              <div className="sidebar-options-head">
                <img src={assets.layout_white} alt="" />
                <h4>Dashboard</h4>
              </div>
              <div>
              <NavLink to="/dashboard" className="sidebar-option">
                <p>Dashboard</p>
              </NavLink>
              </div>
            </div>

            <div className="tenda-express">
              <div className="sidebar-options-head">
                <img src={assets.motorbike_white} alt="" />
                <h4>Tenda Express</h4>
              </div>
              <NavLink to="/add" className="sidebar-option">
                <p>Add Items</p>
              </NavLink>

              <NavLink to="/list" className="sidebar-option">
                <p>List Items</p>
              </NavLink>

              <NavLink to="/orders" className="sidebar-option">
                <p>Orders</p>
              </NavLink>

              <NavLink to="/users" className="sidebar-option">
                <p>Users</p>
              </NavLink>
              <NavLink to="/feedbacks" className="sidebar-option">
                <p>Feedbacks</p>
              </NavLink>
              <NavLink to="/promos" className="sidebar-option">
                <p>Promos</p>
              </NavLink>
            </div>

            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.inventory_white} alt="" />
                <h4>Stock</h4>
              </div>
              <NavLink to="/stock" className="sidebar-option">
                <p>Stock Items</p>
              </NavLink>

              <NavLink to=" " className="sidebar-option">
                <p>Inventory</p>
              </NavLink>
            </div>

            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.menu_white} alt="" />
                <h4>Menu</h4>
              </div>
              <NavLink to="/menu_items" className="sidebar-option">
                <p>Menu Items</p>
              </NavLink>

              <NavLink to="" className="sidebar-option">
                <p>Menu Link</p>
              </NavLink>
            </div>

            <div className="stock-tracker">
              <div className="sidebar-options-head">
                <img src={assets.sales_white} alt="" />
                <h4>Sales</h4>
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
          <ToastContainer/>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
