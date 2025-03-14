// import { platformProps } from '@1fe/shell';
import { Button } from 'antd';

// import { useTranslate } from 'src/locales';

export const GetTitle = (props) => {
  // const t = useTranslate();

  return (
    <div>
      <Button
        data-qa="utils.experience.title.get"
        onClick={() =>
          window.alert(props.platform.utils.experience.title.get())
        }
      >
        utils.experience.title.get
        {/* {t('Components.Experience.GetTitle')} */}
      </Button>
    </div>
  );
};
