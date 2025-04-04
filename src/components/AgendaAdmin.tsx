import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import AgendaAdminProps from "../interfaces/AgendaAdminProps";

const AgendaAdmin = ({
  isLoading,
  clientes,
  deleteCliente,
  startEdit,
}: AgendaAdminProps) => {
  return (
    <div>
      <div className="agenda-container">
        <h2>Agenda:</h2>
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="agenda-grid">
            {clientes.map((cliente) => (
              <div className="agenda-card" key={cliente._id}>
                <div className="info">
                  <h3>{cliente.name}</h3>
                  <p>{cliente.date}</p>
                  <p>{cliente.time}</p>
                  <p>{cliente.service}</p>
                  <p>{cliente.barber}</p>
                  <p>{cliente.phone}</p>
                </div>
                <div className="actions">
                  <label onClick={() => startEdit(cliente)}>Editar</label>
                  <FiEdit className="edit" onClick={() => startEdit(cliente)} />
                  <label onClick={() => deleteCliente(cliente._id)}>
                    Remover
                  </label>
                  <MdDelete
                    onClick={() => deleteCliente(cliente._id)}
                    className="delete"
                  />
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
