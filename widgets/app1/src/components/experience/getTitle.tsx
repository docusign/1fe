import { platformProps } from '@devhub/1fe-shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';

export const GetTitle = () => {
  // const t = useTranslate();

  return (
    <div>
      <Button
        data-qa='utils.experience.title.get'
        onClick={() => window.alert(platformProps.utils.experience.title.get())}
      >
        utils.experience.title.get
        {/* {t('Components.Experience.GetTitle')} */}
      </Button>
    </div>
  );
};
