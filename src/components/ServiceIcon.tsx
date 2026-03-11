import { 
  IoRestaurantOutline,
  IoMapOutline,
} from 'react-icons/io5';
import { MdOutlineRoomService, MdOutlineDoNotDisturbOn } from 'react-icons/md';
import styles from './ServiceIcon.module.css';

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

const iconMap: Record<string, React.ReactNode> = {
  'room-service': <MdOutlineRoomService />,
  'nearby-attractions': <IoMapOutline />,
  'housekeeping': <MdOutlineDoNotDisturbOn />,
  'restaurant-cafe': <IoRestaurantOutline />,
};

const ServiceIcon = ({ service, onClick }: ServiceIconProps) => {
  const icon = iconMap[service.slug] || <MdOutlineRoomService />;

  return (
    <article className={styles.iconCard} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconBox}>
          {service.image ? (
            <img 
              src={service.image} 
              alt={service.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            icon
          )}
        </div>
      </div>
      <span className={styles.title}>{service.name}</span>
    </article>
  );
};

export default ServiceIcon;
