import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

interface ScheduleProps {
  api: string;
}

const Admin: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const services = [
    { name: "Só sombrancelha (15min)", duration: 15 },
    { name: "Só pésinho (10min)", duration: 10 },
    { name: "Corte (40min)", duration: 40 },
    { name: "Corte+sombrancelha (50min)", duration: 50 },
    { name: "Corte+barba+sobrancelha (1h e 10min)", duration: 70 },
  ];

  const barbers = ["Gabriel", "Gui"];

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
    setService("");
    setSelectedBarber("");
    setIsEditing(false);
    setCurrentClientId(null);
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const checkAvailability = (): boolean => {
    const selectedService = services.find((srv) => srv.name === service);
    if (!selectedService) return true;

    const newEndTime = calculateEndTime(time, selectedService.duration);

    return clientes.some((cliente) => {
      const existingStartTime = cliente.time;
      const existingService = services.find(
        (srv) => srv.name === cliente.service
      );
      if (!existingService) return false;

      const existingEndTime = calculateEndTime(
        existingStartTime,
        existingService.duration
      );

      return (
        cliente.date === date &&
        time < existingEndTime &&
        newEndTime > existingStartTime &&
        cliente._id !== currentClientId
      );
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !date || !time || !service || !selectedBarber) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    const selectedService = services.find((srv) => srv.name === service);
    if (!selectedService) return;

    if (checkAvailability()) {
      toast.warning("Já agendaram nesse horário ou data, tente outro!");
      return;
    }

    const cliente = {
      name,
      date,
      time,
      service: selectedService.name,
      duration: selectedService.duration,
      barber: selectedBarber,
    };

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
    setService(cliente.service);
    setSelectedBarber(cliente.barber);
    setIsEditing(true);
    setCurrentClientId(cliente._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="first gap">Admin Page</h1>
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
            <label>Hora:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label>Serviço:</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}>
              <option value="">Selecione um serviço</option>
              {services.map((srv) => (
                <option key={srv.name} value={srv.name}>
                  {srv.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label>Barbeiro:</label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}>
              <option value="">Selecione um barbeiro</option>
              {barbers.map((barber) => (
                <option key={barber} value={barber}>
                  {barber}
                </option>
              ))}
            </select>
          </div>
          {isButtonDisabled ? (
            <input type="submit" disabled value="Aguarde..." />
          ) : (
            <input type="submit" value={isEditing ? "Editar" : "Agendar"} />
          )}
        </form>
      </div>
      <div className="agenda-container">
        <h2>Agenda:</h2>
        {clientes.map((cliente) => (
          <div className="agenda" key={cliente._id}>
            <div className="info">
              <h3>{cliente.name}</h3>
              <p>{new Date(cliente.date).toLocaleDateString("pt-BR")}</p>
              <p>{cliente.time}</p>
              <p>{cliente.service}</p>
              <p>{cliente.barber}</p>
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
    </div>
  );
};

export default Admin;
