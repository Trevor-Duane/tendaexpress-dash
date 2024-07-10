import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showProfile, setShowProfile] = React.useState(false);
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      <div className="navbar-right">
        <NavLink to="reports" className="navbar-link">
          <p>Reports</p>
        </NavLink>
        <NavLink to="settings" className="navbar-link">
          <p>Settings</p>
        </NavLink>
        <img className="notification" src={assets.bell_icon} alt="" />
        <img
          onClick={() => setShowProfile((prevState) => !prevState)}
          className="profile"
          src={assets.profile_image}
          alt=""
        />
      </div>

      {!showProfile ? (
        ""
      ) : (
        <div className="navbar-profile-details">
          <ul>
            <NavLink to="/profile" onClick={() => setShowProfile((prevState) => !prevState)}>
              <li>Profile</li>
            </NavLink>
            <NavLink onClick={() => setShowProfile((prevState) => !prevState)}>
              <li>Logout</li>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
