# Mail Reporter for Playwright

This is a mail reporter for Playwright powered by [Resend](https://resend.com). It allows you to send an email with the test results after the test run is finished.

## Prerequisites

This reporter makes use of the [Resend](https://resend.com) service to send out the emails. You need to have an API key from Resend to use this reporter.

## Installation

Install from npm:

```bash
npm install playwright-mail-reporter
```

## Usage

You can configure the reporter by adding it to the `playwright.config.js` file:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    [
      'playwright-mail-reporter',
      {
        from: "<from>",
        to: ["<to>"],
        subject: "<subject>",
        apiKey: "<api>"
      }
    ]
  ],
});
```

> More information on how to use reporters can be found in the [Playwright documentation](https://playwright.dev/docs/test-reporters).

## Configuration

The reporter supports the following configuration options:

| Option | Description | Default |
| --- | --- | --- |
| `apiKey` | Your [Resend](https://resend.com) API key | `undefined` |
| `from` | The email address from which the email will be sent | `undefined` |
| `to` | The email addresses to which the email will be sent | `undefined` |
| `subject` | The subject of the email | `Playwright Test Results` |
| `linkToResults` | Link to the test results | `undefined` |
| `mailOnSuccess` | Send the email on success | `true` |
| `mailOnFailure` | Send the email on failure | `true` |
| `showError` | Show the error details in the email | `false` |
| `quiet` | Do not show any output in the console | `false` |

<br />

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fplaywright-mail-reporter&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fplaywright-mail-reporter)
