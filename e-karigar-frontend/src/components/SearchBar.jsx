import styled from 'styled-components';
import Button from './Button';

const Wrap = styled.form`
  display:grid; grid-template-columns: 1.5fr 1fr 1fr auto auto auto auto;
  gap: 8px; align-items: end;
  background: ${({theme}) => theme.colors.card};
  border:1px solid ${({theme}) => theme.colors.ui.border};
  border-radius: ${({theme}) => theme.radius.lg};
  padding: 12px;

  label { font-size: 12px; color: ${({theme}) => theme.colors.text.secondary}; display:block; margin-bottom:6px; }
  input, select {
    width:100%; background: transparent; border: 1px solid ${({theme}) => theme.colors.ui.border};
    border-radius: ${({theme}) => theme.radius.md};
    color: ${({theme}) => theme.colors.text.primary}; padding: 10px;
  }

  @media (max-width: 920px){
    grid-template-columns: 1fr 1fr;
  }
`;

const Field = ({label, children}) => (
  <div>
    <label>{label}</label>
    {children}
  </div>
);

export default function SearchBar({ onSubmit, defaults={}, categories=[], style }) {
  return (
    <Wrap role="search" aria-label="Search services" onSubmit={(e)=>{e.preventDefault(); onSubmit(new FormData(e.currentTarget));}} style={style}>
      <Field label="Search">
        <input name="q" placeholder="Search a service…" defaultValue={defaults.q || ''} aria-label="Search text"/>
      </Field>

      <Field label="Max price">
        <input name="max" type="number" placeholder="Rs" aria-label="Maximum price" defaultValue={defaults.max || ''}/>
      </Field>

      <Field label="Min price">
        <input name="min" type="number" placeholder="Rs" aria-label="Minimum price" defaultValue={defaults.min || ''}/>
      </Field>

      <div style={{alignSelf:'center'}}>
        <label><input type="checkbox" name="verifiedOnly" defaultChecked={!!defaults.verifiedOnly}/> Verified</label>
      </div>

      <Field label="Minimum rating">
        <select name="rating" defaultValue={defaults.rating || ''} aria-label="Minimum rating">
          <option value="">Any</option>
          <option value="3">3★+</option>
          <option value="4">4★+</option>
          <option value="4.5">4.5★+</option>
        </select>
      </Field>

      <Field label="Category">
        <select name="category" defaultValue={defaults.category || ''} aria-label="Category">
          <option value="">All categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </Field>

      <Button type="submit" aria-label="Search" size="lg">Search</Button>
    </Wrap>
  );
}