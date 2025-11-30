import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home">
      <div className="image-wrapper">
        <button className="center-btn" onClick={goToLogin}></button>
      </div>
    </div>
  );
}

export default Home;
