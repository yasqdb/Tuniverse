import React, { useState, useEffect } from "react";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../api";
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
import "./BuyerOrders.css";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    productName: "",
    productPrice: "",
    productLink: "",
    deliveryDate: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const buyerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBuyerOrders();
  }, []);

  const fetchBuyerOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/buyer/${buyerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (
      !newOrder.productName ||
      !newOrder.productPrice ||
      !newOrder.productLink ||
      !newOrder.deliveryDate
    )
      return;

    try {
      const res = await createOrder(newOrder);
      const order = res.data.order;

      setNewOrder({
        productName: "",
        productPrice: "",
        productLink: "",
        deliveryDate: "",
      });

      fetchBuyerOrders();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create order, try again");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="buyer-orders">
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
            <Nav.Link as={Link} to="/buyer/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer/messages">
              Messages
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer/orders">
              Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/buyer/profile">
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
        <h3>My Orders</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Seller</th>
              <th>Product</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>
                  {order.sellerId
                    ? `Seller ID: ${order.sellerId}`
                    : "Not accepted yet"}
                </td>
                <td>{order.productName}</td>
                <td>{order.deliveryDate?.slice(0, 10)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ height: "30px" }}></div>

        <div className="request-card">
          <Card className="p-3">
            <h4 className="mb-3">Request a New Order</h4>
            <Form onSubmit={submitOrder}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  name="productName"
                  value={newOrder.productName}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Price (USD)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="productPrice"
                  value={newOrder.productPrice}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter link"
                  name="productLink"
                  value={newOrder.productLink}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Date</Form.Label>
                <Form.Control
                  type="date"
                  name="deliveryDate"
                  value={newOrder.deliveryDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <button type="submit" className="btn btn-dark">
                Request Order
              </button>
            </Form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
