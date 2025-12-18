import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Navbar,
  Nav,
  FormControl,
} from "react-bootstrap";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BuyerProfile = () => {
  const [profile, setProfile] = useState({
    name: "Buyer Name",
    email: "buyer@example.com",
    password: "password123",
    image: null,
  });

  const [editingPassword, setEditingPassword] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditingPassword(false);
    alert("Profile updated!");
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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

      <Container style={{ marginTop: "40px", maxWidth: "600px" }}>
        <Card className="p-4 shadow-lg">
          <h3 className="text-center mb-4">My Profile</h3>

          <div className="text-center mb-3">
            <img
              src={profile.image || "https://via.placeholder.com/120"}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid black",
              }}
            />

            <Form.Group controlId="profilePic" className="mt-3">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>

            {!editingPassword && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div
                  style={{
                    background: "#e9ecef",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {"*".repeat(profile.password.length)}
                </div>
                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setEditingPassword(true)}
                >
                  Change Password
                </Button>
              </Form.Group>
            )}

            {editingPassword && (
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                />
              </Form.Group>
            )}

            <Button type="submit" className="w-100" variant="dark">
              Save Changes
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default BuyerProfile;
