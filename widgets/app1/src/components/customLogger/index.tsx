/** @jsxImportSource @emotion/react */

import { Button } from 'antd';
import { platformProps } from '@devhub/1fe-shell';
import { utilSectionStyles } from '../routes/styles/utilsDemo.styles';

/**
 * Custom Utility examples
 */
export const CustomLoader: React.FC = () => {
  return (
    <div css={utilSectionStyles} data-qa='utils.experience.container'>

      <h1>utils.custom.logger</h1>
      <Button
        data-qa='utils.experience.title.set'
        onClick={() => platformProps.utils.logger.log('Example log message')}
      >
        utils.logger.log
      </Button>
      <Button
        data-qa='utils.experience.title.set'
        onClick={() => platformProps.utils.logger.error('Example error message')}
      >
        utils.logger.error
      </Button>
    </div>
  );
};
