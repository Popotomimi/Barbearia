import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoSearch } from "react-icons/go";

export const NavbarAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar-admin">
      <ul>
        <li>
          <Link to="/admin">Agenda</Link>
        </li>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <GoSearch />
          </button>
        </div>
        <li>
          <Link to="/dashboard">Clientes</Link>
        </li>
      </ul>
    </nav>
  );
};
