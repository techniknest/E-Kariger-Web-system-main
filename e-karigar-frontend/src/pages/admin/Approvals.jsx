import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import * as api from '../../mock/api';
import { useData } from '../../context/DataContext';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Approvals(){
  const { refresh } = useData();
  const [pending, setPending] = useState([
    { id:'u_vendor2', name:'Hassan Plumber', orgType:'Individual', verified:false }
  ]);

  async function approve(id, verified){
    await api.approveVendor(id, verified);
    setPending(p => p.filter(v => v.id !== id));
    await refresh();
  }

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Vendor Approval</h1>
          <Card>
            <ul style={{display:'grid', gap:12}}>
              {pending.map(v => (
                <li key={v.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                  <div>
                    <strong>{v.name}</strong> <span style={{color:'#9CA3AF'}}>({v.orgType})</span>
                  </div>
                  <div style={{display:'flex', gap:8}}>
                    <Button onClick={()=>approve(v.id, true)}>Approve & Verify</Button>
                    <Button variant="secondary" onClick={()=>approve(v.id, false)}>Approve</Button>
                    <Button danger>Reject</Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}