import { Request } from 'express';

import { DUMMY_URL, REDIRECT_URI, STATE } from "../constants";

/**
 * Use dummy base url to create URL object from href and get params
 *
 * @param href e.g. /send?param1=value1&param2=value2
 * @returns new URL(DUMMY_URL + href)
 */
export const getSearchParamsFromHref = (href: string): URLSearchParams => {
    const url = new URL(DUMMY_URL + href);
    return url.searchParams;
  };

/**
 * Given a request on /authenticate endpoint after account server login,
 * return the redirectUri on the state query parameter
 *
 * @param req Express request
 * @returns redirectUri from state parameter of request url
 */
export const getRedirectUri = (req: Request): string | null => {
    try {
      // TODO: strongly type req
      const stateParam = (req as any).query[STATE] as string | undefined;
      const parsedStateParam = JSON.parse(stateParam || '{}') as Record<
        string,
        string
      >;
  
      return parsedStateParam[REDIRECT_URI];
    } catch (e) {}
  
    return null;
  };
  

export const getParamFromQueryOrRedirectUri = (
    req: Request,
    queryParam: string,
  ): string | null => {
    try {
      // TODO: strongly type req
      const queryParamValue = (req as any).query[queryParam] as string | undefined;
  
      if (queryParamValue) {
        return queryParamValue;
      }
  
      const redirectUri = getRedirectUri(req);
  
      if (redirectUri) {
        const searchParams = getSearchParamsFromHref(redirectUri);
        return searchParams.get(queryParam);
      }
    } catch (e) {
      console.error('[1DS] Error getting query param', {
        // TODO: strongly type req
        query: (req as any).query,
        queryParam,
        error: e,
      });
    }
  
    return null;
  };