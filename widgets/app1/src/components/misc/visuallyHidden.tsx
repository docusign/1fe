import styled from '@emotion/styled';

/*
Styles to visually hide text while still allowing 
it to be available to assistive technology.
*/
export const VisuallyHidden = styled.p({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});
