
import React from 'react';
export default function Skeleton({ lines=4 }) {
  return <div aria-busy="true" aria-live="polite">
    {Array.from({length:lines}).map((_,i)=>
      <div key={i} style={{height:14, background:'rgba(255,255,255,0.06)', margin:'8px 0', borderRadius:6}}/>
    )}
  </div>;
}
``
