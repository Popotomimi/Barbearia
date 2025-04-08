import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Map from "./Map";
import Banner from "./Banner";
import Agenda from "./Agenda";
import Carrossel from "./Carrossel";
import { AxiosError } from "axios";
import Cliente from "../interfaces/Cliente";
import ScheduleProps from "../interfaces/ScheduleProps";

const Schedule: React.FC<ScheduleProps> = ({ api }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
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
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [api]);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedPhone = localStorage.getItem("userPhone");

    if (savedName) {
      setName(savedName);
    }
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const resetForm = () => {
    setName("");
    setDate("");
    setTime("");
    setService("");
    setSelectedBarber("");
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
      await axios.post(`${api}/cliente`, cliente);
      toast.success("Agendamento realizado com sucesso!");

      localStorage.setItem("userName", name);
      localStorage.setItem("userPhone", phone);

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

  return (
    <div>
      <Banner />
      <div className="make-schedule" ref={formRef}>
        {name ? (
          <h1>{`Bem vindo ${name} faça seu agendamento`}</h1>
        ) : (
          <h1>Faça seu Agendamento</h1>
        )}
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
          <div className="form-control">
            <label>Número de Telefone:</label>
            <PhoneInput
              className="phone-mask"
              defaultCountry="BR"
              placeholder="+55 (11) 99999-9999"
              value={phone}
              onChange={(phone) => {
                if (phone) {
                  setPhone(phone || "");
                }
              }}
            />
          </div>
          <div className="acceptTerms">
            <input type="checkbox" id="acceptTerms" required />
            <label htmlFor="acceptTerms">
              Ao enviar este formulário, você concorda com nossos{" "}
              <strong>
                <a href="/terms">Termos de Uso e Política de Privacidade</a>
              </strong>
              .
            </label>
          </div>
          {isButtonDisabled ? (
            <input type="submit" disabled value="Aguarde..." />
          ) : (
            <input type="submit" value="Agendar" />
          )}{" "}
        </form>
      </div>
      <div className="separate"></div>
      <Agenda clientes={clientes} />
      <Carrossel />
      <Map />
    </div>
  );
};
export default Schedule;
