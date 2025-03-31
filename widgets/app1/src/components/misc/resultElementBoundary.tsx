import styled from '@emotion/styled';

/*
Styles for <pre> text content to make it more responsive. 
Prevents horizontal scroll bars on the entire window, 
forcing content to scroll within its own container if it 
cannot wrap.
*/

export const ResultElementBoundary = styled.pre({
  /* offset max-width to account for vertical scroll bar */
  maxWidth: 'calc(100vw - 40px)',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
});
