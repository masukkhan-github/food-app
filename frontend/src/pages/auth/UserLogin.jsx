import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await axios.post(
      "http://localhost:3000/api/v1/auth/user/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    navigate("/");
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

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="User login form"
        >
          <div className="form-row">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              placeholder="Your password"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Sign in
            </button>
          </div>
        </form>

        <div className="helper">
          Register as: <Link to="/user/register">Normal user</Link> ·{" "}
          <Link to="/food-partner/register">Food partner</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
