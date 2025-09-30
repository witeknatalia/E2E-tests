import { config as baseConfig } from "./wdio.conf";

export const config = {
  ...baseConfig,
  hostname: "localhost",
  port: 4444,
  maxInstances: 5,
  capabilities: [
    {
      maxInstances: 1,
      browserName: "chrome",
    },
    {
      maxInstances: 1,
      browserName: "firefox",
    },
  ],
  services: ["docker"],
};
