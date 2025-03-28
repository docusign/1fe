/** @jsxImportSource @emotion/react */
import { Flex } from 'antd';
import React from 'react';

// import { WidgetProps } from 'src/contract';
// import { Analytics } from 'src/deleteMe/components/analytics/analytics';
// import { AppLoadTime } from 'src/deleteMe/components/appLoadTime/appLoadTime';
import { Context } from '../context/context';
import { EventBus } from '../eventBus/eventBus';
import { Experience } from '../experience';
// import { Experiments } from 'src/deleteMe/components/experiments';
// import { I18n } from 'src/deleteMe/components/i18n';
import { LocalAndSessionStorage } from '../localAndSessionStorage';
// import { Logger } from 'src/deleteMe/components/logger';
import { Navigation } from '../navigation';
// import { Network } from 'src/deleteMe/components/network';
// import { PlatformPropsImport } from '../platformPropsImport';
// import { User } from 'src/deleteMe/components/user';
import { Widgets } from '../widgets';
// import { useTranslate } from 'src/locales';

import {
  utilsDemoContentStyles,
  utilSectionHeaderStyles,
} from './styles/utilsDemo.styles';
import { AppLoadTime } from '../appLoadTime/appLoadTime';
import { CustomLoader } from '../customLogger';

const UtilsDemo = () => {
  // const t = useTranslate();

  return (
    <div css={[utilsDemoContentStyles, utilSectionHeaderStyles]}>
      <h1>1FE Utils Demo</h1>
      {/* <h1 data-qa='wsk.page.utils'>{t('Components.Routes.UtilsDemoHeader')}</h1> */}

      <Flex vertical>
        <Context />
        <Navigation />
        {/* <Experiments /> */}
        <Widgets />
        {/* <Network /> */}
        <LocalAndSessionStorage />
        <Experience />
        {/* <Logger /> */}
        <EventBus />
        <AppLoadTime />
        <CustomLoader />
        {/*
        <Analytics />
        <I18n />
        <User /> */}
        <hr />
        {/* <PlatformPropsImport {...props} /> */}
      </Flex>
    </div>
  );
};

export default UtilsDemo;
