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

// ── SVG icons for feature bullets (no emoji) ──────────────────────────────
function FeatureIcon({ path }) {
  return (
    <div style={{
      width:36, height:36, borderRadius:9, flexShrink:0,
      background:'rgba(255,255,255,0.12)',
      border:'1px solid rgba(255,255,255,0.15)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </div>
  )
}

const FEATURES = [
  { path:"M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z", text:"Dados ao vivo via Elation EHR" },
  { path:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text:"Métricas de acesso e equidade linguística" },
  { path:"M22 12h-4l-3 9L9 3l-3 9H2", text:"Performance clínica e compliance em tempo real" },
]

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

            {/* Feature list */}
            <div style={{ display:'flex', flexDirection:'column', gap:18, width:'100%', maxWidth:340 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <FeatureIcon path={f.path} />
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.45 }}>{f.text}</span>
                </div>
              ))}
            </div>

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
