import { useState } from "react";
import Cliente from "../interfaces/Cliente";
import { FcCalendar } from "react-icons/fc";

const Agenda = ({ clientes }: { clientes: Cliente[] }) => {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredClientes = filter
    ? clientes.filter((cliente) => cliente.barber === filter)
    : clientes;

  const isLoading = clientes.length === 0;

  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getFullYear()).slice(2)}`;

  return (
    <div className="agenda-container">
      <h2>Agenda: {formattedDate}</h2>
      <p className="text-center">Filtre a agenda:</p>
      <div className="filter-buttons">
        <button onClick={() => setFilter("Gui")}>Gui</button>
        <button onClick={() => setFilter("Gabriel")}>Gabriel</button>
        <button onClick={() => setFilter(null)}>Todos</button>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      ) : filteredClientes.length === 0 ? (
        <p className="no-appointments">Ainda não temos agendamentos hoje</p>
      ) : (
        <div className="agenda-grid">
          {filteredClientes.map((cliente) => (
            <div className="agenda-card" key={cliente._id}>
              <div className="calendar-icon">
                <FcCalendar />
              </div>
              <div className="info">
                <h3>{cliente.name}</h3>
                <p>Data: {cliente.date.split("-").reverse().join("/")}</p>
                <p>Hora: {cliente.time}</p>
                <p>Serviço: {cliente.service}</p>
                <p>Barbeiro: {cliente.barber}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agenda;
