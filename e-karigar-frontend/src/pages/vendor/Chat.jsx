import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Container from '../../components/layout/Container';
import Section from '../../components/layout/Section';
import Stack from '../../components/layout/Stack';

export default function Chat(){
  const [messages,setMessages] = useState([{from:'client', text:'Salam, available today?'},{from:'vendor', text:'Wa Alaikum Assalam, yes after 4pm.'}]);
  const [text,setText] = useState('');
  return (
    <Section>
      <Container>
        <Stack gap={16}>
          <h1>Chat</h1>
          <Card>
            <Stack gap={8}>
              <div style={{height:320, overflow:'auto', border:'1px solid #334155', borderRadius:12, padding:12, marginBottom:4, background:'rgba(17,24,39,.5)'}}>
                {messages.map((m,i)=><div key={i} style={{
                  display:'flex', justifyContent: m.from==='vendor'?'flex-end':'flex-start', margin:'6px 0'
                }}>
                  <span style={{display:'inline-block', padding:'8px 12px', borderRadius:12, background:'rgba(255,255,255,0.06)'}}>{m.text}</span>
                </div>)}
              </div>
              <div style={{display:'flex', gap:8}}>
                <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type message…" style={{flex:1, padding:'10px', border:'1px solid #334155', borderRadius:8, background:'transparent'}}/>
                <Button onClick={()=>{ if(text){ setMessages(ms=>[...ms,{from:'vendor', text}]); setText(''); } }}>Send</Button>
              </div>
              <small style={{color:'#9CA3AF'}}>Admin can view chats for trust & safety.</small>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Section>
  );
}
``