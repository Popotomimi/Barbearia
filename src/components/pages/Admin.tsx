import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { AxiosError } from "axios";
import Cliente from "../../interfaces/Cliente";
import ScheduleProps from "../../interfaces/ScheduleProps";
import AgendaAdmin from "../AgendaAdmin";

const Admin: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      const response = await axios.get(`${api}/cliente/agendadodia`);
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
    setIsEditing(false);
    setCurrentClientId(null);
    setPhone("");
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

  const checkAvailability = (): string | null => {
    const selectedService = services.find((srv) => srv.name === service);
    if (!selectedService) return null;

    const newEndTime = calculateEndTime(time, selectedService.duration);

    for (const cliente of clientes) {
      if (cliente.barber !== selectedBarber) continue;
      if (cliente.date !== date) continue;

      const existingService = services.find(
        (srv) => srv.name === cliente.service
      );
      if (!existingService) continue;

      const existingEndTime = calculateEndTime(
        cliente.time,
        existingService.duration
      );

      if (time < existingEndTime && newEndTime > cliente.time) {
        if (time < cliente.time) {
          return `O horário desejado é antes de ${cliente.time}. Por favor, selecione um horário que não conflite.`;
        } else {
          return `O horário desejado conflita com um agendamento que termina às ${existingEndTime}. Por favor, escolha outro horário.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !date || !time || !service || !selectedBarber) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    const availabilityMessage = checkAvailability();
    if (availabilityMessage) {
      toast.warning(availabilityMessage);
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
      phone,
    };

    try {
      setIsButtonDisabled(true);

      if (isEditing && currentClientId) {
        // Modo de edição: Atualize o cliente existente
        await axios.patch(`${api}/cliente/${currentClientId}`, cliente);
        toast.success("Agendamento atualizado com sucesso!");
      } else {
        // Modo de criação: Adicione um novo cliente
        await axios.post(`${api}/cliente`, cliente);
        toast.success("Agendamento realizado com sucesso!");
      }

      resetForm();
      fetchClientes();
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro desconhecido. Tente novamente mais tarde.");
      }
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const deleteCliente = async (id: string | number) => {
    try {
      await axios.delete(`${api}/cliente/${id}`);
      toast.success("Agendamento removido com sucesso");
      fetchClientes();
    } catch {
      toast.error("Tente novamente mais tarde");
    }
  };

  const startEdit = (cliente: Cliente) => {
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
      <h1 className="first gap">Administre seus Clientes</h1>
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
          <div className="form-control">
            <label>Número de telefone:</label>
            <PhoneInput
              className="phone-mask"
              defaultCountry="BR"
              placeholder="+55 (11) 99999-9999"
              value={phone}
              onChange={(phone) => {
                if (phone) {
                  setPhone(phone);
                }
              }}
            />
          </div>
          {isButtonDisabled ? (
            <input type="submit" disabled value="Aguarde..." />
          ) : (
            <input type="submit" value={isEditing ? "Editar" : "Agendar"} />
          )}
        </form>
      </div>
      <div className="separate"></div>
      <AgendaAdmin
        isLoading={isLoading}
        clientes={clientes}
        deleteCliente={deleteCliente}
        startEdit={startEdit}
      />
    </div>
  );
};

export default Admin;
