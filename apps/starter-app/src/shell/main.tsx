// @ts-ignore
import renderMagicBoxShell from '@devhub/magicbox-shell';
import '@devhub/magicbox-shell/dist/index.css';

const setup = () => {
  const ENVIRONMENT: string = process.env.NODE_ENV || 'integration';

  const envModeMap: Record<string, string> = {
    development: 'development',
    integration: 'preproduction',
    stage: 'preproduction',
    demo: 'production',
    production: 'production',
  };

  // TODO: Just read from server configs put on DOM
  renderMagicBoxShell({
    mode: envModeMap[ENVIRONMENT],
    environment: ENVIRONMENT,
    auth: {
      isAuthedCallback: (widgetId: string): boolean => {
        console.log(widgetId, ' is authenticated.');
        return true;
      },
      unauthedCallback: (widgetId: string) => {
        console.log(widgetId, ' is not authenticated.');         
      }
    }
  });
};

setup();
