
import React from 'react';
import Card from './Card';
export default function EmptyState({ title='Nothing here', action }) {
  return <Card role="status">
    <h3 style={{marginBottom:8}}>{title}</h3>
    {action}
  </Card>;
}
