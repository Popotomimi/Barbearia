import ScheduleProps from "../../interfaces/ScheduleProps";
import Cliente from "../../interfaces/Cliente";
import axios from "axios";
import { useEffect, useState } from "react";
import Agenda from "../Agenda";

const Dashboard: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${api}/cliente/agendadodia`);
      setClientes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [api]);

  return (
    <div>
      <h1>Dashboard</h1>
      <Agenda clientes={clientes} />
    </div>
  );
};

export default Dashboard;
