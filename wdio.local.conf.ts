import { config as sharedConfig } from "./wdio.conf";

export const config = {
  ...sharedConfig,
  ...{
    capabilities: [
      {
        browserName: "chrome",
        "goog:chromeOptions": {
          args: ["headless", "disable-gpu"],
        },
      },
    ],
  },
};
