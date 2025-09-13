import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import RegisterHelper from "./RegisterHelper";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "https://food-app-8vnw.onrender.com/api/v1/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      navigate("/create-food");
    } catch (error) {
      console.error("Error in partner login:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Partner Login</h2>
        <p className="h-sub">Sign in to manage your restaurant account.</p>
      </div>

      <div className="card">
        <div className="form-title">Sign in</div>

        {/* ✅ Error message */}
        {errorMessage && <p className="error-text" style={{color:"red"}}>{errorMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="partnerEmail">Email</label>
            <input
              id="partnerEmail"
              name="email"
              type="email"
              placeholder="partner@example.com"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="partnerPassword">Password</label>
            <input
              id="partnerPassword"
              name="password"
              type="password"
              placeholder="Your password"
              required
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>
          </div>
        </form>

        <RegisterHelper />
      </div>
    </div>
  );
};

export default PartnerLogin;
