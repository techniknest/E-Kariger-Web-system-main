import React from 'react';
import Card from '../../components/Card';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Settings(){
  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>System Settings</h1>
          <Card>
            <ul>
              <li>Enable / disable vendors</li>
              <li>Category management</li>
              <li>Platform rules</li>
            </ul>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}