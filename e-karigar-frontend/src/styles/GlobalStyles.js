import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *,*::before,*::after{ box-sizing:border-box; }
  *{ margin:0; }
  html,body,#root{ height:100%; }
  body {
    line-height:1.5; -webkit-font-smoothing:antialiased;
    background:${({theme})=>theme.colors.bg};
    color:${({theme})=>theme.colors.text.primary};
    font-family:${({theme})=>theme.fonts.body};
    font-size:${({theme})=>theme.typography.body};
  }
  img, picture, video, canvas, svg { display:block; max-width:100%; }
  input, button, textarea, select { font: inherit; color: inherit; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: ${({theme}) => theme.colors.primary}; color: #07130f; }

  h1{ font-family:${({theme})=>theme.fonts.heading}; font-weight:600; font-size:${({theme})=>theme.typography.h1}; }
  h2{ font-family:${({theme})=>theme.fonts.heading}; font-weight:600; font-size:${({theme})=>theme.typography.h2}; }
  h3{ font-family:${({theme})=>theme.fonts.heading}; font-weight:600; font-size:${({theme})=>theme.typography.h3}; }

  :focus-visible { outline:2px solid ${({theme})=>theme.colors.secondary}; outline-offset:3px; border-radius:6px; }

  .container { width:100%; max-width:${({theme})=>theme.layout.maxWidth}; margin:0 auto; padding: 0 20px; }
  .divider { height:1px; background:${({theme})=>theme.colors.ui.divider}; width:100%; }
`;
export default GlobalStyles;
``