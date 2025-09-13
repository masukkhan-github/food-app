import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import RegisterHelper from "./RegisterHelper";

const UserLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // state for errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // clear old error

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error in user login:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // backend message
      } else {
        setErrorMessage("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Welcome back.</h2>
        <p className="h-sub">
          Sign in to continue ordering delicious food near you.
        </p>
      </div>

      <div className="card">
        <div className="form-title">Sign in</div>

        {/* ✅ Show error if exists */}
        {errorMessage && <p className="error-text" style={{color:"red"}}>{errorMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
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

export default UserLogin;
