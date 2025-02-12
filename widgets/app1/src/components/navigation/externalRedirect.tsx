// import { platformProps } from '@1ds/shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';
export const ExternalRedirect = (props) => {
  // const t = useTranslate();
  return (
    <div data-qa='utils.navigation.externalRedirect.container'>
      <Button
        data-qa='utils.navigation.externalRedirect.btn'
        onClick={() => {
          props.platform.utils.navigation.externalRedirect('https://google.com');
        }}
      >
        {'utils.navigation.externalRedirect'}
        {/* {t('Components.Navigation.ExternalRedirectText')} */}
      </Button>
    </div>
  );
};
