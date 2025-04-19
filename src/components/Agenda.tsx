import { useState } from "react";
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
  const [filter, setFilter] = useState<string>("Gui"); // Filtro inicial definido para "Gui"
  const startTime = "09:00"; // Horário de abertura
  const endTime = "21:00"; // Horário de fechamento

  // Filtrar clientes por barbeiro
  const filteredClientes = clientes.filter(
    (cliente) => cliente.barber === filter
  );

  return (
    <div className="agenda-container">
      <h2>Agenda</h2>
      <p className="text-center">Filtre por barbeiro:</p>
      <div className="filter-buttons">
        <button
          className={filter === "Gui" ? "active-button" : ""}
          onClick={() => setFilter("Gui")}>
          Gui
        </button>
        <button
          className={filter === "Gabriel" ? "active-button" : ""}
          onClick={() => setFilter("Gabriel")}>
          Gabriel
        </button>
      </div>
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
