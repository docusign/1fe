import { platformProps } from '@devhub/1fe-shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';
export const GetAbsoluteWidgetPath = () => {
  // const t = useTranslate();
  return (
    <div data-qa='utils.navigation.getAbsoluteWidgetPath.container'>
      <Button
        data-qa='utils.navigation.getAbsoluteWidgetPath.btn'
        onClick={() => {
          const absoluteWidgetPath =
            platformProps.utils.navigation.getAbsoluteWidgetPath();
          window.alert(absoluteWidgetPath);
        }}
      >
        {'utils.navigation.getAbsoluteWidgetPath'}
        {/* {t('Components.Navigation.GetAbsoluteWidgetPathText')} */}
      </Button>
    </div>
  );
};
