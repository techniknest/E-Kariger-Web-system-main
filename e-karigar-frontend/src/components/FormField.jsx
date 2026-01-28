import React from 'react';
export default function FormField({ label, as='input', error, ...rest }) {
  const id = rest.id || rest.name;
  const Comp = as;
  return (
    <div style={{display:'grid', gap:6}}>
      <label htmlFor={id} style={{color:'#9CA3AF'}}>{label}</label>
      <Comp id={id} {...rest} style={{
        background:'transparent', color:'#E5E7EB', border:'1px solid #334155',
        borderRadius:8, padding:'10px'
      }}/>
      {error && <span role="alert" style={{color:'#EF4444', fontSize:12}}>{error}</span>}
    </div>
  );
}
