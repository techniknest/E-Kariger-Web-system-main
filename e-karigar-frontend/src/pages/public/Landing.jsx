import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';
import Grid from '../../components/layout/Grid';

export default function Landing(){
  const { categories, vendors } = useData();
  const [query, setQuery] = useState(null);

  return (
    <>
      {/* Hero */}
      <Section style={{
        background: 'radial-gradient(1200px 400px at 50% -50%, rgba(59,130,246,.25), rgba(34,197,94,.08) 40%, transparent 70%)'
      }}>
        <Container>
          <Stack gap={16} style={{textAlign:'center', padding:'24px 0'}}>
            <h1>Find trusted <span style={{color:'#22C55E'}}>Karigars</span> near you</h1>
            <p style={{color:'#9CA3AF', maxWidth:720, margin:'0 auto'}}>Search, chat, and book skilled workers in a few clicks. Admin‑verified vendors build trust in the community.</p>
            <SearchBar categories={categories} onSubmit={(fd)=>setQuery(Object.fromEntries(fd))} style={{maxWidth:900, margin:'0 auto'}}/>
          </Stack>
        </Container>
      </Section>

      {/* Categories */}
      <Section>
        <Container>
          <div className="section-header"><h2>Popular Categories</h2></div>
          <Grid gap={12} cols="auto">
            {categories.map(c => (
              <Card key={c.id}>
                <strong style={{display:'block', marginBottom:8}}>{c.name}</strong>
                <Button as={Link} to={`/categories/${encodeURIComponent(c.name)}`} variant="secondary">View {c.name}</Button>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Featured vendors */}
      <Section>
        <Container>
          <div className="section-header"><h2>Featured Vendors</h2></div>
          <Grid gap={12} cols="auto">
            {vendors.slice(0,6).map(v => (
              <Card key={v.id}>
                <h3 style={{marginBottom:6}}>{v.name}</h3>
                <p style={{color:'#9CA3AF'}}>Location: {v.location}</p>
                <Button as={Link} to={`/vendors/${v.id}`} style={{marginTop:8}}>View Profile</Button>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* How it works */}
      <Section>
        <Container>
          <div className="section-header"><h2>How it works</h2></div>
          <Grid cols="auto">
            {['Search service', 'Chat for details', 'Book & pay cash'].map((t,i)=>
              <Card key={i}><strong style={{marginRight:8}}>{i+1}.</strong> {t}</Card>
            )}
          </Grid>
        </Container>
      </Section>

      {/* Impact */}
      <Section>
        <Container>
          <Card>
            <h2>Empowering our local community</h2>
            <p style={{color:'#9CA3AF'}}>Creating jobs and trust through verified vendors and admin oversight.</p>
          </Card>
        </Container>
      </Section>
    </>
  );
}
