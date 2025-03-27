import { platformProps } from '@devhub/1fe-shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';
export const GetPluginRoute = () => {
  // const t = useTranslate();
  const { utils } = platformProps;
  return (
    <div data-qa='utils.navigation.getPluginRoute.container'>
      <Button
        data-qa='utils.navigation.getPluginRoute.btn'
        onClick={() => {
          const pluginRoute = utils.navigation.getPluginRoute();
          window.alert(pluginRoute);
        }}
      >
        {'utils.navigation.getPluginRoute from @1fe/shell'}
        {/* {t('Components.Navigation.GetPluginRouteTextFromShellImport')} */}
      </Button>
    </div>
  );
};
