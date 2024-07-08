import { MailReporterOptions } from "./src/index";
import { PlaywrightTestConfig, defineConfig, devices } from "@playwright/test";

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env" });
}

const config: PlaywrightTestConfig<{}, {}> = {
  testDir: "./tests",
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    [
      "./src/index.ts",
      {
        host: "smtp.resend.com",
        port: 465,
        username: "resend",
        password: process.env.PASSWORD,
        from: "Elio <no-reply@elio.dev>",
        to: "Elio <eliostruyf@gmail.com>",
        subject: "E2E Test Results",
        mailOnSuccess: true,
        linkToResults: "https://github.com/estruyf/playwright-mail-reporter",
        showError: true,
      } as MailReporterOptions,
    ],
  ],
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: "setup.spec.ts",
    },
    {
      name: "chromium",
      // dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(config);
