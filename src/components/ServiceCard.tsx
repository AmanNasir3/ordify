import { IoStarOutline } from 'react-icons/io5';
import styles from './ServiceCard.module.css';

import { useNavigate } from 'react-router';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick?: (service: Service) => void;
}


const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    
    if (onClick) {
      onClick(service);
    } else {
      navigate(`/service/${service.id}`);
    }
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <img
          src={service.image}
          alt={service.name}
          className={styles.image}
          loading="lazy"
        />
        {service.icon && (
          <div className={styles.iconBadge}>
            <img src={service.icon} alt="" className={styles.badgeIcon} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{service.name}</h3>
        <div className={styles.rating}>
          <div className={styles.stars}>
            <IoStarOutline />
            <IoStarOutline />
            <IoStarOutline />
            <IoStarOutline />
            <IoStarOutline />
          </div>
          <span className={styles.reviewText}>Not reviewed yet</span>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
