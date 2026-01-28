import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Analytics(){
  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Analytics & Reports</h1>
          <Card>
            <p style={{color:'#9CA3AF'}}>Vendor performance, income reports</p>
            <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
              <Button>Download CSV</Button>
              <Button variant="secondary">Download PDF</Button>
            </div>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}