import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ axios instance with credentials
  const API = axios.create({
    baseURL: "https://food-app-8vnw.onrender.com/api/v1",
    withCredentials: true, // cookies handled automatically
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await API.post("/auth/food-partner/login", {
        email,
        password,
      });

      console.log("Partner login response:", response.data);

      // ✅ redirect after login
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
        <h2 className="h-title">Partner sign in</h2>
        <p className="h-sub">Sign in to manage your restaurant and orders.</p>
      </div>

      <div className="card">
        <div className="form-title">Sign in</div>

        {errorMessage && (
          <p className="error-text" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="pEmail">Email</label>
            <input
              id="pEmail"
              name="email"
              type="email"
              placeholder="business@example.com"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="pPassword">Password</label>
            <input
              id="pPassword"
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

        <div className="helper">
          Register as: &nbsp;<Link to="/user/register">Normal user</Link> ·{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin;
