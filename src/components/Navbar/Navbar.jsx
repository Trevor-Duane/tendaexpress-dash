import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showProfile, setShowProfile] = React.useState(false);

  const { apiUrl, user, logout } = React.useContext(StoreContext);
  console.log("navbar user", user);

  return (
    <div className="navbar">
      <img className="navbar-logo" src={assets.logo} alt="" />
      <div className="navbar-right">
        <div className="navbar-settings">
          <NavLink to="settings" className="navbar-link">
            <img className="settings-icon" src={assets.settings_icon} alt="" />
          </NavLink>
        </div>

        <div className="navbar-notification">
          <NavLink to="settings" className="navbar-link">
            <img className="notification-icon" src={assets.bell_icon} alt="" />
          </NavLink>
        </div>

        <div
          className="navbar-user-info"
          onMouseDown={() => setShowProfile((prevState) => !prevState)}
        >
          <div>
            <img className="navbar-profile-dp" src={assets.user} alt="" />
          </div>
          <div>
            <p className="navbar-profile-user">{user.username}</p>
            <p className="navbar-profile-email">{user.email}</p>
          </div>
          <div>
            <img className="arrow-down" src={assets.down} alt="" />
          </div>
        </div>
      </div>

      {!showProfile ? (
        ""
      ) : (
        <div className="navbar-profile-details">
          <ul>
            <li>
              <span>
                <img src={assets.user2} alt="" />
              </span>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <span>
                <img src={assets.reset} alt="" />
              </span>
              <NavLink to="/password-reset">Change Password</NavLink>
            </li>
            <li>
              <span>
                <img src={assets.logout} alt="" />
              </span>
              <NavLink onClick={() => logout()}>Logout</NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default Navbar;
