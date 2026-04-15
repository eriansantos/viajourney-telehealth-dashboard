import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { B, F } from './lib/brand.js'
import ViaJourneyDashboard from './ViaJourneyDashboard'

const clerkAppearance = {
  variables: {
    colorPrimary:        B.g500,
    colorBackground:     '#FFFFFF',
    colorInputBackground:'#F5F7F4',
    colorInputText:      B.t1,
    colorText:           B.t1,
    colorTextSecondary:  B.t3,
    colorNeutral:        B.t2,
    colorDanger:         B.neg,
    fontFamily:          F,
    fontSize:            '14px',
    borderRadius:        '8px',
  },
  elements: {
    card: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border:    `1px solid ${B.border}`,
    },
    headerTitle: {
      color: B.t1, fontWeight: 700, fontSize: '18px',
    },
    headerSubtitle: {
      color: B.t3,
    },
    formButtonPrimary: {
      background: `linear-gradient(135deg, ${B.g800}, ${B.g500})`,
      fontWeight: 600,
    },
    footerActionLink: {
      color: B.g500, fontWeight: 600,
    },
    identityPreviewEditButton: {
      color: B.g500,
    },
  },
}

export default function App() {
  return (
    <>
      <SignedOut>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: B.bg,
          gap: 24, fontFamily: F,
        }}>
          {/* Logo */}
          <img src="/logo-h.png" alt="ViaJourney Telehealth" style={{ height: 36, objectFit: 'contain' }} />

          {/* Clerk widget */}
          <SignIn routing="hash" appearance={clerkAppearance} />
        </div>
      </SignedOut>

      <SignedIn>
        <ViaJourneyDashboard />
      </SignedIn>
    </>
  )
}
