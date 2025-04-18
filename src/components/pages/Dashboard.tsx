import ScheduleProps from "../../interfaces/ScheduleProps";
import History from "../../interfaces/History";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavbarAdmin } from "../NavbarAdmin";

const Dashboard: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<History[]>([]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${api}/cliente/historico/all`);
      setClientes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [api]);

  return (
    <div className="dashboard-container">
      <NavbarAdmin />
      <h1>Histórico</h1>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Atendimentos</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>
                <Link to={`/cliente/${cliente._id}`}>{cliente.name}</Link>{" "}
              </td>
              <td>{cliente.phone}</td>
              <td>{cliente.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
