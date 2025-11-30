import React, { useState } from "react";
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
  const [orders, setOrders] = useState([
    {
      id: 1,
      seller: "@seller_1",
      product: "Product A",
      date: "2025-11-25",
      status: "In Progress",
    },
    {
      id: 2,
      seller: "@seller_2",
      product: "Product B",
      date: "2025-11-20",
      status: "Completed",
    },
  ]);

  const [newOrder, setNewOrder] = useState({
    productName: "",
    productPrice: "",
    productLink: "",
    deliveryDate: "",
  });

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

      setOrders([
        ...orders,
        {
          id: orders.length + 1,
          seller: "TBD",
          ...newOrder,
          status: order.status,
        },
      ]);

      setNewOrder({
        productName: "",
        productPrice: "",
        productLink: "",
        deliveryDate: "",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create order, try again");
    }
  };

  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="buyer-orders">
      {/* Top Navigation Bar */}
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

          {/* Search bar inside navbar */}
          <Form
            className="d-flex align-items-center"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormControl
              type="search"
              placeholder="Search a traveller ..."
              className="me-2 small-search"
            />
          </Form>

          {/* Logout button */}
          <Button
            variant="outline-light"
            size="sm"
            className="ms-3"
            onClick={goToHome}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        {/* Orders List Section */}
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.seller}</td>

                <td>{order.productName}</td>
                <td>{order.deliveryDate?.slice(0, 10)}</td>

                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Spacer */}
        <div style={{ height: "30px" }}></div>

        {/* Request New Order Section */}
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
