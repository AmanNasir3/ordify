import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Header, CodeVerification } from '../components'

const MainLayout = () => {
  const [showVerification, setShowVerification] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)

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
    // Trigger refetch in child components without reloading page
    setVerificationComplete(true)
  }

  const reopenVerification = () => {
    setShowVerification(true)
    setVerificationComplete(false)
  }

  return (
    <>
      <CodeVerification isOpen={showVerification} onClose={handleVerificationClose} />
      <Header />
      <Outlet context={{ verificationComplete, reopenVerification }} />
    </>
  )
}

export default MainLayout
