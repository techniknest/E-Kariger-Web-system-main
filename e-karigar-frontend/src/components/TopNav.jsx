import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Bar = styled.header`
  position: sticky; top: 0; z-index: 100;
  height: ${({theme})=>theme.layout.headerHeight};
  background: rgba(17,24,39,0.7); backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({theme}) => theme.colors.ui.border};
`;
const Inner = styled.div`
  height: 100%;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  max-width: ${({theme}) => theme.layout.maxWidth}; margin: 0 auto; padding: 0 20px;
`;
const Brand = styled(Link)`
  font-weight:700; display:inline-flex; align-items:baseline; gap:6px;
  &:focus-visible { outline-offset: 4px; }
`;
const NavLinks = styled.nav`
  display:flex; align-items:center; gap:16px;
  a { color: ${({theme})=>theme.colors.text.secondary}; padding: 8px 10px; border-radius: 8px; }
  a:hover { background: rgba(255,255,255,0.06); color: ${({theme})=>theme.colors.text.primary}; }
`;
const Actions = styled.div` display:flex; align-items:center; gap:8px; `;

export default function TopNav(){
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <Bar role="banner">
      <Inner>
        <Brand to="/" aria-label="E‑Karigar Home">
          <span style={{fontSize:'18px'}}>E‑Karigar</span>
          <span style={{color:'#22C55E', fontSize:'12px'}}>Haripur</span>
        </Brand>

        <NavLinks aria-label="Primary">
          <Link to="/categories">Categories</Link>
          <Link to="/client/search">Services</Link>
        </NavLinks>

        <Actions>
          {!user && pathname !== '/login' && <Button as={Link} to="/login">Login</Button>}
          {!user && pathname !== '/register' && <Button as={Link} to="/register" variant="secondary">Register</Button>}
          {user && <>
            <Button as={Link} to={`/${user.role}`} variant="ghost">{user.name}</Button>
            <Button onClick={logout} danger>Logout</Button>
          </>}
        </Actions>
      </Inner>
    </Bar>
  );
}