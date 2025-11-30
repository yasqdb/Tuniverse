import React, { useState } from "react";
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

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:4000/api/seller/availability/${getUserId()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
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

  const orders = [
    { buyer: "buyer_1", date: "2025-11-20", product: "Eiffel Tower Souvenir" },
    { buyer: "buyer_2", date: "2025-11-22", product: "Chocolate from Germany" },
    { buyer: "buyer_3", date: "2025-11-23", product: "Tunisian Ceramics" },
  ];

  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
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
            <Nav.Link as={Link} to="/seller/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/messages">
              Messages
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/orders">
              Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/seller/profile">
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
        <h3>Orders</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Date</th>
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i}>
                <td>{order.buyer}</td>
                <td>{order.date}</td>
                <td>{order.product}</td>
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
