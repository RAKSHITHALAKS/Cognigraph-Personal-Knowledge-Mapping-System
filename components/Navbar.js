import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem", background: "#282c34", color: "white" }}>
      <Link to="/" style={{ marginRight: "1rem", color: "white" }}>Dashboard</Link>
      <Link to="/signup" style={{ color: "white" }}>Signup</Link>
    </nav>
  );
};

export default Navbar;
