import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Table,
  Navbar,
  Nav,
  FormControl,
} from "react-bootstrap";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../auth";

export default function SellerOrders() {
  const [availability, setAvailability] = useState({ from: "", to: "" });
  const [orders, setOrders] = useState([]);
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
      console.log("SELLER ORDERS API RESPONSE:", data);

      if (data.success && data.orders) {
        console.log("Found orders:", data.orders);
        setOrders(data.orders);
      } else if (Array.isArray(data)) {
        console.log("Array data:", data);
        setOrders(data);
      } else {
        console.log("No orders found");
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      setOrders([]);
    }
  };

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/api/seller/availability/${sellerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availability: [{ from: availability.from, to: availability.to }],
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to set availability");
        return;
      }
      alert("Availability set!");
      setAvailability({ from: "", to: "" });
    } catch (err) {
      console.error("Error setting availability:", err);
      alert("Server error");
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
        <h3>Orders</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Product</th>
              <th>Price</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.buyerUsername || "Buyer"}</td>
                <td>{order.productName}</td>
                <td>${order.productPrice}</td>
                <td>{order.deliveryDate?.slice(0, 10)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h3 className="mt-5">Propose Availability</h3>
        <Card className="p-4 shadow-lg" style={{ maxWidth: "500px" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                name="from"
                value={availability.from}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                name="to"
                value={availability.to}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="dark" className="w-100">
              Set Availability (Tunisia)
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}
