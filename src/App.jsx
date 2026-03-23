import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import ViaJourneyDashboard from './ViaJourneyDashboard'

export default function App() {
  return (
    <>
      <SignedOut>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#F4F6F4',
        }}>
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        <ViaJourneyDashboard />
      </SignedIn>
    </>
  )
}
