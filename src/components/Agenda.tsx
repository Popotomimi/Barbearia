import Cliente from "../interfaces/Cliente";

const Agenda = ({ clientes }: { clientes: Cliente[] }) => {
  const isLoading = clientes.length === 0;

  return (
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
                <p>Data: {cliente.date}</p>
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
