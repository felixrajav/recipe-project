import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import chefLogo from "../assets/R.png"
import './navbar.css'


export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <div className="navbar">
      <div className="left-section">
        <img
          src={chefLogo}
          alt="Chef Logo"
          style={{ width: "70px", height: "70px", marginRight: "5px" }}
        />
      </div>
      <div className="middle-section">
        <Link to="/">Home</Link>
        <Link to="/create-recipe">Create</Link>
        <Link to="/saved-recipes">Saved</Link>
      </div>
      <div className="right-section">
        {!cookies.access_token ? (
          <Link to="/auth">Login/Register</Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
};