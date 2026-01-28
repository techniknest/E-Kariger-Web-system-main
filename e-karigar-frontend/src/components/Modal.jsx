
import React from 'react';
import Card from './Card';
export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:999
    }}>
      <Card style={{maxWidth:520, width:'92%'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{background:'transparent', color:'#9CA3AF', border:'none', cursor:'pointer'}}>✕</button>
        </div>
        {children}
      </Card>
    </div>
  );
}
``
