import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Navbar.css";

export default function Navbar() {
  const auth  = useSelector((state) => state.auth);
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      {(auth && auth.user) ? (
        <>
          <span className="nav-user">Welcome, {auth.user.Username}</span>
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
