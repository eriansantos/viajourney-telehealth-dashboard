import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react'
import { B, F } from './lib/brand.js'
import ViaJourneyDashboard from './ViaJourneyDashboard'

// ── Clerk appearance ────────────────────────────────────────────────────────
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
    borderRadius:        '10px',
  },
  elements: {
    rootBox:                   { width:'100%' },
    // Strip the floating card — the right panel IS the card
    card:                      { boxShadow:'none', border:'none', background:'transparent', padding:'0 0 24px' },
    headerTitle:               { fontWeight:700, fontSize:'22px', letterSpacing:'-0.01em', color: B.t1 },
    headerSubtitle:            { color: B.t3, fontSize:'13px' },
    socialButtonsBlockButton:  { border:`1px solid ${B.border}`, color: B.t1, fontWeight:500, background:'#fff' },
    socialButtonsBlockButtonText: { fontWeight:500 },
    dividerLine:               { background: B.border },
    dividerText:               { color: B.t4, fontSize:'12px' },
    formFieldLabel:            { color: B.t2, fontWeight:500, fontSize:'13px' },
    formFieldInput:            { border:`1px solid ${B.border}`, background:'#F5F7F4', color: B.t1, fontSize:'14px' },
    formButtonPrimary:         {
      background: `linear-gradient(135deg, ${B.g800} 0%, ${B.g500} 100%)`,
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    footerActionText:          { color: B.t3, fontSize:'13px' },
    footerActionLink:          { color: B.g500, fontWeight:600 },
    identityPreviewEditButton: { color: B.g500 },
    // Hide the Clerk-generated logo in the card (we show it on the left panel)
    logoBox:                   { display:'none' },
    logoImage:                 { display:'none' },
  },
}

export default function App() {
  return (
    <>
      <SignedOut>
        <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:F }}>

          {/* ── Left: brand panel ──────────────────────────────────────────── */}
          <div style={{
            flex:'0 0 50%',
            background:`linear-gradient(150deg, ${B.g800} 0%, ${B.g700} 55%, ${B.g600} 100%)`,
            display:'flex', flexDirection:'column',
            alignItems:'flex-start', justifyContent:'center',
            padding:'64px 56px',
            position:'relative', overflow:'hidden',
          }}>
            {/* Decorative blobs */}
            <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:-60, right:60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:'55%', right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(145,197,99,0.10)', pointerEvents:'none' }} />

            {/* Logo */}
            <img
              src="/logo-white.png"
              alt="ViaJourney Telehealth"
              style={{ height:40, width:'auto', objectFit:'contain', marginBottom:48, opacity:0.92 }}
            />

            {/* Headline + sub */}
            <h1 style={{ fontSize:36, fontWeight:700, color:'#fff', margin:'0 0 16px', letterSpacing:'-0.03em', lineHeight:1.15, maxWidth:340 }}>
              Clinical<br />Dashboard
            </h1>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', maxWidth:300, lineHeight:1.75, margin:'0 0 52px' }}>
              Visibilidade clínica completa para equipes de saúde primária, em tempo real.
            </p>

            {/* Bottom tagline */}
            <div style={{ position:'absolute', bottom:28, left:56, fontSize:10, color:'rgba(255,255,255,0.25)', letterSpacing:'0.10em', textTransform:'uppercase' }}>
              Powered by Elation EHR
            </div>
          </div>

          {/* ── Right: sign-in panel ───────────────────────────────────────── */}
          <div style={{
            flex:1,
            background:'#FFFFFF',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:'48px 56px',
            overflowY:'auto',
            position:'relative',
          }}>
            {/* Small icon watermark top-right */}
            <img
              src="/logo-icon.png"
              alt=""
              aria-hidden="true"
              style={{ position:'absolute', top:24, right:28, height:26, opacity:0.18 }}
            />

            {/* Login heading (above Clerk widget) */}
            <div style={{ width:'100%', maxWidth:360, marginBottom:8 }}>
              <h2 style={{ fontSize:22, fontWeight:700, color:B.t1, letterSpacing:'-0.02em', marginBottom:6 }}>
                Bem-vindo de volta
              </h2>
              <p style={{ fontSize:13, color:B.t3, lineHeight:1.6 }}>
                Acesse sua conta para continuar
              </p>
            </div>

            {/* Clerk widget */}
            <div style={{ width:'100%', maxWidth:360 }}>
              <SignIn routing="hash" appearance={clerkAppearance} />
            </div>
          </div>

        </div>
      </SignedOut>

      <SignedIn>
        <ViaJourneyDashboard />
      </SignedIn>
    </>
  )
}
