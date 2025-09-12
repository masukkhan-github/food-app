import React from "react";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    await axios
      .post(
        "http://localhost:3000/api/v1/auth/food-partner/register",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        navigate("/create-food");
      })
      .catch((error) => {
        console.error("error in partner register jsx :", error);
      });
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand">Food Reel</div>
        <h2 className="h-title">Partner sign up</h2>
        <p className="h-sub">
          Create a partner account to list your restaurant and receive orders.
        </p>
      </div>

      <div className="card">
        <div className="form-title">Create partner account</div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Partner registration form"
        >
          <div className="form-row">
            <label htmlFor="businessName">Business name</label>
            <input
              id="businessName"
              name="name"
              type="text"
              placeholder="Restaurant or business name"
            />
          </div>

          <div className="form-row">
            <label htmlFor="contactEmail">Contact email</label>
            <input
              id="contactEmail"
              name="email"
              type="email"
              placeholder="business@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Choose a secure password"
            />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Create account
            </button>
          </div>
        </form>

        <div className="helper">
          Already partnered? <a href="/food-partner/login">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegister;
