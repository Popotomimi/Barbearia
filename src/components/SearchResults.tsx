import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { NavbarAdmin } from "./NavbarAdmin";
import ScheduleProps from "../interfaces/ScheduleProps";
import Cliente from "../interfaces/Cliente";

const SearchResults: React.FC<ScheduleProps> = ({ api }) => {
  const [results, setResults] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await axios.get(`${api}/cliente/historico/search`, {
          params: { q: query },
        });
        setResults(response.data);
      } catch {
        setError("Erro ao buscar. Por favor, tente novamente!");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading)
    return (
      <div className="search-results-container">
        <NavbarAdmin />
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </div>
    );
  if (error) return <p>{error}</p>;
  if (!results.length)
    return (
      <div className="search-results-container">
        <NavbarAdmin /> <h2>Nenhum resultado encontrado.</h2>
      </div>
    );

  return (
    <div className="search-results-container">
      <NavbarAdmin />
      <h2>Resultatos para a busca: {query}</h2>
      <ul>
        {results.map((result: Cliente, index: number) => (
          <li key={index}>
            <Link to={`/cliente/${result._id}`}>{result.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
