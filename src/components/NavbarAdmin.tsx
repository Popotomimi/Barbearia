import { Link } from "react-router-dom";

export const NavbarAdmin = () => {
  return (
    <nav className="navbar-admin">
      <ul>
        <li>
          <Link to="/admin">Admin Page</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};
