import { Request } from 'express';

// import { readMagicBoxConfigs } from "./magicbox-configs";

export const getRequestHost = (req: Request) => {
    // TODO: Can we just return this request host?
    return `https://${req.hostname}`;
    // if (readMagicBoxConfigs().mode === "development") {
    //   return LOCAL_HOST_URL;
    // } else if (
    //   !IS_PROD ||
    //   allowedHostNames.some((regex) => regex.test(req.hostname.toLowerCase()))
    // ) {
    //   return `https://${req.hostname}`;
    // } else {
    //   throw new Error(`${req.hostname} is not a valid 1ds-app host name.`);
    // }
  };