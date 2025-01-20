import { React, lazy, Suspense, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { StoreContext } from "./Context/StoreContext.jsx";
import ItemView from "./pages/Menu/Views/ItemView.jsx";
import UserManagement from "./pages/Dashboard/Usermanagement/UserManagement.jsx";

// Lazy load components
const Home = lazy(() => import("./pages/Home/Home"));
const Add = lazy(() => import("./pages/Menu/Add/Add.jsx"));
const List = lazy(() => import("./pages/Menu/List/List.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard/Dashboard"));
const Orders = lazy(() => import("./pages/TendaExpress/Orders/Orders"));
const Users = lazy(() => import("./pages/TendaExpress/Users/Users"));
const Feedback = lazy(() => import("./pages/TendaExpress/Feedbacks/Feedback"));
const Promos = lazy(() => import("./pages/TendaExpress/Promos/Promos"));
const Settings = lazy(() => import("./pages/Settings/Settings/Settings"));
const Reports = lazy(() => import("./pages/Reports/Reports/Reports"));
const Profile = lazy(() => import("./pages/Dashboard/Profile/Profile"));
const Store = lazy(() => import("./pages/Stock/Store/Store.jsx"));
const Budgets = lazy(() => import("./pages/Stock/Budget/Budgets"));
const ShoppingList = lazy(() => import("./pages/Stock/Shoplist/ShoppingList"));
const AccountRequest = lazy(() => import("./pages/Home/AccountRequest.jsx"));
const EmailVerification = lazy(() =>
  import("./pages/Home/EmailVerification.jsx")
);
const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));

function PublicRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/account_request" element={<AccountRequest />} />
      <Route path="/email_verification" element={<EmailVerification />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ProtectedRoutes() {
  return (
    <Routes>
      {/* Routes with Sidebar */}
      <Route element={<Sidebar />}>
        {/* Dashboard */}
        <Route path="/" element={
          <Suspense fallback={<div>Loading Dashboard...</div>}>
            <Dashboard />
          </Suspense>
        } />

        <Route path="/dashboard/user_management" element={
          <Suspense fallback={<div>Loading User Management...</div>}>
            <UserManagement />
          </Suspense>
        } />
        
        
        {/* Menu Management */}
        <Route path="menu/add" element={
          <Suspense fallback={<div>Loading Add Menu...</div>}>
            <Add />
          </Suspense>
        } />
        <Route path="menu/list" element={
          <Suspense fallback={<div>Loading List...</div>}>
            <List />
          </Suspense>
        } />
        <Route path="menu/item_view" element={
          <Suspense fallback={<div>Loading Item View...</div>}>
            <ItemView />
          </Suspense>
        } />

        {/* Store and Inventory */}
        <Route path="stock/shopping_list" element={
          <Suspense fallback={<div>Loading Shopping List...</div>}>
            <ShoppingList />
          </Suspense>
        } />
        <Route path="stock/inventory_in_store" element={
          <Suspense fallback={<div>Loading Store...</div>}>
            <Store />
          </Suspense>
        } />
        <Route path="stock/budgets" element={
          <Suspense fallback={<div>Loading Budgets...</div>}>
            <Budgets />
          </Suspense>
        } />

        {/* Tenda Express */}
        <Route path="tenda_express/orders" element={
          <Suspense fallback={<div>Loading Orders...</div>}>
            <Orders />
          </Suspense>
        } />
        <Route path="tenda_express/users" element={
          <Suspense fallback={<div>Loading Users...</div>}>
            <Users />
          </Suspense>
        } />
        <Route path="tenda_express/feedbacks" element={
          <Suspense fallback={<div>Loading Feedbacks...</div>}>
            <Feedback />
          </Suspense>
        } />
        <Route path="tenda_express/promos" element={
          <Suspense fallback={<div>Loading Promos...</div>}>
            <Promos />
          </Suspense>
        } />

        {/* Sales and Reports */}
        <Route path="reports" element={
          <Suspense fallback={<div>Loading Reports...</div>}>
            <Reports />
          </Suspense>
        } />

        {/* Settings and Profile */}
        <Route path="settings" element={
          <Suspense fallback={<div>Loading Settings...</div>}>
            <Settings />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<div>Loading Profile...</div>}>
            <Profile />
          </Suspense>
        } />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      {token ? <ProtectedRoutes /> : <PublicRoutes />}
    </>
  );
}

export default App;
