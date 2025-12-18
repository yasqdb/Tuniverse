import React from "react";
import logo from "../../img/logo.png";
import logo2 from "../../img/logo2.jpeg";
import "./BuyerHome.css";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Card,
} from "react-bootstrap";

export default function BuyerHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="buyer-home">
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

          {/* Logout button */}
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

      {/* Home Page Content */}
      <Container className="mt-4">
        <h1>TOP SELLERS</h1>
        <br></br>
        {/* Top Sellers */}
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          {/*seller_1*/}

          <Card className="seller-card">
            <Card.Img variant="top" src={logo2} />
            <Card.Body className="text-center">
              <Card.Title>@seller_1</Card.Title>

              <Card.Text>⭐ 4.8 • 120 reviews</Card.Text>
              <button type="button" class="btn btn-light">
                View Profile
              </button>
            </Card.Body>
          </Card>

          {/*seller_2*/}

          <Card className="seller-card">
            <Card.Img variant="top" src={logo2} />
            <Card.Body className="text-center">
              <Card.Title>@seller_2</Card.Title>

              <Card.Text>⭐ 4.9 • 98 reviews</Card.Text>
              <button type="button" class="btn btn-light">
                View Profile
              </button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}
