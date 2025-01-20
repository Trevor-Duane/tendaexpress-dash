import React from "react";
import "./Settings.css";

const Settings = () => {
  return (
    <div className="content-page settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>
      <div className="settings-content">
        <div className="settings-group">
          <h2>Account Settings</h2>
          <div className="settings-item">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" placeholder="Enter your username" />
          </div>
          <div className="settings-item">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
        </div>

        <div className="settings-group">
          <h2>Preferences</h2>
          <div className="settings-item">
            <label htmlFor="theme">Theme:</label>
            <select id="theme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="settings-item">
            <label htmlFor="language">Language:</label>
            <select id="language">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="settings-group">
          <h2>Notifications</h2>
          <div className="settings-item">
            <label>
              <input type="checkbox" />
              Email Notifications
            </label>
          </div>
          <div className="settings-item">
            <label>
              <input type="checkbox" />
              SMS Notifications
            </label>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-save">Save Changes</button>
          <button className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
