# Mail Reporter for Playwright

[![npm version](https://badge.fury.io/js/playwright-mail-reporter.svg)](https://badge.fury.io/js/playwright-mail-reporter)
[![Downloads](https://img.shields.io/npm/dt/playwright-mail-reporter)](https://www.npmjs.com/package/playwright-mail-reporter)
![License](https://img.shields.io/github/license/estruyf/playwright-mail-reporter)

This reporter allows you to send an email with the test results after the test run is finished.

## Prerequisites

To use this reporter, you will need to have the SMTP server details to send out the emails. Make sure you have the following details:

- Host
- Port
- Username
- Password

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
    [
      'playwright-mail-reporter',
      {
        host: "<host>",
        port: "<port>",
        username: "<username>",
        password: "<password>",
        from: "<from>",
        to: "<to>", // Comma separated list of email addresses
        subject: "<subject>",
        apiKey: "<api>"
      }
    ]
  ],
});
```

Here is an example of how you can configure the reporter with Resend:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    [
      'playwright-mail-reporter',
      {
        host: "smtp.resend.com",
        port: 465,
        username: "resend",
        password: `<YOUR_API_KEY>`,
        from: "Elio <no-reply@elio.dev>",
        to: "Elio <elio@struyfconsulting.be>"
      }
    ]
  ],
});
```

> More information on how to use reporters can be found in the [Playwright documentation](https://playwright.dev/docs/test-reporters).

## Configuration

The reporter supports the following configuration options:

| Option | Description | Required | Default |
| --- | --- | --- | --- |
| `host` | The SMTP server host | `true` | `undefined` |
| `port` | The SMTP server port | `true` | `undefined` |
| `username` | The SMTP server username | `true` | `undefined` |
| `password` | The SMTP server password | `true` | `undefined` |
| `from` | The email address from which the email will be sent | `true` | `undefined` |
| `to` | The email addresses to which the email will be sent (comma separated) | `true` | `undefined` |
| `subject` | The subject of the email | `false` | `Playwright Test Results` |
| `linkToResults` | Link to the test results | `false` | `undefined` |
| `mailOnSuccess` | Send the email on success | `false` | `true` |
| `showError` | Show the error details in the email | `false` | `false` |
| `quiet` | Do not show any output in the console | `false` | `false` |

<br />

[![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fplaywright-mail-reporter&countColor=%23263759)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Festruyf%2Fplaywright-mail-reporter)
