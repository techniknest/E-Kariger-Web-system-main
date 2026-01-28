
import styled from 'styled-components';
const colorMap = (t, theme) => ({
  'Created': theme.colors.ui.border,
  'Pending Vendor Approval': theme.colors.status.info,
  'Accepted': theme.colors.secondary,
  'In Progress': theme.colors.primary,
  'Completed': theme.colors.status.success,
  'Cancelled': theme.colors.status.error,
  'Expired': theme.colors.text.muted
}[t] || theme.colors.ui.border);

const Pill = styled.span`
  padding: 4px 10px; border-radius: 999px; font-size: 12px;
  color: #0b1221;
  background: ${({theme, state}) => colorMap(state, theme)};
`;

export default function StatusPill({ state }){ return <Pill state={state}>{state}</Pill>; }
