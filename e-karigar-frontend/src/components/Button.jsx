import styled, { css } from 'styled-components';
const Base = styled.button`
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  border: 1px solid transparent; border-radius: ${({theme}) => theme.radius.md};
  padding: 10px 16px; background: ${({theme}) => theme.colors.primary};
  color: #03150b; font-weight: 600; cursor: pointer;
  transition: transform .04s ease, filter .2s ease, box-shadow .2s ease;
  &:hover { filter: brightness(1.05); }
  &:active { transform: translateY(1px); }
  &:disabled { background: ${({theme}) => theme.colors.ui.disabled}; color: ${({theme}) => theme.colors.text.muted}; cursor:not-allowed; }
  ${({variant, theme}) => variant === 'secondary' && css` background: ${theme.colors.secondary}; color:#fff; `}
  ${({variant}) => variant === 'ghost' && css`
    background: transparent; border-color: #334155; color: inherit;
    &:hover { background: rgba(255,255,255,0.06); }
  `}
  ${({danger, theme}) => danger && css` background: ${theme.colors.status.error}; color: #fff; `}
  ${({full}) => full && css` width:100%; `}
  ${({size}) => size === 'lg' && css` padding: 12px 18px; font-size: 1rem; `}
`;
export default function Button({ as='button', children, ...props }) {
  return <Base as={as} {...props}>{children}</Base>;
}
