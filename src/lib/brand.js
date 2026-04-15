// ─── ViaJourney Brand Palette ────────────────────────────────────────────────
// Colors extracted from official identity files (4.3.1 Identidade Visual)
// #003D31 — deep forest green  (logo main body, exact pixel extraction)
// #009A58 — emerald green      (logo accent leaf, brand primary)
// #91C563 — sage/lime green    (logo light variant accent)

export const B = {
  // ── Green scale ──────────────────────────────────────────────────────────────
  g900: "#001F18",   // near-black forest green
  g800: "#003D31",   // deep forest green  ← EXACT LOGO COLOR
  g700: "#005A47",   // dark teal-green
  g600: "#007B58",   // medium-dark green
  g500: "#009A58",   // emerald green      ← EXACT BRAND PRIMARY
  g400: "#2EB872",   // medium bright green
  g300: "#91C563",   // sage/lime accent   ← EXACT LOGO ACCENT
  g200: "#BCDC9A",   // light sage
  g100: "#DFF0C5",   // very light green
  g50:  "#F0F8E8",   // barely-there green tint

  // ── Neutrals ──────────────────────────────────────────────────────────────────
  white:   "#FFFFFF",
  bg:      "#F5F7F4",   // subtle warm-green tinted page background
  sbg:     "#FFFFFF",   // sidebar / card white
  border:  "#E2EAE4",   // green-tinted border
  borderM: "#C0D0C8",   // medium border

  // ── Text ─────────────────────────────────────────────────────────────────────
  t1: "#0C1E17",   // near-black (deep forest tint)
  t2: "#2D4A3A",   // dark green text
  t3: "#6B8A78",   // muted green
  t4: "#A8C0B0",   // light muted green

  // ── Semantic ──────────────────────────────────────────────────────────────────
  pos:    "#009A58", posBg:  "#E5F7EE",
  warn:   "#92560A", warnBg: "#FEF3C7",
  neg:    "#B91C1C", negBg:  "#FEF2F2",
  info:   "#1447A0", infoBg: "#EBF3FF",

  // ── Chart palette ─────────────────────────────────────────────────────────────
  ch: {
    g:  "#009A58",   // verde primário brand
    g2: "#2EB872",   // verde médio
    g3: "#91C563",   // verde sage/acento
    t:  "#0B8A7A",   // teal complementar
    t2: "#2DD4BF",   // teal médio
    a:  "#D97706",   // âmbar (atenção)
    r:  "#C0392B",   // vermelho (negativo)
    s:  "#94A3B8",   // slate (neutro/inativo)
  },
};

// Poppins matches the humanist rounded style of the ViaJourney logotype
export const F = "'Poppins', 'Inter', system-ui, sans-serif";
