import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import RatingStars from '../../components/RatingStars';
import { useData } from '../../context/DataContext';

export default function Category(){
  const { name } = useParams();
  const categoryName = decodeURIComponent(name);
  const { vendors, services } = useData();

  // Get all vendorIds that have services in this category
  const vendorIds = Array.from(new Set(services.filter(s => s.category === categoryName).map(s => s.vendorId)));
  const vendorList = vendors.filter(v => vendorIds.includes(v.id));

  return (
    <Section>
      <Container>
        <h1>{categoryName} Vendors</h1>
        <div style={{height:12}}/>
        {vendorList.length === 0 ? (
          <Card><p style={{color:'#9CA3AF'}}>No vendors found for this category.</p></Card>
        ) : (
          <Grid cols="auto">
            {vendorList.map(v => (
              <Card key={v.id}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <h3 style={{margin:0}}>{v.name}</h3>
                  {v.verified && <Badge>✔ Verified</Badge>}
                </div>
                <div style={{marginTop:6}}><RatingStars value={v.rating}/></div>
                <p style={{color:'#9CA3AF'}}>Location: {v.location}</p>
                <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
                  <Button as={Link} to={`/vendors/${v.id}`}>View Profile</Button>
                  <Button as={Link} to="/client/booking" variant="secondary">Book</Button>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}
``