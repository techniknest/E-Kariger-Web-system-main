import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useParams } from 'react-router-dom';
import * as api from '../../mock/api';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Review(){
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { refresh } = useData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);

  async function submit(){
    try {
      await api.leaveReview({ bookingId, clientId: user.id, rating, comment });
      await refresh();
    } catch (e) { setError(e.message); }
  }

  return (
    <Section>
      <Container>
        <div style={{maxWidth:640, margin:'0 auto'}}>
          <Card>
            <Stack gap={12}>
              <h2>Leave a Review</h2>
              <label>Rating <input type="number" min="1" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))} style={{marginLeft:8}}/></label>
              <textarea placeholder="Your feedback" value={comment} onChange={e=>setComment(e.target.value)} style={{width:'100%', height:120, padding:10, border:'1px solid #334155', borderRadius:8, background:'transparent'}}/>
              {error && <div role="alert" style={{color:'#EF4444'}}>{error}</div>}
              <Button onClick={submit} size="lg">Submit Review</Button>
            </Stack>
          </Card>
        </div>
      </Container>
    </Section>
  );
}