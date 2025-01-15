import { makeBadge } from 'badge-maker';


/*
TODO:
- update label and color. Currently stubbed
*/

// const BADGE_COLORS: Partial<Record<HostedEnvironment, string>> = {
//     integration: '#00D8C6',
//     stage: '#983DD8',
//     demo: '#FF6948',
//     production: '#38E869',
//   };

type badgeStyles =
  | 'flat'
  | 'plastic'
  | 'flat-square'
  | 'for-the-badge'
  | 'social'
  | undefined;


export const badgeMaker = (widgetId: string, widgetVersion: string) => {
  const format = {
    label: 'development', // (Optional) Badge label
    message: widgetVersion, // (Required) Badge message
    labelColor: '#555', // (Optional) Label color
    color: '#00D8C6', // (Optional) Message color

    style: 'for-the-badge' as badgeStyles,
  };

  try {
    return makeBadge(format);
  } catch (e: any) {
    throw new Error('Something went wrong creating a badge' + e?.message);
  }
};
