import styled from '@emotion/styled';

import { Box, BoxProps } from './box';

type Justify =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

type Align = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';

type FlexProps = BoxProps & {
  justify?: Justify;
  align?: Align;
  flex: string;
};

const Flex = styled(Box)`
  justify-self: ${(props: FlexProps) => props.justify};
  align-self: ${(props: FlexProps) => props.align};
  flex: ${(props: FlexProps) => props.flex ?? '1'};
  width: ${(props: ColumnProps) => props.width ?? '100%'};
  height: ${(props: ColumnProps) => props.height ?? '100%'};
`;

const withFlex = <T,>(Component: T): T & { Flex: typeof Flex } => {
  (Component as T & { Flex: typeof Flex }).Flex = Flex;
  return Component as T & { Flex: typeof Flex };
};

type RowProps = BoxProps & {
  justify?: Justify;
  align?: Align;
  gap?: string;
  wrap?: string;
};

const Row = withFlex(styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: ${(props: RowProps) => props.justify};
  align-items: ${(props: RowProps) => props.align};
  gap: ${(props: RowProps) => props.gap};
  flex-wrap: ${(props: RowProps) => props.wrap};
  width: ${(props: ColumnProps) => props.width ?? '100%'};
  height: ${(props: ColumnProps) => props.height ?? '100%'};
`);

type ColumnProps = BoxProps & {
  justify?: Justify;
  align?: Align;
  gap?: string;
};

const Column = withFlex(styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: ${(props: ColumnProps) => props.justify};
  align-items: ${(props: ColumnProps) => props.align};
  gap: ${(props: ColumnProps) => props.gap};
  width: ${(props: ColumnProps) => props.width ?? '100%'};
  height: ${(props: ColumnProps) => props.height ?? '100%'};
`);

export { Column, Row };
