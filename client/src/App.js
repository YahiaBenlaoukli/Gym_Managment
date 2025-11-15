import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

//all the components
import Authentication from "./components/Authentication/Authentication.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";


function App() {
  return (
    <Router>
      <div className="App">
      <Routes>    
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
      </div>
    </Router>
  );
}

export default App;
