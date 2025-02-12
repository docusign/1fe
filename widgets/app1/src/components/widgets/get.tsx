import { Button } from 'antd';
import { useReducer } from 'react';

import {
  GetChildWidget,
  GetChildWidgetWithCustomLoader,
  // GetVariant,
} from '../misc/utils';
import { WidgetContainer } from '../misc/widgetContainer';
// import { useTranslate } from 'src/locales';

export const Get = (props) => {
  // const t = useTranslate();
  const [isWidgetVisible, showWidget] = useReducer(() => true, false);
  const [isWidgetWithCustomLoaderVisible, showWidgetWithCustomLoader] =
    useReducer(() => true, false);

  return (
    <div data-qa={'utils.widgets.get.container'}>
      <Button data-qa={'utils.widgets.get.btn'} onClick={showWidget}>
        {'utils.widgets.get'}
        {/* {t('Components.Widgets.Get')} */}
      </Button>
      {isWidgetVisible && (
        <WidgetContainer data-qa={'utils.widgets.get.result.container'}>
          <GetChildWidget isVisible={isWidgetVisible} props={props} />
        </WidgetContainer>
      )}
      <Button
        data-qa={'utils.widgets.get.custom-loader.btn'}
        onClick={showWidgetWithCustomLoader}
      >
        {'utils.widgets.get with custom loader'}
        {/* {t('Components.Widgets.GetWithCustomLoader')} */}
      </Button>
      {isWidgetWithCustomLoaderVisible && (
        <WidgetContainer data-qa={'utils.widgets.get.result.container'}>
          <GetChildWidgetWithCustomLoader
            isVisible={isWidgetWithCustomLoaderVisible}
            props={props}
          />
        </WidgetContainer>
      )}
    </div>
  );
};
