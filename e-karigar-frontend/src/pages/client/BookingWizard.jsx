import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import * as api from '../../mock/api';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function BookingWizard(){
  const { services } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState({ serviceId:'', address:'' });

  const chosen = services.find(s => s.id === payload.serviceId);

  async function submit() {
    const booking = await api.createBooking({
      clientId: user.id,
      vendorId: chosen.vendorId,
      serviceId: chosen.id,
      address: payload.address
    });
    navigate(`/client/bookings/${booking.id}`);
  }

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Booking</h1>
          <Card>
            <Stack gap={12}>
              {step===1 && (
                <>
                  <h3>1. Select service</h3>
                  <select value={payload.serviceId} onChange={e=>setPayload(p=>({...p, serviceId:e.target.value}))} aria-label="Select service" style={{padding:'10px', borderRadius:8, border:'1px solid #334155', background:'transparent', color:'#E5E7EB'}}>
                    <option value="">Choose…</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  <Button onClick={()=>setStep(2)} disabled={!payload.serviceId} style={{marginTop:8}}>Next</Button>
                </>
              )}
              {step===2 && (
                <>
                  <h3>2. Enter location</h3>
                  <input placeholder="Address" value={payload.address} onChange={e=>setPayload(p=>({...p, address:e.target.value}))} style={{padding:'10px', borderRadius:8, border:'1px solid #334155', background:'transparent'}}/>
                  <Button onClick={()=>setStep(3)} disabled={!payload.address} style={{marginTop:8}}>Next</Button>
                </>
              )}
              {step===3 && (
                <>
                  <h3>3. Confirm details</h3>
                  <p>Service: {chosen?.title}</p>
                  <p>Vendor: {chosen?.vendorId}</p>
                  <p>Address: {payload.address}</p>
                  <small style={{color:'#9CA3AF'}}>Payment: Cash on completion (recorded only)</small>
                  <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
                    <Button variant="ghost" onClick={()=>setStep(2)}>Back</Button>
                    <Button onClick={()=>setStep(4)}>Confirm</Button>
                  </div>
                </>
              )}
              {step===4 && (
                <>
                  <h3>4. Submit booking</h3>
                  <p>Submitting…</p>
                  {submit()}
                </>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}