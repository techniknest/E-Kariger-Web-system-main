import styled from 'styled-components';
const Section = styled.section`
  padding: ${({theme})=>theme.space[12]}px 0;
  @media (min-width: 768px) { padding: ${({theme})=>theme.space[16]}px 0; }
  & > .section-header { margin-bottom: ${({theme})=>theme.space[6]}px; }
`;
export default Section;