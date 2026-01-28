import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import { isEmail, required } from '../../utils/validators';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Login(){
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd);
    const errs = {};
    if (!isEmail(payload.email)) errs.email = 'Valid email required';
    if (!required(payload.password)) errs.password = 'Password required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try { setSubmitting(true); await login(payload); } catch (err) { setErrors({form: err.message}); } finally { setSubmitting(false); }
  };

  return (
    <Section>
      <Container>
        <div style={{maxWidth:480, margin:'0 auto'}}>
          <Card>
            <Stack gap={12}>
              <div>
                <h2>Login</h2>
                <p style={{color:'#9CA3AF'}}>Role auto‑detection after login</p>
              </div>
              <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
                <FormField name="email" type="email" label="Email" error={errors.email}/>
                <FormField name="password" type="password" label="Password" error={errors.password}/>
                {errors.form && <div role="alert" style={{color:'#EF4444'}}>{errors.form}</div>}
                <Button type="submit" disabled={submitting} full size="lg">Login</Button>
              </form>
            </Stack>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
