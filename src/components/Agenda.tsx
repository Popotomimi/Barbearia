import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import Cliente from "../interfaces/Cliente";
import { LuMessageCircleWarning } from "react-icons/lu";

// Função para extrair a duração do serviço
const extractDuration = (service: string): number | null => {
  const match = service.match(/\((\d+)min\)/); // Extrai "(Xmin)"
  return match ? parseInt(match[1], 10) : null;
};

// Função para calcular o horário final com base no início e duração
const calculateEndTime = (startTime: string, duration: number | null) => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + (duration || 0);
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};

// Função para calcular os horários em sequência (ocupados e disponíveis)
const calculateSchedule = (
  clientes: Cliente[],
  startTime: string,
  endTime: string
) => {
  const occupiedSlots = clientes.map((cliente) => {
    const duration = extractDuration(cliente.service);
    const slotEndTime = calculateEndTime(cliente.time, duration);
    return { start: cliente.time, end: slotEndTime, type: "occupied" };
  });

  // Ordena os horários ocupados
  occupiedSlots.sort((a, b) => a.start.localeCompare(b.start));

  const schedule = [];
  let lastEndTime = startTime;

  for (const slot of occupiedSlots) {
    if (slot.start > lastEndTime) {
      schedule.push({ start: lastEndTime, end: slot.start, type: "available" });
    }
    schedule.push(slot);
    lastEndTime = slot.end;
  }

  // Adiciona intervalo final, se houver
  if (lastEndTime < endTime) {
    schedule.push({ start: lastEndTime, end: endTime, type: "available" });
  }

  return schedule;
};

const Agenda = ({ clientes }: { clientes: Cliente[] }) => {
  const [filterBarber, setFilterBarber] = useState<string>("Gui");
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const startTime = "09:00";
  const endTime = "21:00";

  // Criação do array único de datas
  const uniqueDates = Array.from(
    new Set(clientes.map((cliente) => cliente.date))
  ).sort();

  // Obtém a data atual e configura como ativa na inicialização
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Data no formato AAAA-MM-DD
    setActiveDate(today); // Define a data ativa como a de hoje
  }, []);

  // Filtrar clientes por barbeiro e data ativa
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.barber === filterBarber &&
      (!activeDate || cliente.date === activeDate)
  );

  return (
    <div className="agenda-container">
      <h2>Agenda</h2>
      <p className="text-center">Filtre por barbeiro:</p>
      <div className="filter-buttons">
        <button
          className={filterBarber === "Gui" ? "active-button" : ""}
          onClick={() => setFilterBarber("Gui")}>
          Gui
        </button>
        <button
          className={filterBarber === "Gabriel" ? "active-button" : ""}
          onClick={() => setFilterBarber("Gabriel")}>
          Gabriel
        </button>
      </div>

      <p className="text-center">Filtre por dia:</p>
      <Swiper
        className="swiper-container"
        spaceBetween={10}
        slidesPerView={1}
        navigation={true}
        modules={[Navigation]}
        breakpoints={{
          768: {
            slidesPerView: 3,
          },
        }}
        onSlideChange={(swiper) =>
          setActiveDate(uniqueDates[swiper.activeIndex])
        }>
        {uniqueDates.map((date) => (
          <SwiperSlide key={date}>
            <button
              className={`date-button ${date === activeDate ? "active" : ""}`}
              onClick={() => setActiveDate(date)}>
              {date.split("-").reverse().join("/")}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="working-hours">
        <strong>Horário de funcionamento:</strong> {startTime} às {endTime}
      </p>

      {filteredClientes.length === 0 ? (
        <>
          <p className="no-appointments">Nenhum horário ocupado</p>
          <div className="icon-warning">
            <LuMessageCircleWarning />
          </div>
        </>
      ) : (
        <div className="schedule">
          {calculateSchedule(filteredClientes, startTime, endTime).map(
            (slot, index) => (
              <div key={index} className={`time-slot ${slot.type}`}>
                <p>
                  {slot.start} - {slot.end} |{" "}
                  {slot.type === "occupied"
                    ? `Ocupado (Barbeiro: ${
                        filteredClientes.find(
                          (cliente) =>
                            cliente.time === slot.start &&
                            calculateEndTime(
                              cliente.time,
                              extractDuration(cliente.service)
                            ) === slot.end
                        )?.barber || "Desconhecido"
                      })`
                    : "Disponível"}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Agenda;
