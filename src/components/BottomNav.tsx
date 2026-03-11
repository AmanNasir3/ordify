import {
  IoHomeOutline,
  IoStarOutline,
  IoReceiptOutline,
  IoDocumentTextOutline,
  IoChevronForward,
  IoTrashOutline,
} from 'react-icons/io5';
import styles from './BottomNav.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: '1', label: 'Home', icon: <IoHomeOutline />, href: '/' },
  { id: '2', label: 'Reviews', icon: <IoStarOutline />, href: '/reviews' },
  { id: '3', label: 'My Orders', icon: <IoReceiptOutline />, href: '/orders' },
  { id: '4', label: 'My Requests', icon: <IoDocumentTextOutline />, href: '/requests' },
  { id: '5', label: 'Request Data Deletion', icon: <IoTrashOutline />, href: '/delete' },
];

const BottomNav = () => {
  return (
    <nav className={styles.nav}>
      <h3 className={styles.heading}>Additional Links</h3>
      <ul className={styles.list}>
        {navItems.map((item) => (
          <li key={item.id}>
            <a href={item.href} className={styles.link}>
              <span className={styles.iconWrapper}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              <IoChevronForward className={styles.chevron} />
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className={styles.poweredBy}>Powered by</span>
        <span className={styles.brand}>Ordify™</span>
      </div>
    </nav>
  );
};

export default BottomNav;
