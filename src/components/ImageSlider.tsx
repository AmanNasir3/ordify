import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: { id: number; image: string }[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop
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
              src={image.image}
              alt={`Slide ${image.id}`}
              className={`${styles.slideImage}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.pagination}></div>
    </div>
  );
};

export default ImageSlider;

