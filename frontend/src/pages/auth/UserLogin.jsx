import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";
import RegisterHelper from "./RegisterHelper";

const UserLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [foods, setFoods] = useState([]); // ✅ state for fetched food

  // create axios instance
  const API = axios.create({
    baseURL: "https://food-app-8vnw.onrender.com/api/v1",
  });

  // attach token before each request
  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await API.post("/auth/user/login", { email, password });

      console.log("Login response:", response.data);

      // ✅ save token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // fetch food after login
      fetchFood();

      // go to home if you want
      navigate("/home");
    } catch (error) {
      console.error("Error in user login:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Try again.");
      }
    }
  };

  // fetch food items
  const fetchFood = async () => {
    try {
      const res = await API.get("/food");
      console.log("Food data:", res.data);
      setFoods(res.data.foodItem || []);
    } catch (err) {
      console.error("Error fetching food:", err.response?.data || err.message);
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

        {errorMessage && (
          <p className="error-text" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

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

        {/* ✅ Show food after login */}
        {foods.length > 0 && (
          <div className="food-list">
            <h3>Available Food</h3>
            <ul>
              {foods.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
