import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface ScheduleProps {
  api: string;
}

const Schedule: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formRef = useRef<HTMLDivElement>(null);

  const services = [
    { name: "Só sombrancelha (15min)", duration: 15 },
    { name: "Só pésinho (10min)", duration: 10 },
    { name: "Corte (40min)", duration: 40 },
    { name: "Corte+sombrancelha (50min)", duration: 50 },
    { name: "Corte+barba+sobrancelha (1h e 10min)", duration: 70 },
  ];

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${api}/cliente`);
      setClientes(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
        newEndTime > existingStartTime
      );
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !date || !time || !service || !selectedBarber) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    if (checkAvailability()) {
      toast.warning("Já agendaram nesse horário ou data, tente outro!");
      return;
    }

    const selectedService = services.find((srv) => srv.name === service);

    const cliente = {
      name,
      date,
      time,
      service: selectedService?.name,
      duration: selectedService?.duration,
      barber: selectedBarber,
    };

    try {
      setIsButtonDisabled(true);
      await axios.post(`${api}/cliente`, cliente);
      toast.success("Agendamento realizado com sucesso!");
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

  return (
    <div>
      <div className="background"></div>
      <div className="content">
        <h1 className="first">Marque um horário</h1>
      </div>
      <div className="background"></div>
      <div className="make-schedule" ref={formRef}>
        <h1>Faça seu Agendamento</h1>
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
              step="1800"
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
              <option value="Gabriel">Gabriel</option>
              <option value="Gui">Gui</option>
            </select>
          </div>
          {isButtonDisabled ? (
            <input type="submit" disabled value="Aguarde..." />
          ) : (
            <input type="submit" value="Agendar" />
          )}
        </form>
      </div>
      <img className="img" src="/img/tesoura.jpg" alt="Imagem de uma tesoura" />{" "}
      <div className="agenda-container">
        <h2>Agenda:</h2>
        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          clientes.map((cliente) => (
            <div className="agenda" key={cliente._id}>
              <div className="info">
                <h3>{cliente.name}</h3>
                <p>{new Date(cliente.date).toLocaleDateString("pt-BR")}</p>
                <p>{cliente.time}</p>
                <p>{cliente.service}</p>
              </div>
              <div className="actions">
                <span>Barbeiro:</span>
                <p>{cliente.barber}</p>
              </div>
            </div>
          ))
        )}
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
