import React from 'react';
import Container from './layout/Container';

export default function Footer(){
  return (
    <footer style={{borderTop:'1px solid #334155', marginTop:24}}>
      <Container>
        <div style={{padding:'16px 0', color:'#9CA3AF', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
          <span>© {new Date().getFullYear()} E‑Karigar</span>
          <span>Made for the Haripur community</span>
        </div>
      </Container>
    </footer>
  );
}
