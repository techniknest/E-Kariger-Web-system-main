import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Register(){
  const { register } = useAuth();
  const [role, setRole] = useState('client');
  const [orgType, setOrgType] = useState('Individual');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd);
    try {
      await register({ ...payload, role, orgType });
    } catch (err) { setError(err.message); }
  };

  return (
    <Section>
      <Container>
        <div style={{maxWidth:640, margin:'0 auto'}}>
          <Card>
            <Stack gap={16}>
              <div>
                <h2>Register</h2>
                <p style={{color:'#9CA3AF'}}>Create a client or vendor account</p>
              </div>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <Button variant={role==='client'?'secondary':'ghost'} onClick={()=>setRole('client')}>Client</Button>
                <Button variant={role==='vendor'?'secondary':'ghost'} onClick={()=>setRole('vendor')}>Vendor</Button>
              </div>

              <form onSubmit={onSubmit} style={{display:'grid', gap:12}}>
                <FormField name="name" label="Full name" required />
                <FormField name="email" type="email" label="Email" required />
                {role === 'vendor' && (
                  <>
                    <FormField as="select" name="orgType" label="Vendor Type" value={orgType} onChange={e=>setOrgType(e.target.value)}>
                      <option>Individual</option>
                      <option>Team</option>
                      <option>Company</option>
                    </FormField>
                    <FormField name="cnic" type="file" label="CNIC (optional for verification)" />
                    <small style={{color:'#9CA3AF'}}>Admin approval required before you can operate.</small>
                  </>
                )}
                {error && <div role="alert" style={{color:'#EF4444'}}>{error}</div>}
                <Button type="submit" size="lg">Create Account</Button>
              </form>
            </Stack>
          </Card>
        </div>
      </Container>
    </Section>
  );
}