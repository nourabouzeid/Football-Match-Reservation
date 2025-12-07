import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../api/authAPI";
import { useNavigate } from "react-router-dom";
import { login } from "../../state/authSlice";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      Username: e.target.username.value,
      Password: e.target.password.value,
    };

    try {
      const res = await loginAPI(credentials);
      
      const message = res.data.message
      if(message == "User not authorized") {
        setError("User not authorized")
        return;
      }
      
      dispatch(login(res.data));
      localStorage.setItem("auth", JSON.stringify(res.data));
      console.log(res.data.user.Role);
      if (res.data.user.Role === 1) navigate("/admin");
      else if (res.data.user.Role === 2) navigate("/manager");
      else navigate("/");

    } catch (err) {
        if (err.response) {
            console.log("Server error:", err.response.data);
            setError(err.response.data.message || "Login failed");
          } else {
            console.log("Network/Other error:", err);
            setError("Network error. Try again.");
          }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
        {error && <p className="auth-error">{error}</p>}
      </form>
    </div>
  );
}
