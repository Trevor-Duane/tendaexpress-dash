import { React, lazy, Suspense, useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useNavigation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import { StoreContext } from "./Context/StoreContext.jsx";

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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/account_request" element={<AccountRequest />} />
        <Route path="/email_verification" element={<EmailVerification />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function ProtectedRoutes() {
  // const { token } = useContext(StoreContext);

  // if (!token) {
  //   return (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <Route path="*" element={<NotFound />} />
  //     </Suspense>
  //   );
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Routes with Sidebar */}
        <Route element={<Sidebar />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          {/* Menu Management */}
          <Route path="menu/add" element={<Add />} />
          <Route path="menu/list" element={<List />} />

          {/* Store and Inventory */}
          <Route path="stock/shopping_list" element={<ShoppingList />} />
          <Route path="stock/inventory_in_store" element={<Store />} />
          <Route path="stock/budgets" element={<Budgets />} />

          {/* Tenda Express */}
          <Route path="tenda_express/orders" element={<Orders />} />
          <Route path="tenda_express/users" element={<Users />} />
          <Route path="tenda_express/feedbacks" element={<Feedback />} />
          <Route path="tenda_express/promos" element={<Promos />} />

          {/* Sales and Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Settings and Profile */}
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
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
    // <Suspense fallback={<div>Loading...</div>}>
    //   <Routes>
    //     {/* Public Routes */}
    //     <Route path="/" element={<Home />} />
    //     <Route path="/account_request" element={<AccountRequest />} />
    //     <Route path="/email_verification" element={<EmailVerification />} />

    //     {/* Routes with Sidebar */}
    //     {token && (
    //       <Route element={<Sidebar />}>
    //         {/* Dashboard */}
    //         <Route path="dashboard" element={<Dashboard />} />

    //         {/* Menu Management */}
    //         <Route path="menu/add" element={<Add />} />
    //         <Route path="menu/list" element={<List />} />

    //         {/* Store and Inventory */}
    //         <Route path="stock/shopping_list" element={<ShoppingList />} />
    //         <Route path="stock/inventory_in_store" element={<Store />} />
    //         <Route path="stock/budgets" element={<Budgets />} />

    //         {/* Tenda Express */}
    //         <Route path="tenda_express/orders" element={<Orders />} />
    //         <Route path="tenda_express/users" element={<Users />} />
    //         <Route path="tenda_express/feedbacks" element={<Feedback />} />
    //         <Route path="tenda_express/promos" element={<Promos />} />

    //         {/* Sales and Reports */}
    //         <Route path="reports" element={<Reports />} />

    //         {/* Settings and Profile */}
    //         <Route path="settings" element={<Settings />} />
    //         <Route path="profile" element={<Profile />} />

    //         {/* 404 Not Found */}
    //         <Route path="*" element={<NotFound />} />
    //       </Route>
    //     )}
    //   </Routes>
    // </Suspense>
  );
}

export default App;
