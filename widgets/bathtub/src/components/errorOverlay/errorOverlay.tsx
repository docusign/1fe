import styled from '@emotion/styled';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Hotkeys from 'react-hot-keys';
import { Button } from 'antd';

import { parseError } from './parseError';
import { Box, Column, Row } from '../layout';
import { useTranslate } from '../../locales';
import { useAppDispatch } from '../../store';
import { appActions } from '../../store/app';

type TitleProps = {
  type: 'error' | 'info';
  'data-qa': string;
};

const Title = styled.p`
  font-family:
    ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
    'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
  color: ${(props: TitleProps) =>
    props.type === 'error' ? '#DB3939' : '#191823'};
  font-weight: 600;
  padding: 0;
  margin: 0;
`;

// from @ds/tokens inkSpacingTokens
const xs = '16px';

const Text = styled.p`
  margin: 0;
  padding: ${xs} 0 0 0;
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  font-family:
    ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
    'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
    'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
`;

// from @ds/tokens
const borderRadiusDefault = '2px';
const spacingS = '24px';
const bgColorCanvasDocument = '#ebeff3';

const Section = styled(Box)`
  padding: ${spacingS};
  borderradius: ${borderRadiusDefault};
  background: ${bgColorCanvasDocument};
`;

type ErrorOverlayProps = {
  children: React.ReactNode;
};

const Fallback: React.FC<
  FallbackProps & { widgetId?: string; widgetUrl?: string }
> = ({ error, resetErrorBoundary }) => {
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const errorData = parseError(error);

  const clean = () => {
    resetErrorBoundary?.();
    dispatch(appActions.renderWidget());
  };

  return (
    <Column gap={spacingS}>
      <Section>
        <Row css={{ alignContent: 'center' }}>
          <Column justify='center'>
            <Title data-qa='bathtub.error.type' type='error'>
              {errorData.type}
            </Title>
            <h2 data-qa='bathtub.error.heading'>
              {t('Bathtub.Renderer.HelpFailedHeader')}
            </h2>
            <Text>{t('Bathtub.Renderer.HelpFailed')}</Text>
          </Column>
          <Hotkeys keyName='cmd+esc' onKeyDown={clean}>
            <Button onClick={clean}>
              {t('Bathtub.Renderer.HelpFailedAction')}
            </Button>
          </Hotkeys>
        </Row>
      </Section>

      <Section>
        <Row css={{ alignContent: 'center' }}>
          <Row.Flex flex='1' justify='center'>
            <Title data-qa='bathtub.error.message' type='error'>
              {errorData.message}
            </Title>
            <Title data-qa='bathtub.error.location' type='info'>
              {t('Bathtub.Renderer.HelpFailureLocation', {
                WIDGET: errorData.widget,
                LOCATION: errorData.location,
              })}
            </Title>
          </Row.Flex>
          <a href={`${errorData.file}`} target='_blank'>
            {t('Bathtub.Renderer.HelpFailureOpenFile')}
          </a>
          {/* <Box>Open in editor: {errorData.file}</Box> */}
        </Row>
      </Section>

      <Column.Flex flex='1'>
        <Section>
          <h3 data-qa='bathtub.error.stackHeading'>
            {t('Bathtub.Renderer.HelpFailureStackTrace')}
          </h3>
          <Pre>{errorData.stack}</Pre>
        </Section>
      </Column.Flex>
    </Column>
  );
};

export const ErrorOverlay = ({ children }: ErrorOverlayProps) => {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
};
