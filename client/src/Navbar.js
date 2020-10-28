import React from "react";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark bg-dark shadow mb-5">
      <p className="navbar-brand my-auto">
        <ul>
          <li>
            <a href="/" style={{ color: "#ffffff" }}>
              {" "}
              react website
            </a>
          </li>
          <li>
            <a href="/admin" style={{ color: "#ffffff" }}>
              {" "}
              admin page
            </a>
          </li>
        </ul>
      </p>
      <ul className="navbar-nav">
        <li className="nav-item text-white">{account}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
