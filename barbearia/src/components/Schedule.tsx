// Axios
import axios from "axios";

// Hooks
import { FormEvent, useEffect, useState } from "react";

// Icons
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

interface ScheduleProps {
  api: string;
}

const Schedule: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${api}/cliente`);
      setClientes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [api]);

  const resetForm = () => {
    setName("");
    setDate("");
    setTime("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cliente = {
      name,
      date,
      time,
    };

    try {
      setIsButtonDisabled(true);
      await axios.post(`${api}/cliente`, cliente);
      toast.success("Agendamento realizado com sucesso!");
      resetForm();
      fetchClientes();
      setIsButtonDisabled(false);
    } catch (error) {
      toast.error("Tente novamente mais tarde");
    }
    setIsButtonDisabled(false);
  };

  const deleteCliente = async (id: any) => {
    try {
      await axios.delete(`${api}/cliente/${id}`);
      toast.success("Agendamento removido com sucesso");
      fetchClientes();
    } catch (error) {
      toast.error("Tente novamente mais tarde");
    }
  };

  return (
    <div>
      <h1 className="first">Marque um horário</h1>
      <div className="make-schedule">
        <h1>Faça seu agendamento</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label>Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Data:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>
              Hora: <span>(Agendamento de 30min em 30min)</span>
            </label>
            <input
              type="time"
              step="1800"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          {isButtonDisabled ? (
            <input type="submit" disabled value="Aguarde..." />
          ) : (
            <input type="submit" value="Agendar" />
          )}
        </form>
      </div>
      <img src="/img/tesoura.jpg" alt="Imagem de um tesoura" />
      <div className="agenda-container">
        <h2>Agenda:</h2>
        {clientes.map((cliente) => (
          <div className="agenda" key={cliente._id}>
            <div className="info">
              <h3>{cliente.name}</h3>
              <p>{cliente.date}</p>
              <p>{cliente.time}</p>
            </div>
            <div className="actions">
              <label>Editar</label>
              <FiEdit className="edit" />
              <label onClick={() => deleteCliente(cliente._id)}>Remover</label>
              <MdDelete
                onClick={() => deleteCliente(cliente._id)}
                className="delete"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
