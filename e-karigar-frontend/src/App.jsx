import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import { useAuth } from './context/AuthContext';
import styled from 'styled-components';
import Footer from './components/Footer';

const Shell = styled.div`
  display: grid;
  grid-template-columns: ${({showSidebar, theme}) => showSidebar ? `${theme.layout.sidebarWidth} 1fr` : '1fr'};
  min-height: calc(100vh - ${({theme})=>theme.layout.headerHeight});
`;

const Main = styled.main` padding: 24px; `;

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isAuthSection = pathname.startsWith('/login') || pathname.startsWith('/register');
  const showSidebar = user?.role === 'vendor' || user?.role === 'admin';

  return (
    <>
      {!isAuthSection && <TopNav />}
      <Shell showSidebar={showSidebar}>
        {showSidebar && <Sidebar />}
        <Main aria-live="polite">
          <AppRoutes />
          {!isAuthSection && <Footer />}
        </Main>
      </Shell>
    </>
  );
}
