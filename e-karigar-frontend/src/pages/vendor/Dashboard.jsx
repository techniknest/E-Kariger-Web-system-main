import React from 'react';
import Card from '../../components/Card';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatusPill from '../../components/StatusPill';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Stack from '../../components/layout/Stack';

export default function VendorDashboard(){
  const { bookings } = useData();
  const { user } = useAuth();
  const my = bookings.filter(b => b.vendorId === user?.id);

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Vendor Dashboard</h1>
          <Grid cols="auto">
            <Card><h3>Earnings summary</h3><p style={{color:'#9CA3AF'}}>UI only; calculated from completed bookings</p></Card>
            <Card><h3>Booking stats</h3><p style={{color:'#9CA3AF'}}>Accepted / In Progress / Completed</p></Card>
            <Card><h3>Upcoming jobs</h3><p style={{color:'#9CA3AF'}}>Shows next confirmed bookings</p></Card>
            <Card><h3>Rating overview</h3><p style={{color:'#9CA3AF'}}>Avg. rating from reviews</p></Card>
          </Grid>
          <Card>
            <h3>Recent bookings</h3>
            <div className="divider" style={{margin:'8px 0'}}/>
            <ul>{my.map(b => <li key={b.id} style={{margin:'6px 0'}}><StatusPill state={b.state} /> #{b.id}</li>)}</ul>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}