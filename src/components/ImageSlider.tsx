import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { SliderImage } from '../types';
import 'swiper/swiper-bundle.css';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: SliderImage[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: `.${styles.pagination}`,
          bulletClass: styles.bullet,
          bulletActiveClass: styles.bulletActive,
        }}
        className={styles.swiper}
      >
        {images.map((image) => (
          <SwiperSlide key={image.id} className={styles.slide}>
            <img
              src={image.src}
              alt={image.alt}
              className={styles.slideImage}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.pagination}></div>
    </div>
  );
};

export default ImageSlider;
