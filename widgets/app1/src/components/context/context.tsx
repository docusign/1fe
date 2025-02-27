// import { platformProps } from '@1ds/shell';
import { Button, Flex } from 'antd';
import { useReducer, useState } from 'react';

import { GetChildWidget } from '../misc/utils';
import { WidgetContainer } from '../misc/widgetContainer';
// import { useTranslate } from 'src/locales';

export const Context = (props) => {
  const [isVisible, showWidget] = useReducer(() => true, false);
  const [contextResult, setContextResult] = useState('');

  // const t = useTranslate();

  return (
    <div data-qa='utils.context.container'>
      <h1>utils.context</h1>
      {/* <h1>{t('Components.Context.Index')}</h1> */}

      <Flex>
        <Button
          size='large'
          data-qa='utils.context.get.btn'
          onClick={showWidget}
        >
          utils.context.get
          {/* {t('Components.Context.GetButtonText')} */}
        </Button>
        <Button
          size='large'
          data-qa='utils.context.get.btn'
          onClick={() => {
            setContextResult(JSON.stringify(props.platform.context.self));
            // setContextResult(JSON.stringify(platformProps.context.self));
          }}
        >
          utils.context.self
          {/* {t('Components.Context.SelfButtonText')} */}
        </Button>
        <Button
          size='large'
          data-qa='utils.context.get.btn'
          onClick={() => {
            setContextResult(JSON.stringify(props.platform.context.getHost()));
            // setContextResult(JSON.stringify(platformProps.context.getHost()));
          }}
        >
          utils.context.getHost
          {/* {t('Components.Context.GetHostButtonText')} */}
        </Button>
      </Flex>

      <div data-qa='wsk.context.result.container'>{contextResult}</div>

      {isVisible && (
        <WidgetContainer data-qa='utils.widgets.context.result.container'>
          <GetChildWidget isVisible={isVisible} props={props} />
        </WidgetContainer>
      )}
    </div>
  );
};
