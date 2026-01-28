import React from 'react';
import Card from '../../components/Card';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Stack from '../../components/layout/Stack';

export default function AdminDashboard(){
  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Admin Dashboard</h1>
          <Grid cols="auto">
            <Card><h3>Total vendors</h3><p style={{color:'#9CA3AF'}}>UI placeholder</p></Card>
            <Card><h3>Total bookings</h3><p style={{color:'#9CA3AF'}}>UI placeholder</p></Card>
            <Card><h3>Income analytics</h3><p style={{color:'#9CA3AF'}}>UI placeholder</p></Card>
            <Card><h3>Traffic graphs</h3><p style={{color:'#9CA3AF'}}>UI placeholder</p></Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}