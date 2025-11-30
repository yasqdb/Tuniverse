import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerMessages from "./pages/buyer/BuyerMessages";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerProfile from "./pages/buyer/BuyerProfile";

import SellerHome from "./pages/seller/SellerHome";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerMessages from "./pages/seller/SellerMessages";
import SellerOrders from "./pages/seller/SellerOrders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Buyer Routes */}
        <Route path="/buyer/home" element={<BuyerHome />} />
        <Route path="/buyer/messages" element={<BuyerMessages />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />

        {/* Seller Routes */}
        <Route path="/seller/home" element={<SellerHome />} />

        <Route path="/seller/messages" element={<SellerMessages />} />
        <Route
          path="/seller/messages/:conversationId"
          element={<SellerMessages />}
        />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
