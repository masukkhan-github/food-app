import React from "react";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await axios.post(
      "http://localhost:3000/api/v1/auth/user/register",
      {
        name,
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
        <h2 className="h-title">Create account</h2>
        <p className="h-sub">
          Sign up to order delicious food from local restaurants.
        </p>
      </div>

      <div className="card">
        <div className="form-title">User sign up</div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="User registration form"
        >
          <div className="form-row">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="name"
              type="text"
              placeholder="Your full name"
            />
          </div>

          <div className="form-row">
            <label htmlFor="uEmail">Email</label>
            <input
              id="uEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="uPassword">Password</label>
            <input
              id="uPassword"
              name="password"
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Create account
            </button>
          </div>
        </form>

        <div className="helper">
          Already have an account? <a href="/user/login">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
