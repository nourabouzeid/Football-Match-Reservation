import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDetails, updateDetails } from "../../api/fanAPI";
import "./EditProfile.css";

export default function EditProfile() {
  const auth = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [form, setForm] = useState({
    Password: "",
    Firstname: "",
    Lastname: "",
    Birthdate: "",
    Gender: "",
    City: "",
    Address: "",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getDetails(auth.token);

        setUserData(res.data.user); 

        setForm({
          Password: "",
          Firstname: res.data.user.Firstname || "",
          Lastname: res.data.user.Lastname || "",
          Birthdate: res.data.user.Birthdate
            ? res.data.user.Birthdate.substring(0, 10)
            : "",
          Gender:
            res.data.user.Gender === 0 || res.data.user.Gender === 1
              ? res.data.user.Gender
              : "",
          City: res.data.user.City || "",
          Address: res.data.user.Address || "",
        });

      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [auth.token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDetails(form, auth.token);
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  if (loading) return <p>Loading user info...</p>;
  if (!userData) return <p>Failed to load user info.</p>;

  return (
    <div className="update-container">
      <h2>Edit Your Profile</h2>

      <form className="update-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input value={userData.Username} disabled />
        </div>

        <div className="field">
          <label>Email</label>
          <input value={userData.Email} disabled />
        </div>

        <div className="field">
          <label>New Password</label>
          <input
            type="password"
            name="Password"
            value={form.Password}
            onChange={handleChange}
            placeholder="Leave empty to keep old password"
          />
        </div>

        <div className="field">
          <label>First Name</label>
          <input name="Firstname" value={form.Firstname} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Last Name</label>
          <input name="Lastname" value={form.Lastname} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Birthdate</label>
          <input
            type="date"
            name="Birthdate"
            value={form.Birthdate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Gender</label>
          <select name="Gender" value={form.Gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>

        <div className="field">
          <label>City</label>
          <input name="City" value={form.City} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Address</label>
          <input name="Address" value={form.Address} onChange={handleChange} />
        </div>

        <button type="submit" className="update-btn">Save Changes</button>
      </form>
    </div>
  );
}
