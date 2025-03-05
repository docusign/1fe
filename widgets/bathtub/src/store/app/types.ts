import { EntityState } from '@reduxjs/toolkit';

import { Environment } from '../../services/cdn';
import { Widget } from '../../services/widget';

type AppState = EntityState<Widget> & {
  activeWidgetProps: string;
  activeWidgetUrl: string | undefined;
  environment: Environment;
  error: string | undefined;
  isPropsEditorOpen: boolean;
  isWidgetSwitcherOpen: boolean;
  loading: boolean;
  tickTock: boolean;
  hasPropsError: boolean;
};

export type { AppState };
