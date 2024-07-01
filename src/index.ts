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
  apiKey: string | undefined;
  from: string | undefined;
  to: string | undefined;
  subject: string;
  mailOnSuccess?: boolean;
  mailOnFailure?: boolean;
  linkToResults?: string;
  showError?: boolean;
  quiet?: boolean;
}

class MailReporter implements Reporter {
  private suite: Suite | undefined;

  constructor(
    private options: MailReporterOptions = {
      apiKey: undefined,
      from: undefined,
      to: undefined,
      subject: "Playwright Test Results",
      linkToResults: undefined,
      mailOnSuccess: true,
      mailOnFailure: true,
      showError: false,
      quiet: false,
    }
  ) {
    console.log(`Using the Mail Reporter`);

    // Set default options
    if (typeof options.mailOnSuccess === "undefined") {
      this.options.mailOnSuccess = true;
    }

    if (typeof options.mailOnFailure === "undefined") {
      this.options.mailOnFailure = true;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`Using development mode`);

      // Do not return the API key
      const clonedOptions = Object.assign({}, this.options);
      clonedOptions.apiKey = clonedOptions.apiKey
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
