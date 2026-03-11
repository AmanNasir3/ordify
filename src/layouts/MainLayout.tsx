import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Header, CodeVerification } from '../components'

const MainLayout = () => {
  const [showVerification, setShowVerification] = useState(false)

  useEffect(() => {
    // Check if user already has a valid token
    const session = localStorage.getItem('session')
    if (!session) {
      setShowVerification(true)
    } else {
      try {
        const parsedSession = JSON.parse(session)
        if (!parsedSession.token) {
          setShowVerification(true)
        }
      } catch {
        setShowVerification(true)
      }
    }
  }, [])

  const handleVerificationClose = () => {
    setShowVerification(false)
    // Reload page to fetch categories with new token
    window.location.reload()
  }

  return (
    <>
      <CodeVerification isOpen={showVerification} onClose={handleVerificationClose} />
      <Header />
      <Outlet />
    </>
  )
}

export default MainLayout
