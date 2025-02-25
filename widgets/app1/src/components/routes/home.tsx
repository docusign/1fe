import { platformProps } from '@devhub/magicbox-shell';
// import { Interpolate } from '@ds/react-utils';
import styled from '@emotion/styled';
import { Flex } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

import { jsonReplacer } from '../platformPropsImport/comparePlatformProps';
import ResultElementBoundary from '../misc/resultElementBoundary';
// TODO: how does useTranslate work
// import { useTranslate } from 'src/locales';
// import { RootState } from '../../store';

const Container = styled.div({
  padding: '40px',
});

// TODO: strongly type
const Home: React.FC = (props: any) => {
  // const t = useTranslate();
  const greeting = useSelector((state: any) => state.hello.greeting);

  return (
    <Container>
      <h1>{greeting}</h1>
      <Flex vertical>
        <p data-qa='wsk.page.welcome'>
          Welcome to 1FE Starter Kit
        </p>
        <ResultElementBoundary data-qa='wsk.props.data'>
          {JSON.stringify(
            {
              platform: props.platform,
              ...props,
            },
            jsonReplacer(),
            2,
          )}
        </ResultElementBoundary>
      </Flex>
    </Container>
  );
};

export default Home;
