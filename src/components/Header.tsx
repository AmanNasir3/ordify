import styles from './Header.module.css';
import useSession from '../helper/useSession';
import { useState, useEffect } from 'react';
import { Image, Flex, Text, Box } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';

interface HeaderProps {
  verificationComplete?: boolean
}

const Header = ({ verificationComplete }: HeaderProps) => {
   const [session, setSession] = useState(() => useSession('session', null))
   const location = useLocation()
   const navigate = useNavigate()
   const isServiceDetailPage = location.pathname.startsWith('/service/')

  useEffect(() => {
    if (verificationComplete) {
      const updatedSession = useSession('session', null)
      setSession(updatedSession)
    }
  }, [verificationComplete])
  console.log("Session in Header:", session)
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Flex alignItems="center" gap={3}>
          {isServiceDetailPage && (
            <Box 
              as="button" 
              onClick={() => navigate('/')}
              color="white"
              fontSize="24px"
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              display="flex"
              alignItems="center"
              aria-label="Go back"
            >
              <IoArrowBack />
            </Box>
          )}
          {session?.logoURL ? (
            <Image
              src={session.logoURL}
              alt="Hotel Logo"
              boxSize="70px"
              objectFit="contain"
            /> 
          ) : <div />}
          {session?.hotel_name && (
            <Text 
              color="white" 
              fontSize={{ base: 'md', md: 'lg' }} 
              fontWeight="600"
              lineHeight="1.2"
            >
              {session.hotel_name}
            </Text>
          )}
        </Flex>
        <div className={styles.actions}>
          {/* <button className={styles.iconBtn} aria-label="Toggle dark mode">
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
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
