
import styled from 'styled-components';
const Badge = styled.span`
  display:inline-flex; align-items:center; gap:6px;
  padding: 4px 8px; border-radius: 999px;
  background: ${({theme}) => theme.colors.ui.border};
  color: ${({theme}) => theme.colors.text.secondary};
  font-size: 12px;
`;
export default Badge;
``
