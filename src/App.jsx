import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Add from "./pages/Menu/Add/Add.jsx";
import List from "./pages/Menu/List/List.jsx";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";
import Orders from "./pages/TendaExpress/Orders/Orders";
import Users from "./pages/TendaExpress/Users/Users";
import Feedback from "./pages/TendaExpress/Feedbacks/Feedback";
import Promos from "./pages/TendaExpress/Promos/Promos";
import Settings from "./pages/Settings/Settings/Settings";
import Reports from "./pages/Reports/Reports/Reports";
import Profile from "./pages/Dashboard/Profile/Profile";
import Store from "./pages/Stock/Store/Store.jsx";
import Budgets from "./pages/Stock/Budget/Budgets";
import ShoppingList from "./pages/Stock/Shoplist/ShoppingList";
import AccountRequest from "./pages/Home/AccountRequest.jsx";
import EmailVerification from "./pages/Home/EmailVerification.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account_request" element={<AccountRequest/>}/>
      <Route path="/email_verification" element={<EmailVerification/>}/>
      <Route element={<Sidebar />}>
        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Menu Management */}
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />

        {/* Store and Inventory */}
        <Route path="/shopping_list" element={<ShoppingList />} />
        <Route path="/inventory_in_store" element={<Store />} />
        <Route path="/budgets" element={<Budgets />} />

        {/* Tenda Express */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/feedbacks" element={<Feedback />} />
        <Route path="/promos" element={<Promos />} />

        {/* Sales and Reports */}
        <Route path="/reports" element={<Reports />} />

        {/* Other Pages */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="*" element={<NotFound />} /> */}

      </Route>
    </Routes>
  );
}

export default App;
