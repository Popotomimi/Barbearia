// Axios
import axios from "axios";
// Hooks
import { FormEvent, useEffect, useRef, useState } from "react";
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
    setIsEditing(false);
    setCurrentClientId(null);
  };

  const checkAvailability = () => {
    return clientes.some(
      (cliente) =>
        cliente.date === date &&
        cliente.time === time &&
        cliente._id !== currentClientId
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (checkAvailability()) {
      toast.warning("Já agendaram nesse horário ou data, tente outro!");
      return;
    }

    const cliente = { name, date, time };

    try {
      setIsButtonDisabled(true);
      if (isEditing && currentClientId) {
        await axios.patch(`${api}/cliente/${currentClientId}`, cliente);
        toast.success("Agendamento editado com sucesso!");
      } else {
        await axios.post(`${api}/cliente`, cliente);
        toast.success("Agendamento realizado com sucesso!");
      }
      resetForm();
      fetchClientes();
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setIsButtonDisabled(false);
    }
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

  const startEdit = (cliente: any) => {
    setName(cliente.name);
    setDate(cliente.date);
    setTime(cliente.time);
    setIsEditing(true);
    setCurrentClientId(cliente._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="background"></div>
      <div className="content">
        <h1 className="first">Marque um horário</h1>
      </div>
      <div className="background"></div>
      <div className="make-schedule" ref={formRef}>
        <h1>{isEditing ? "Editar Agendamento" : "Faça seu Agendamento"}</h1>
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
            <input type="submit" value={isEditing ? "Editar" : "Agendar"} />
          )}
        </form>
      </div>
      <img className="img" src="/img/tesoura.jpg" alt="Imagem de uma tesoura" />
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
              <label onClick={() => startEdit(cliente)}>Editar</label>
              <FiEdit className="edit" onClick={() => startEdit(cliente)} />
              <label onClick={() => deleteCliente(cliente._id)}>Remover</label>
              <MdDelete
                onClick={() => deleteCliente(cliente._id)}
                className="delete"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="maps-container">
        <h1>Localização:</h1>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1828.0976657697122!2d-46.782897044280496!3d-23.597326647604845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce55ab7ae71ff9%3A0xa44be7c84039c334!2sAv.%20Eng.%20Heitor%20Ant%C3%B4nio%20Eiras%20Garcia%2C%206064%20-%20Jardim%20Esmeralda%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005564-200!5e0!3m2!1spt-BR!2sbr!4v1739475197774!5m2!1spt-BR!2sbr"
          loading="lazy"></iframe>
      </div>
    </div>
  );
};

export default Schedule;
