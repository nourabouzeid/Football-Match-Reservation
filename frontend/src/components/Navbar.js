import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.css";

export default function Navbar() {
  const auth = useSelector((state) => state.auth);
  
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/edit-profile" className="nav-link">Profile</Link>
      
      {auth && auth.user && auth.user.Role === 2 && (
        <Link to="/manager" className="nav-link">Manage</Link>
      )}
      {auth && auth.user && auth.user.Role === 1 && (
        <Link to="/admin" className="nav-link">Admin</Link>
      )}

      {(auth && auth.user) ? (
        <>
          <span className="nav-user">Welcome, {auth.user.Username}</span>
          <span className="nav-role">
            {auth.user.Role === 1 && "(Admin)"}
            {auth.user.Role === 2 && "(Manager)"}
            {auth.user.Role === 0 && "(Fan)"}
          </span>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
        </>
      )}
    </nav>
  );
}