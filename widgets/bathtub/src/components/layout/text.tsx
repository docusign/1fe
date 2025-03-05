import styled from '@emotion/styled';

type TextProps = {
  margin?: string;
  padding?: string;
  overflow?: string;
  color?: string;
  ['data-qa']?: string;
};

const Text = styled.div`
  margin: ${(props: TextProps) => props.margin ?? 0};
  padding: ${(props: TextProps) => props.padding ?? 0};
  overflow: ${(props: TextProps) => props.overflow};
  color: ${(props: TextProps) => props.color};
  ${(props: TextProps) => props['data-qa'] && `data-qa=${props['data-qa']}`};
`;

export { Text, type TextProps };
