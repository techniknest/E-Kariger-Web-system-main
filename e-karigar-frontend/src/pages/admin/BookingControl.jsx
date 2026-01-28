import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import * as api from '../../mock/api';
import { BOOKING_STATES } from '../../utils/constants';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function BookingControl(){
  const { bookings, refresh } = useData();

  async function override(b, state){
    await api.updateBookingState({ bookingId: b.id, state });
    await refresh();
  }

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Booking Control</h1>
          <Card>
            <ul style={{display:'grid', gap:12}}>
              {bookings.map(b => (
                <li key={b.id} style={{display:'grid', gap:8}}>
                  <div>#{b.id} — <em>{b.state}</em></div>
                  <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                    {Object.values(BOOKING_STATES).map(s => <Button key={s} variant="ghost" onClick={()=>override(b, s)}>{s}</Button>)}
                    <Button danger onClick={()=>override(b, BOOKING_STATES.CANCELLED)}>Manual Cancel</Button>
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