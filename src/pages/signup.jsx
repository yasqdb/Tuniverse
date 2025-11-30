import React, { useState } from "react";
import "./signup.css";

import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const endpoint = role === "buyer" ? "signup/buyer" : "signup/seller";

      const res = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="signup d-flex justify-content-center align-items-center">
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="mb-3">Sign Up</h3>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="mb-3">
            <label className="form-label fw-bold">Account type:</label>
            <div className="d-flex gap-3">
              <div>
                <input
                  type="radio"
                  id="buyer"
                  name="role"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                />
                <label htmlFor="buyer" className="ms-1">
                  Buyer
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="seller"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                />
                <label htmlFor="seller" className="ms-1">
                  Seller
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Create Account
          </button>
        </form>

        <button
          className="btn btn-link p-0"
          style={{ fontSize: "0.9rem" }}
          onClick={() => navigate("/login")}
        >
          Have an account? Log in
        </button>
      </div>
    </div>
  );
}
