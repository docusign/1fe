import styled from '@emotion/styled';

type BoxProps = {
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  overflow?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  border?: string;
  ['data-qa']?: string;
};

const Box = styled.div`
  margin: ${(props: BoxProps) => props.margin};
  padding: ${(props: BoxProps) => props.padding};
  width: ${(props: BoxProps) => props.width};
  height: ${(props: BoxProps) => props.height};
  min-width: ${(props: BoxProps) => props.minWidth};
  min-height: ${(props: BoxProps) => props.minHeight};
  max-width: ${(props: BoxProps) => props.maxWidth};
  max-height: ${(props: BoxProps) => props.maxHeight};
  overflow: ${(props: BoxProps) => props.overflow};
  position: ${(props: BoxProps) => props.position};
  border: ${(props: BoxProps) => props.border};
  ${(props: BoxProps) => props['data-qa'] && `data-qa=${props['data-qa']}`};
`;

const Center = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props: BoxProps) => props.width ?? '100%'};
  height: ${(props: BoxProps) => props.height ?? '100%'};
`;

export { Box, Center, type BoxProps };
