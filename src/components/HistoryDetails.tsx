import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ScheduleProps from "../interfaces/ScheduleProps";
import History from "../interfaces/History";
import { NavbarAdmin } from "./NavbarAdmin";

const ClienteDetails: React.FC<ScheduleProps> = ({ api }) => {
  const { id } = useParams();
  const [cliente, setCliente] = useState<History | null>(null);

  const fetchClienteDetails = async () => {
    try {
      const response = await axios.get(`${api}/cliente/historico/${id}`);
      setCliente(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClienteDetails();
  }, [id]);

  if (!cliente)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <div>
      <NavbarAdmin />
      <div className="cliente-details-container">
        <h1>Histórico de Atendimentos do Cliente: {cliente.name}</h1>
        <table className="cliente-details-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Barbeiro</th>
              <th>Serviço</th>
            </tr>
          </thead>
          <tbody>
            {cliente.dates.map((date, index) => (
              <tr key={index}>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td>{cliente.barbers[index] || "N/A"}</td>
                <td>{cliente.services[index] || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteDetails;
