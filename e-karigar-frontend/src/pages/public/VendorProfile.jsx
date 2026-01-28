import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import RatingStars from '../../components/RatingStars';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Stack from '../../components/layout/Stack';

export default function VendorProfile(){
  const { vendorId } = useParams();
  const { vendors, services } = useData();
  const vendor = vendors.find(v => v.id === vendorId);

  if (!vendor) return <Container><h2>Vendor not found</h2></Container>;

  const servs = services.filter(s => s.vendorId === vendorId);

  return (
    <>
      <Section>
        <Container>
          <Card>
            <Stack gap={8}>
              <div style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:12}}>
                <h1 style={{marginRight:8}}>{vendor.name}</h1>
                {vendor.verified && <Badge>✔ Verified</Badge>}
              </div>
              <RatingStars value={vendor.rating} />
              <p style={{color:'#9CA3AF'}}>Location: {vendor.location}</p>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <Button as={Link} to="/client/booking" size="lg">Book</Button>
                <Button as={Link} to="/vendor/chat" variant="secondary" size="lg">Chat</Button>
              </div>
            </Stack>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="section-header"><h2>Services</h2></div>
          <Grid cols="auto">
            {servs.map(s => (
              <Card key={s.id}>
                <h3>{s.title}</h3>
                <p style={{color:'#9CA3AF'}}>Category: {s.category}</p>
                <p><strong>Rs {s.price}</strong></p>
                <Button as={Link} to="/client/booking">Select</Button>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="section-header"><h2>Portfolio</h2></div>
          <Grid cols="auto">
            {vendor.portfolio.map((src,i)=>
              <img key={i} src={src} alt={`Portfolio ${i+1}`} style={{width:'100%', borderRadius:12, border:'1px solid #334155'}}/>
            )}
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="section-header"><h2>Location</h2></div>
          <Card>Map placeholder (embed when backend/API available)</Card>
        </Container>
      </Section>
    </>
  );
}