import { config as sharedConfig } from "./wdio.conf";

const config = {
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

exports.config = config;
