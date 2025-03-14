import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
  retry,
} from '@reduxjs/toolkit/query/react';

const REDUCER_PATH = 'widgetStarterKitApi';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const determineEndpoint = (baseUrl?: string): string => {
  // eventually we will use the 1FE helper function for this
  // e.g. platform.network.getESignProxyUrlForESignEnvironment(baseUrl);
  // see proposed structure here {{ FILL IN }}
  return `/api/proxy/`;
};

const enhancedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  return retry(
    fetchBaseQuery({
      baseUrl: determineEndpoint(),
      timeout: 60000,
      prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        return headers;
      },
    }),
    { maxRetries: 3 },
  )(args, api, extraOptions);
};

export const baseApi = createApi({
  baseQuery: enhancedBaseQuery,
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
  reducerPath: REDUCER_PATH,
  refetchOnReconnect: true,
});
