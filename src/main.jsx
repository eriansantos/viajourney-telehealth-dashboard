import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

// ── ViaJourney brand appearance for Clerk sign-in ────────────────────────────
const clerkAppearance = {
  layout: {
    logoImageUrl: "/logo-h.png",
    logoLinkUrl:  "/",
  },
  variables: {
    colorPrimary:        "#009A58",
    colorBackground:     "#F5F7F4",
    colorInputBackground:"#FFFFFF",
    colorText:           "#0C1E17",
    colorTextSecondary:  "#6B8A78",
    borderRadius:        "8px",
    fontFamily:          "'Poppins', 'Inter', system-ui, sans-serif",
    fontSize:            "14px",
  },
  elements: {
    card: {
      boxShadow: "0 4px 24px rgba(0,61,49,0.10)",
    },
    headerTitle: {
      fontWeight: "700",
    },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
