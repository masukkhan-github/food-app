import React from "react";
import { Link } from "react-router-dom";

const SignIn = ({ type }) => {
  return (
    <div className="helper">
      {type === "user" ? (
        <>
        Already have an account? &nbsp; <Link to="/"> Sign in</Link>
        </>
      ) : (
        <>
          Already partnered? &nbsp;  <Link to="/food-partner/login">Sign in</Link>
        </>
      )}
    </div>
  );
};

export default SignIn;
