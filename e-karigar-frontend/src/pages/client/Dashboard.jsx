import React from 'react';
import Card from '../../components/Card';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import StatusPill from '../../components/StatusPill';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Stack from '../../components/layout/Stack';

export default function ClientDashboard(){
  const { bookings } = useData();
  const { user } = useAuth();
  const my = bookings.filter(b => b.clientId === user?.id);

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Client Dashboard</h1>
          <Grid cols="auto">
            <Card><h3>Easier booking</h3><p style={{color:'#9CA3AF'}}>Quick access to your active bookings & chats.</p></Card>
            <Card><h3>Top categories</h3><p style={{color:'#9CA3AF'}}>Explore electricians, plumbers, carpenters and more.</p></Card>
          </Grid>
          <Card>
            <h3>Active bookings</h3>
            <div className="divider" style={{margin:'8px 0'}}/>
            {my.length === 0 ? <p style={{color:'#9CA3AF'}}>No bookings yet</p> : (
              <ul>
                {my.map(b => <li key={b.id} style={{margin:'8px 0'}}>
                  <StatusPill state={b.state}/> &nbsp;
                  <Link to={`/client/bookings/${b.id}`}>View</Link>
                </li>)}
              </ul>
            )}
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}
``