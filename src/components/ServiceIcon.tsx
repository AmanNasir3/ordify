import styles from "./ServiceIcon.module.css";
import DefaultImage from "../assets/images.png";
interface QuickService {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface ServiceIconProps {
  service: QuickService;
  onClick?: () => void;
}

const ServiceIcon = ({ service, onClick }: ServiceIconProps) => {
  return (
    <article className={styles.iconCard} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconBox}>
          <img
            src={service.image ?? DefaultImage}
            alt={service.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: " 35px",
            }}
          />
        </div>
      </div>
      <span className={styles.title}>{service.name}</span>
    </article>
  );
};

export default ServiceIcon;
