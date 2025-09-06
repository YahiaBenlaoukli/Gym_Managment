import react from "react"
import { useState } from "react";
import "./Dashboard.module.css";
import Navbar from "../Navbar/Navbar.jsx";


function Dashboard() {
    return (

        <div>
            <Navbar />
            <h1>Welcome to the Dashboard</h1>
            <p>This is where you can manage your fitness activities.</p>
        </div>
    );
}

export default Dashboard;