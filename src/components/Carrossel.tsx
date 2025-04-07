import "swiper/swiper-bundle.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const Carrossel = () => {
  return (
    <div className="conteudo">
      <div className="texto hidden">
        <h2>Explore Nossas Opções de Corte</h2>
        <p>
          Descubra uma variedade de estilos que atendem a todos os gostos e
          ocasiões. Cada imagem que você vê representa a dedicação à qualidade e
          atenção aos detalhes, garantindo que você encontre exatamente o que
          precisa. Venha conhecer e se surpreenda com nossas possibilidades!
        </p>
      </div>
      <div className="carrossel-container">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000 }}
          navigation={true}>
          <SwiperSlide>
            <img src="/img/Corte1.jpg" alt="Corte 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/Corte2.jpg" alt="Corte 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/Corte3.jpg" alt="Corte 3" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/Corte4.jpg" alt="Corte 4" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/img/Corte5.jpg" alt="Corte 5" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Carrossel;
