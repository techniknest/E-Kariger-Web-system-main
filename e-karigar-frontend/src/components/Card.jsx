import styled from 'styled-components';
const Card = styled.div`
  background: ${({theme}) => theme.colors.card};
  border: 1px solid ${({theme}) => theme.colors.ui.border};
  border-radius: ${({theme}) => theme.radius.lg};
  box-shadow: ${({theme}) => theme.shadow.sm};
  padding: ${({theme}) => theme.space[5]}px;
`;
export default Card;
``