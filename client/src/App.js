import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//all the components
import Authentication from "./components/Authentication/Authentication.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";


//admin components
import AdminLogin from "./components/AdminAuthentication/AdminAuthentication.jsx";
import AdminProductManagement from "./components/AdminProductManagement/AdminProductManagement.jsx";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/products" element={<AdminProductManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
