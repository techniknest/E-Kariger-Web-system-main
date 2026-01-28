import React from 'react';
import Card from '../../components/Card';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Earnings(){
  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Earnings</h1>
          <Card>
            <h3>Daily / Monthly income</h3>
            <p style={{color:'#9CA3AF'}}>UI placeholder; values computed from bookings (cash recorded).</p>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}