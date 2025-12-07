import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Common/Home";
import Login from "./pages/Guest/Login";
import Signup from "./pages/Guest/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import MatchDetails from "./pages/Common/MatchDetails";

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </Router>
  );
}
