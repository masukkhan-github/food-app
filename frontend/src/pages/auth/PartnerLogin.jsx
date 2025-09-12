import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    await axios
      .post(
        "http://localhost:3000/api/v1/auth/food-partner/login",
        {
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
        console.error("error in partner login jsx :", error);
      });
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

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          aria-label="Partner login form"
        >
          <div className="form-row">
            <label htmlFor="pEmail">Email</label>
            <input
              id="pEmail"
              name="email"
              type="email"
              placeholder="business@example.com"
            />
          </div>

          <div className="form-row">
            <label htmlFor="pPassword">Password</label>
            <input
              id="pPassword"
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

export default PartnerLogin;
