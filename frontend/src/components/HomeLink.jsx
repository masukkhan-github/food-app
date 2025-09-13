import React from "react";
import { Link } from "react-router-dom";

const HomeLink = ({ children, className, ...props }) => {
  return (
    <Link to="/home" className={className} {...props}>
      {children}
    </Link>
  );
};

export default HomeLink;
