// import { z } from 'zod';

// import { getCdnBaseUrl } from './cdn';

// export const WidgetEnvironmentActivity = z.object({
//   dateTime: z.string().datetime().optional(),
//   pipelineUrl: z.string().url().optional(),
//   contributors: z.array(z.string()).default([]),
//   widgetVersion: z.string().optional(),
// });

// export const WidgetActivity = z.object({
//   repoUrl: z.string().url(),
//   adoProjectUrl: z.string().url(),
//   sourceBranch: z.string(),
//   lastModified: z.object({
//     integration: WidgetEnvironmentActivity.optional(),
//     stage: WidgetEnvironmentActivity.optional(),
//     demo: WidgetEnvironmentActivity.optional(),
//     production: WidgetEnvironmentActivity.optional(),
//   }),
// });
// export type WidgetActivity = z.infer<typeof WidgetActivity>;

// export const WidgetActivityResult = z.record(WidgetActivity);
// export type WidgetActivityResult = z.infer<typeof WidgetActivityResult>;

// export const downloadWidgetActivity =
//   async (): Promise<WidgetActivityResult> => {
//     try {
//       const baseUrl = getCdnBaseUrl('integration');
//       const res = await (
//         await fetch(
//           `https://${baseUrl}/integration/1fe/configs/widget-activity.json`,
//           { method: 'GET' },
//         )
//       ).json();

//       return WidgetActivityResult.parse(res);
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   };
