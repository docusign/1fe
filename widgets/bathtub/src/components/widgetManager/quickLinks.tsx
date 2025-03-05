import { memo } from 'react';
import { Button } from 'antd';

import { useAppDispatch } from '../../store';
import { appActions } from '../..//store/app';

type QuickLinksProps = {
  port: string;
};

export const QuickLinks = memo(({ port }: QuickLinksProps) => {
  const dispatch = useAppDispatch();
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
