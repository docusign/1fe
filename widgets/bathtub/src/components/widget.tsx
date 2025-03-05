import styled from '@emotion/styled';
import { memo } from 'react';

import { WidgetProps } from '../contract';
import { useAppSelector } from '../store';
import { selectActiveWidgetUrl, selectLoadingOrError } from '../store/app';

import { useTranslate } from '../locales';
import { AppHeader } from './header';
import { Box } from './layout';
import { WidgetRenderer } from './widgetManager';
import { withProvider } from './withProvider';
import { WidgetBrowser } from '../store/widgetBrowser/widgetBrowser';

const Layout = styled(Box)`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
  grid-template-areas: 'header' 'content';
  height: 100%;
  width: 100%;
`;

const Content = styled.main`
  grid-area: content;
  overflow: auto;
  height: 100%;
  width: 100%;
`;

const WidgetInner: React.FC<WidgetProps> = memo((props) => {
  const { isLoading, error } = useAppSelector(selectLoadingOrError);
  const widgetUrl = useAppSelector(selectActiveWidgetUrl);
  const t = useTranslate();
  // TODO
  // useEffect(() => {
  //   dispatch(appThunks.loadWidgets());
  // }, [dispatch]);

  // if (isLoading) {
  //   return (
  //     <Center>
  //       {/* <ProgressCircle text={t('Bathtub.App.Loading')} size='medium' /> */}
  //       Loading...
  //     </Center>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Center>
  //       <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
  //     </Center>
  //   );
  // }

  return (
    <Layout>
      <AppHeader />
      <Content id={'main'}>
        {widgetUrl ? <WidgetRenderer {...props} /> : <WidgetBrowser />}
      </Content>
    </Layout>
  );
});

// eslint-disable-next-line no-restricted-exports
export default withProvider(WidgetInner);
