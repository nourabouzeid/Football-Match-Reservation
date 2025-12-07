import React, { useState } from "react";
import { signupAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const genderMap = {
      Male: 1,
      Female: 0,
    };

    const roleMap = {
      Admin: 1,
      Manager: 2,
      Fan: 3,
    };

    const userInfo = {
      Username: e.target.username.value,
      Password: e.target.password.value,
      Firstname: e.target.firstname.value,
      Lastname: e.target.lastname.value,
      Birthdate: e.target.birthdate.value,
      Gender: genderMap[e.target.gender.value],        
      City: e.target.city.value,
      Address: e.target.address.value,
      Role: roleMap[e.target.role.value],              
      Email: e.target.email.value,
    };

    try {
      const res = await signupAPI(userInfo);
      console.log(res);
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        
        <input type="text" name="username" placeholder="Username" required />

        <input type="password" name="password" placeholder="Password" required />

        <input type="text" name="firstname" placeholder="First Name" required />

        <input type="text" name="lastname" placeholder="Last Name" required />

        <label>Date of Birth</label>
        <input type="date" name="birthdate" required />

        <select name="gender" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input type="text" name="city" placeholder="City" required />

        <input type="text" name="address" placeholder="Address (Optional)" />

        <select name="role" required>
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Fan">Fan</option>
        </select>

        <input type="email" name="email" placeholder="Email" required />

        <button type="submit">Signup</button>

        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}
