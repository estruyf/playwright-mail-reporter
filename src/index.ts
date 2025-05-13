import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  FullResult,
  TestResult,
} from "@playwright/test/reporter";
import { processResults } from "./utils";

export interface MailReporterOptions {
  // SMTP options
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  // Mail options
  from: string | undefined;
  to: string | undefined;
  subject: string;
  mailOnSuccess?: boolean;
  linkToResults?: string;
  showError?: boolean;
  quiet?: boolean;
  debug?: boolean;
}

class MailReporter implements Reporter {
  private suite: Suite | undefined;

  constructor(private options: MailReporterOptions) {
    const defaultOptions: MailReporterOptions = {
      host: undefined,
      port: undefined,
      secure: true,
      username: undefined,
      password: undefined,
      from: undefined,
      to: undefined,
      subject: "Playwright Test Results",
      linkToResults: undefined,
      mailOnSuccess: true,
      showError: false,
      quiet: false,
      debug: false,
    };

    this.options = { ...defaultOptions, ...options };

    // Set default options
    if (typeof options.mailOnSuccess === "undefined") {
      this.options.mailOnSuccess = true;
    }

    console.log(`Using the Mail Reporter`);

    if (process.env.NODE_ENV === "development" || this.options.debug) {
      console.log(`Using debug mode`);

      // Do not return the API key
      const clonedOptions = Object.assign({}, this.options);
      clonedOptions.password = clonedOptions.password
        ? "**********"
        : "NOT DEFINED";
      console.log(`Options: ${JSON.stringify(clonedOptions, null, 2)}`);
    }
  }

  onBegin(_: FullConfig, suite: Suite) {
    this.suite = suite;
  }

  onStdOut(
    chunk: string | Buffer,
    _: void | TestCase,
    __: void | TestResult
  ): void {
    if (this.options.quiet) {
      return;
    }

    const text = chunk.toString("utf-8");
    process.stdout.write(text);
  }

  onStdErr(chunk: string | Buffer, _: TestCase, __: TestResult) {
    if (this.options.quiet) {
      return;
    }

    const text = chunk.toString("utf-8");
    process.stderr.write(text);
  }

  async onEnd(_: FullResult) {
    await processResults(this.suite, this.options);
  }
}

export default MailReporter;
