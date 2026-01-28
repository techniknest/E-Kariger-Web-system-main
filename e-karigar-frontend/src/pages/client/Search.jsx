import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useData } from '../../context/DataContext';
import * as api from '../../mock/api';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { currency } from '../../utils/formatters';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Grid from '../../components/layout/Grid';
import Stack from '../../components/layout/Stack';

export default function Search(){
  const { categories } = useData();
  const [items, setItems] = useState([]);

  async function onSubmit(fd) {
    const q = Object.fromEntries(fd);
    const res = await api.searchServices({
      q: q.q, category: q.category, verifiedOnly: !!q.verifiedOnly,
      rating: q.rating ? Number(q.rating) : undefined,
      price: { min: q.min ? Number(q.min) : undefined, max: q.max ? Number(q.max) : undefined }
    });
    setItems(res);
  }

  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Find Services</h1>
          <SearchBar categories={categories} onSubmit={onSubmit}/>
          <Grid cols="auto">
            {items.map(s => (
              <Card key={s.id}>
                <h3>{s.title}</h3>
                <RatingStars value={s.rating}/>
                <p style={{color:'#9CA3AF'}}>{s.category}</p>
                <p><strong>{currency(s.price)}</strong></p>
                <Button as={Link} to={`/vendors/${s.vendorId}`}>View Vendor</Button>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}