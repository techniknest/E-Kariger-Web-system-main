const theme = {
  colors: {
    bg: '#0F172A',
    surface: '#111827',
    card: '#1E293B',
    primary: '#22C55E',
    secondary: '#3B82F6',
    text: {
      primary: '#E5E7EB',
      secondary: '#9CA3AF',
      muted: '#6B7280'
    },
    status: {
      success: '#22C55E',
      warning: '#FACC15',
      error:   '#EF4444',
      info:    '#38BDF8'
    },
    ui: {
      border: '#334155',
      hover:  '#2563EB',
      disabled: '#475569',
      divider: 'rgba(148,163,184,0.16)'
    }
  },
  fonts: {
    heading: "'Poppins', system-ui, -apple-system, Segoe UI, Roboto",
    body: "'Inter', system-ui, -apple-system, Segoe UI, Roboto",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco"
  },
  radius: { sm:'8px', md:'12px', lg:'16px', xl:'20px' },
  shadow: { sm:'0 1px 2px rgba(0,0,0,.25)', md:'0 8px 24px rgba(0,0,0,.35)', lg:'0 16px 44px rgba(0,0,0,.45)' },
  layout: { maxWidth:'1200px', sidebarWidth:'264px', headerHeight:'64px' },
  space: { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 7:28, 8:32, 10:40, 12:48, 16:64, 20:80, 24:96 },
  typography: { h1:'clamp(28px, 4vw, 40px)', h2:'clamp(22px, 3vw, 28px)', h3:'clamp(18px, 2.2vw, 22px)', body:'16px', small:'13px' }
};
export default theme;