import styled from 'styled-components';
const Stack = styled.div`
  display: grid;
  gap: ${({gap=16}) => gap}px;
`;
export default Stack;