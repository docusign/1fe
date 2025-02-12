// import { platformProps } from '@1ds/shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';
export const GetAbsoluteWidgetPath = (props) => {
  // const t = useTranslate();
  return (
    <div data-qa='utils.navigation.getAbsoluteWidgetPath.container'>
      <Button
        data-qa='utils.navigation.getAbsoluteWidgetPath.btn'
        onClick={() => {
          const absoluteWidgetPath =
            props.platform.utils.navigation.getAbsoluteWidgetPath();
          window.alert(absoluteWidgetPath);
        }}
      >
        {'utils.navigation.getAbsoluteWidgetPath'}
        {/* {t('Components.Navigation.GetAbsoluteWidgetPathText')} */}
      </Button>
    </div>
  );
};
