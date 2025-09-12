import React from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

const RegisterHelper = () => {
  return (
    <div className="helper">
      Register as: <Link to="/user/register">Normal user</Link> ·{" "}
      <Link to="/food-partner/register">Food partner</Link>
    </div>
  );
};

export default RegisterHelper;
