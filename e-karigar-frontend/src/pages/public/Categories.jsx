import React from 'react';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

export default function Categories(){
  const { categories, vendors, services } = useData();

  // Count vendors per category by checking if vendor has services in that category
  const vendorHasCategory = (vendorId, catName) => services.some(s => s.vendorId === vendorId && s.category === catName);

  return (
    <Section>
      <Container>
        <h1>Categories</h1>
        <div style={{height:12}}/>
        <Grid cols="auto">
          {categories.map(c => {
            const count = vendors.filter(v => vendorHasCategory(v.id, c.name)).length;
            return (
              <Card key={c.id}>
                <h3 style={{marginBottom:6}}>{c.name}</h3>
                <p style={{color:'#9CA3AF'}}>{count} vendor(s)</p>
                <Button as={Link} to={`/categories/${encodeURIComponent(c.name)}`} variant="secondary">View {c.name}</Button>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}
