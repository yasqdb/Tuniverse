import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Card,
} from "react-bootstrap";
import logo from "../../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import SellerHomeDet from "./SellerHomeDet";
import { getToken, getUserId } from "../../auth";

const SellerHome = () => {
  const [demands, setDemands] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/orders/seller/pending/${getUserId()}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          },
        );
        const data = await res.json();
        setDemands(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const goToHome = () => navigate("/");

  const handleViewDetails = (demand) => setSelectedDemand(demand);
  const handleCloseModal = () => setSelectedDemand(null);

  const handleAccept = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/orders/accept/${selectedDemand._id}/${getUserId()}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      const data = await res.json();
      console.log("FULL RESPONSE DATA:", data);
      if (data.success) {
        console.log("CONVERSATION OBJECT:", data.conversation);
        setDemands((prev) => prev.filter((d) => d._id !== selectedDemand._id));
        handleCloseModal();
        navigate(`/seller/messages/${data.conversation._id}`);
      }
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const handleReject = async () => {
    try {
      await fetch(
        `http://localhost:4000/api/orders/reject/${selectedDemand._id}/${getUserId()}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );

      setDemands((prev) => prev.filter((d) => d._id !== selectedDemand._id));
      handleCloseModal();
    } catch (err) {
      console.error("Error rejecting order:", err);
    }
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
            <Nav.Link as={Link} to="/seller/profile">
              Profile
            </Nav.Link>
          </Nav>
          <Form
            className="d-flex align-items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormControl
              type="search"
              placeholder="Search a traveller ..."
              className="me-2 small-search"
            />
          </Form>
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
        <h3>New Demands</h3>
        {demands.length === 0 && <p>No new demands.</p>}
        <div className="d-flex flex-column gap-3 mt-3">
          {demands.map((d) => (
            <Card key={d._id} className="p-3 shadow-sm">
              <h5>Buyer: {d.buyerUsername}</h5>
              <p>Product: {d.productName}</p>
              <p>Date Requested: {d.deliveryDate?.slice(0, 10)}</p>
              <Button variant="dark" onClick={() => handleViewDetails(d)}>
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </Container>

      <SellerHomeDet
        demand={selectedDemand}
        onClose={handleCloseModal}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
};

export default SellerHome;
