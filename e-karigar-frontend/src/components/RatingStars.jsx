
import React from 'react';
export default function RatingStars({ value=0, outOf=5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({length:outOf}, (_,i)=>{
    if (i < full) return '★';
    if (i === full && half) return '⯨';
    return '☆';
  }).join(' ');
  return <span aria-label={`Rating ${value} out of ${outOf}`} style={{color:'#FACC15'}}>{stars}</span>;
}
``
