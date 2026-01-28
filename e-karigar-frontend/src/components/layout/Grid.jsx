import styled from 'styled-components';
const Grid = styled.div`
  display: grid;
  gap: ${({gap=12}) => gap}px;
  grid-template-columns: ${({cols='1'}) => cols === 'auto' ? 'repeat(auto-fit, minmax(260px, 1fr))' : `repeat(${cols}, 1fr)`};
`;
export default Grid;