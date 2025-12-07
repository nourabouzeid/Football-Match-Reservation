import React, { useEffect, useState } from "react";
import {
  getUnauthorizedUsersAPI,
  getAllUsersAPI,
  approveUserAPI,
  deleteUserAPI,
} from "../../api/adminAPI";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [unauthorizedUsers, setUnauthorizedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const unauthorized = await getUnauthorizedUsersAPI();
      const all = await getAllUsersAPI();

      setUnauthorizedUsers(unauthorized.data.unauthorizedUsers);
      setAllUsers(all.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (username) => {
    try {
      await approveUserAPI(username);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (username) => {
    try {
      await deleteUserAPI(username);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Pending Users */}
      <div className="card">
        <h3 className="section-title">Pending User Approvals</h3>

        {unauthorizedUsers.length === 0 ? (
          <p className="empty-text">No users waiting for approval</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unauthorizedUsers.map((u) => (
                <tr key={u.Username}>
                  <td>{u.Username}</td>
                  <td>{u.Firstname} {u.Lastname}</td>
                  <td>{u.Email}</td>
                  <td className="action-cell">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(u.Username)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Users */}
      <div className="card">
        <h3 className="section-title">All Users</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr key={u.Username}>
                <td>{u.Username}</td>
                <td>{u.Firstname} {u.Lastname}</td>
                <td>{u.Email}</td>
                <td className="action-cell">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u.Username)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
