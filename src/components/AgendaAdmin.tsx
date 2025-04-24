import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import AgendaAdminProps from "../interfaces/AgendaAdminProps";
import { LuMessageCircleWarning } from "react-icons/lu";

const AgendaAdmin = ({
  isLoading,
  clientes,
  deleteCliente,
  startEdit,
}: AgendaAdminProps) => {
  // Estado inicial: data ativa é a atual e barbeiro selecionado é "Gui"
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [filterBarber, setFilterBarber] = useState<string>("Gui");

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
      (!filterBarber || cliente.barber === filterBarber) &&
      (!activeDate || cliente.date === activeDate)
  );

  return (
    <div>
      <div className="agenda-container">
        <h2>Agenda:</h2>
        <p className="text-center">Filtre por barbeiro:</p>
        <div className="filter-buttons">
          <button
            className={`barber-button ${
              filterBarber === "Gui" ? "active-button" : ""
            }`}
            onClick={() => setFilterBarber("Gui")}>
            Gui
          </button>
          <button
            className={`barber-button ${
              filterBarber === "Gabriel" ? "active-button" : ""
            }`}
            onClick={() => setFilterBarber("Gabriel")}>
            Gabriel
          </button>
          <button
            className={filterBarber === "Buguinha" ? "active-button" : ""}
            onClick={() => setFilterBarber("Buguinha")}>
            Buguinha
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

        {isLoading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : filteredClientes.length === 0 ? (
          <>
            <p className="no-appointments">Ainda não temos agendamentos</p>
            <div className="icon-warning">
              <LuMessageCircleWarning />
            </div>
          </>
        ) : (
          <div className="agenda-grid">
            {filteredClientes.map((cliente) => (
              <div className="agenda-card" key={cliente._id}>
                <div className="calendar-icon">
                  <FcCalendar />
                </div>
                <div className="info">
                  <h3>{cliente.name}</h3>
                  <p>{cliente.date.split("-").reverse().join("/")}</p>
                  <p>{cliente.time}</p>
                  <p>{cliente.service}</p>
                  <p>{cliente.barber}</p>
                  <p>{cliente.phone}</p>
                </div>
                <div className="actions">
                  <label onClick={() => startEdit(cliente)}>
                    Editar <FiEdit className="edit" />
                  </label>
                  <label onClick={() => deleteCliente(cliente._id)}>
                    Remover
                    <MdDelete className="delete" />
                  </label>
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
