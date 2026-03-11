import { IoMoonOutline, IoMenuOutline } from 'react-icons/io5';
import styles from './Header.module.css';
import LogoIcon from '../assets/icon.png';
import useSession from '../helper/useSession';
import { useState } from 'react';
import { Image } from '@chakra-ui/react';
 


const Header = () => {
   const [session] = useState(() => useSession('session', null))
  return (
    <header className={styles.header}>
      <div className={styles.container}>
      {session?.logoURL ? (
          <Image
            src={session.logoURL}
            alt="Hotel Logo"
            boxSize="70px"
            objectFit="contain"
            mr="3"
          /> 
        ):<div />}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Toggle dark mode">
            <IoMoonOutline />
          </button>
          <button className={styles.langBtn} aria-label="Change language">
            <img
              src="https://cloud.superbutler.app/images/000/000/000000000_united-kingdom.png"
              alt="EN"
              className={styles.flagIcon}
            />
          </button>
          <button className={styles.menuBtn} aria-label="Open menu">
            <IoMenuOutline />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
