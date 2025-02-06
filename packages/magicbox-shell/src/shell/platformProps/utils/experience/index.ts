import { title } from './title';

export const initExperience = (widgetId: string) => ({
  title: title(widgetId),
});
