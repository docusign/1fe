import { memo } from 'react';
import { Button } from 'antd';

import { useAppDispatch } from '../../store';
import { appActions } from '../../store/app';
import { platformProps } from '@1fe/shell';

type QuickLinksProps = {
  port: string;
};

export const QuickLinks = memo(({ port }: QuickLinksProps) => {
  const dispatch = useAppDispatch();
  const Sk = platformProps.utils.widgets.get('@1fe/starter-kit');
  return (
    <Button
      onClick={() =>
        dispatch(
          appActions.setActiveWidgetUrl(
            `http://127.0.0.1:${port || '8080'}/js/1fe-bundle.js`,
          ),
        )
      }
    >
      {port}
    </Button>
  );
});
