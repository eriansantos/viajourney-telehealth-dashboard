import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import ViaJourneyDashboard from './ViaJourneyDashboard'

const clerkAppearance = {
  variables: {
    colorPrimary: '#2E9E58',
    colorBackground: '#FFFFFF',
    colorInputBackground: '#F4F6F4',
    colorInputText: '#0F1F0F',
    colorText: '#0F1F0F',
    colorTextSecondary: '#7A927A',
    colorNeutral: '#3D5040',
    colorDanger: '#B91C1C',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '14px',
    borderRadius: '8px',
  },
  elements: {
    card: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #E4EAE4',
    },
    headerTitle: {
      color: '#0F1F0F',
      fontWeight: 700,
      fontSize: '18px',
    },
    headerSubtitle: {
      color: '#7A927A',
    },
    formButtonPrimary: {
      background: 'linear-gradient(135deg,#145C32,#2E9E58)',
      '&:hover': { background: 'linear-gradient(135deg,#0D4A28,#1B7A3E)' },
    },
    footerActionLink: {
      color: '#1B7A3E',
      fontWeight: 600,
    },
    identityPreviewEditButton: {
      color: '#1B7A3E',
    },
  },
}

export default function App() {
  return (
    <>
      <SignedOut>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#F4F6F4',
          gap: 24,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg,#145C32,#2E9E58)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif' }}>VJ</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F1F0F', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.01em' }}>Via Journey</div>
              <div style={{ fontSize: 11, color: '#7A927A', fontFamily: 'Inter, system-ui, sans-serif' }}>Clinical Dashboard</div>
            </div>
          </div>

          <SignIn routing="hash" appearance={clerkAppearance} />
        </div>
      </SignedOut>
      <SignedIn>
        <ViaJourneyDashboard />
      </SignedIn>
    </>
  )
}
