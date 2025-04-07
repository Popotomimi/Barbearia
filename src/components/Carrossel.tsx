import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const Carrossel = () => {
  return (
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
  );
};

export default Carrossel;
