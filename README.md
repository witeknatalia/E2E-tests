  # WebdriverIO E2E Tests — Docker Grid + TestRail

  E2E test automation for the [Sauce Demo](https://www.saucedemo.com/) web shop with
  WebdriverIO and TypeScript. Tests run locally or in parallel on Chrome and Firefox in a
  Selenium Grid in Docker, and results are reported automatically to TestRail.

  ## Highlights

  - **WebdriverIO v9 + TypeScript + Mocha**, structured with the **Page Object Model**
  - **Selenium Grid in Docker**: hub plus Chrome and Firefox nodes via `docker-compose`
    (an ARM variant for Apple Silicon is included)
  - **TestRail integration**: test titles carry TestRail case IDs (`C1`, `C2`, …); after the run
    a TestRail test run is created and every result is posted to its case
  - **GitHub Actions CI** on every push and pull request; logs are uploaded as an artifact
    when a run fails
  - Credentials kept out of the code: `.env` locally, repository secrets in CI
  - ESLint + Prettier

  ## Test cases

  | TestRail ID | Scenario |
  |-------------|----------|
  | C1 | Login as a standard user, then log out |
  | C2 | Login attempt as a locked-out user shows an error |
  | C3 | Login as a performance-glitch user |

  ## Project structure

  ```
  test/
    pageobjects/   page.ts (base page), login.page.ts
    specs/         login.e2e.ts
  testrail-integration.ts   afterTest / onComplete hooks that report to TestRail
  wdio.conf.ts              base config
  wdio.local.conf.ts        local browser
  wdio.docker.conf.ts       Selenium Grid (Chrome + Firefox)
  docker-compose.yml        Selenium hub + browser nodes (docker-compose-arm.yml for ARM)
  ```

  ## Setup

  ```bash
  git clone https://github.com/witeknatalia/E2E-tests.git
  cd E2E-tests
  npm install
  ```

  Create a `.env` file in the project root:

  ```bash
  USER_STANDARD_LOGIN=standard_user
  USER_LOCKED_LOGIN=locked_out_user
  USER_GLITCH_LOGIN=performance_glitch_user
  USER_PASSWORD=secret_sauce
  # optional, for TestRail reporting
  TESTRAIL_USERNAME=your_email
  TESTRAIL_API_TOKEN=your_api_token
  ```

  ## Running tests

  ```bash
  npm run test:local      # local browser
  npm run wdio            # base config

  # Selenium Grid in Docker (Chrome + Firefox in parallel)
  docker compose up -d    # or: docker compose -f docker-compose-arm.yml up -d
  npm run wdio:docker
  ```
