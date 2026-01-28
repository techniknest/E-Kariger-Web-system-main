import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../mock/api';
import { BOOKING_STATES } from '../../utils/constants';
import StatusPill from '../../components/StatusPill';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Bookings(){
  const { bookings, refresh } = useData();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const my = bookings.filter(b => b.vendorId === user?.id);

  async function progress(b, to) {
    setBusy(true);
    try { await api.updateBookingState({ bookingId: b.id, state: to }); await refresh(); }
    finally { setBusy(false); }
  }

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Booking Management</h1>
          <Card>
            <ul style={{display:'grid', gap:12}}>
              {my.map(b => (
                <li key={b.id} style={{display:'grid', gap:6}}>
                  <div><StatusPill state={b.state}/> #{b.id}</div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    {b.state==='Pending Vendor Approval' && <>
                      <Button onClick={()=>progress(b, BOOKING_STATES.ACCEPTED)} disabled={busy}>Accept</Button>
                      <Button danger onClick={()=>progress(b, BOOKING_STATES.CANCELLED)} disabled={busy}>Reject</Button>
                    </>}
                    {b.state==='Accepted' && <Button onClick={()=>progress(b, BOOKING_STATES.IN_PROGRESS)} disabled={busy}>Start</Button>}
                    {b.state==='In Progress' && <Button onClick={()=>progress(b, BOOKING_STATES.COMPLETED)} disabled={busy}>Complete</Button>}
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