import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import { useData } from '../../context/DataContext';
import * as api from '../../mock/api';
import { BOOKING_STATES } from '../../utils/constants';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function BookingStatus(){
  const { bookingId } = useParams();
  const { bookings, refresh } = useData();
  const [busy, setBusy] = useState(false);
  const b = bookings.find(x => x.id === bookingId);

  useEffect(()=>{}, [bookingId]);

  if (!b) return <Container><h2>Booking not found</h2></Container>;

  async function cancel() {
    setBusy(true);
    try { await api.updateBookingState({ bookingId: b.id, state: BOOKING_STATES.CANCELLED }); await refresh(); }
    finally { setBusy(false); }
  }
  const canCancel = api.canClientCancel(b);

  return (
    <Section>
      <Container>
        <Card>
          <Stack gap={12}>
            <h2>Booking Status</h2>
            <p><StatusPill state={b.state}/></p>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <Button as={Link} to="/vendor/chat" variant="secondary">Open Chat</Button>
              <Button onClick={cancel} disabled={!canCancel || busy} danger title={!canCancel ? 'Cancellation allowed only within 5 minutes' : ''}>Cancel</Button>
            </div>
            <p style={{color:'#9CA3AF'}}>You can leave a review after completion.</p>
          </Stack>
        </Card>
      </Container>
    </Section>
  );
}