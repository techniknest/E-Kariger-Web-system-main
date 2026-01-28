import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Services(){
  const { services } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const my = services.filter(s => s.vendorId === user?.id);

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Service Management</h1>
          <Card>
            <Stack gap={8}>
              <h3>Add service</h3>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{flex:1, minWidth:240, padding:'10px', border:'1px solid #334155', borderRadius:8, background:'transparent'}}/>
                <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} style={{width:160, padding:'10px', border:'1px solid #334155', borderRadius:8, background:'transparent'}}/>
                <Button disabled>Save (mock)</Button>
              </div>
            </Stack>
          </Card>
          <Card>
            <h3>Your services</h3>
            <div className="divider" style={{margin:'8px 0'}}/>
            <ul>{my.map(s => <li key={s.id} style={{margin:'6px 0'}}>{s.title} — Rs {s.price}</li>)}</ul>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}