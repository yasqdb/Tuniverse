import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const goToSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user._id);

      if (data.user.role === "buyer") navigate("/buyer/home");
      else if (data.user.role === "seller") navigate("/seller/home");
    } catch (err) {
      setError("Server error, try again later");
    }
  };

  return (
    <div className="login d-flex justify-content-center align-items-center vh-100 ">
      <div className="container" style={{ maxWidth: "400px" }}>
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 mt-2">
              Login
            </button>
            <button
              className="btn btn-link p-0"
              style={{ fontSize: "0.9rem" }}
              onClick={goToSignup}
            >
              Don't have an account? Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
