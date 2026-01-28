import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Aside = styled.aside`
  width: ${({theme})=>theme.layout.sidebarWidth};
  border-right: 1px solid ${({theme}) => theme.colors.ui.border};
  padding: 16px;
  position: sticky; top: ${({theme})=>theme.layout.headerHeight};
  height: calc(100vh - ${({theme})=>theme.layout.headerHeight});
  overflow:auto;
`;
const Item = styled(NavLink)`
  display:block; padding: 10px 12px; border-radius: 8px; margin-bottom: 6px;
  color: ${({theme}) => theme.colors.text.secondary};
  &.active { background: ${({theme}) => theme.colors.card}; color: ${({theme}) => theme.colors.text.primary}; }
  &:hover { background: rgba(255,255,255,0.06); }
`;

export default function Sidebar(){
  const { user } = useAuth();
  const menus = {
    vendor: [
      { to:'/vendor', label:'Dashboard' },
      { to:'/vendor/bookings', label:'Bookings' },
      { to:'/vendor/services', label:'Services' },
      { to:'/vendor/chat', label:'Chat' },
      { to:'/vendor/earnings', label:'Earnings' }
    ],
    admin: [
      { to:'/admin', label:'Dashboard' },
      { to:'/admin/approvals', label:'Vendor Approvals' },
      { to:'/admin/bookings', label:'Booking Control' },
      { to:'/admin/analytics', label:'Analytics & Reports' },
      { to:'/admin/settings', label:'System Settings' }
    ]
  };
  const items = menus[user?.role] || [];
  return (
    <Aside aria-label="Sidebar">
      {items.map(m => <Item key={m.to} to={m.to} className={({isActive}) => isActive ? 'active' : ''}>{m.label}</Item>)}
    </Aside>
  );
}
