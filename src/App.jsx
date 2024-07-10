import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Add from './pages/TendaExpress/Add/Add'
import List from "./pages/TendaExpress/List/List";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";
import Orders from "./pages/TendaExpress/Orders/Orders";
import Users from "./pages/TendaExpress/Users/Users";
import Feedback from "./pages/TendaExpress/Feedbacks/Feedback";
import Promos from "./pages/TendaExpress/Promos/Promos";
import Settings from "./pages/Settings/Settings/Settings";
import Reports from "./pages/Reports/Reports/Reports";
import StockItems from "./pages/Stock/Items/StockItems";
import MenuItems from "./pages/Menu/Menu/MenuItems";
import Profile from "./pages/Dashboard/Profile/Profile";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Sidebar />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/feedbacks" element={<Feedback />} />
        <Route path="/promos" element={<Promos />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/stock" element={<StockItems />} />
        <Route path="/menu_items" element={<MenuItems />} />
        <Route path="/profile" element={<Profile />} />

      </Route>
    </Routes>
  );
}

export default App;
