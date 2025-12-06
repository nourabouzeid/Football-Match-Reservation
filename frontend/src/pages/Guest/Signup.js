import React, { useState } from "react";
import { signupAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; 

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const userInfo = {
      Username: e.target.username.value,
      Password: e.target.password.value,
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
        <input
          type="text"
          name="username"
          placeholder="Username"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
        />

        <button type="submit">Signup</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}
