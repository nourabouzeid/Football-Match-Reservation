import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Common/Home";
import Login from "./pages/Guest/Login";
import Signup from "./pages/Guest/Signup";
import MatchDetails from "./pages/Common/MatchDetails";
import EditProfile from "./pages/Fan/EditProfile";
import Payment from "./pages/Fan/Payment";


export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/match/:id" element={<MatchDetails />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}
