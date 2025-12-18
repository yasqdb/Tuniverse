import React, { useState, useEffect } from "react";
import { Container, Card, Navbar, Nav, Button } from "react-bootstrap";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../auth";

export default function SellerRevenues() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const navigate = useNavigate();
  const token = getToken();
  const sellerId = getUserId();

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/seller/${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      let sellerOrders = [];
      if (data.success && data.orders) {
        sellerOrders = data.orders;
      } else if (Array.isArray(data)) {
        sellerOrders = data;
      }

      setOrders(sellerOrders);

      const total = sellerOrders.reduce((sum, order) => {
        return sum + (parseFloat(order.productPrice) || 0);
      }, 0);

      setTotalRevenue(total);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
        <Navbar.Brand href="#">
          <img
            src={logo}
            alt="Logo"
            height="45"
            style={{ borderRadius: "6px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/seller/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/messages">
              Messages
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/orders">
              Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/revenues">
              Revenues
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/profile">
              Profile
            </Nav.Link>
          </Nav>
          <Button
            variant="outline-light"
            size="sm"
            className="ms-3"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        <h3>Revenue Summary</h3>
        <Card className="p-4 mb-4">
          <h4>Total Revenue: ${totalRevenue.toFixed(2)}</h4>
          <p>Number of Orders: {orders.length}</p>
        </Card>
      </Container>
    </>
  );
}
