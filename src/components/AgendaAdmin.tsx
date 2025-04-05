import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import AgendaAdminProps from "../interfaces/AgendaAdminProps";

const AgendaAdmin = ({
  isLoading,
  clientes,
  deleteCliente,
  startEdit,
}: AgendaAdminProps) => {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredClientes = filter
    ? clientes.filter((cliente) => cliente.barber === filter)
    : clientes;

  return (
    <div>
      <div className="agenda-container">
        <h2>Agenda:</h2>
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
        ) : (
          <div className="agenda-grid">
            {filteredClientes.map((cliente) => (
              <div className="agenda-card" key={cliente._id}>
                <div className="calendar-icon">
                  <FcCalendar />
                </div>
                <div className="info">
                  <h3>{cliente.name}</h3>
                  <p>{cliente.date.split("-").reverse().join("/")}</p>
                  <p>{cliente.time}</p>
                  <p>{cliente.service}</p>
                  <p>{cliente.barber}</p>
                  <p>{cliente.phone}</p>
                </div>
                <div className="actions">
                  <label onClick={() => startEdit(cliente)}>
                    Editar <FiEdit className="edit" />
                  </label>
                  <label onClick={() => deleteCliente(cliente._id)}>
                    Remover
                    <MdDelete className="delete" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaAdmin;
