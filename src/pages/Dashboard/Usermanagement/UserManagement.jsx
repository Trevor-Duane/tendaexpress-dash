import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { toast } from 'react-toastify';
import { StoreContext } from '../../../Context/StoreContext';

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null); 
  const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(null)
  const [email, setEmail] = useState(''); 
  const [role, setRole] = useState(''); 

  const { apiUrl } = React.useContext(StoreContext);

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users`);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
      }
    };
    fetchUsers();
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setName(user.username);
    setEmail(user.email);
    setRole(user.user_role); // Assuming `user_role` is the field for the role
  };

  // Handle form submission for updating user details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/auth/update_role`, {
        email: email,
        user_role: role,
      });
      if(response.data.success) {
        toast.success(response.data.message)
      }
      else {
        toast.error(response.data.message)
      }
      // Update user in the list
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, username: name, email: email, user_role: role }
            : user
        )
      );
    } catch (err) {
        toast.error("Error updating user")
    } 
  };

  return (
    <div className="user-container">
      <h2>User Management</h2>

      {/* User List */}
      <div>
        <h3>All Users</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`${
                selectedUser?.id === user.id ? 'selected-user' : ''
              }`}
            >
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      </div>

      {/* User Form */}
      {selectedUser && (
        <div className="form-container">
          <h3>Edit User</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Name:
                <input
                  type="text"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>
                User Level:
                <input
                  type="text"
                  value={role || ''}
                  onChange={(e) => setRole(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>
                Email:
                <input
                  type="email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
