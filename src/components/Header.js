import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <header className="header">
      <nav>
        <div className="logo">
          <img src={logo} alt="Todist" />
        </div>
        <h1>Todoist</h1>
      </nav>
    </header>
  );
};

export default Header;
