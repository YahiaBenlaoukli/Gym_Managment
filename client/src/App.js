import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//all the components
import Authentication from "./pages/Authentication/Authentication.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import SearchPage from "./pages/SearchPageCat/SearchPageCat.jsx";
import ProductDetails from "./pages/SeachPageId/SearchPageId.jsx";
import OTPVerification from "./pages/OTPVerfivcation/OTPVerfication.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Settings from "./pages/Settings/Settings.jsx";

//admin components
import AdminLogin from "./pages/AdminAuthentication/AdminAuthentication.jsx";
import AdminProductManagement from "./pages/AdminProductManagement/AdminProductManagement.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import AdminOrders from "./pages/AdminOrders/AdminOrders.jsx";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/verify_otp" element={<OTPVerification />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductManagement />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
