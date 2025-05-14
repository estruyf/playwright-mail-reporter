import { Suite } from "@playwright/test/reporter";
import { MailReporterOptions } from "..";
import {
  getHtmlTable,
  getSummaryDetails,
  getTestHeading,
  getTestsPerFile,
  getTotalStatus,
} from ".";
import { basename } from "path";
import { styles } from "../constants";
import nodemailer from "nodemailer";

export const processResults = async (
  suite: Suite | undefined,
  options: MailReporterOptions
) => {
  if (
    !options.host ||
    !options.port
  ) {
    console.error("Missing SMTP options");
    return;
  }

  if (!options.from) {
    console.error("Missing from email address");
    return;
  }

  if (!options.to) {
    console.error("Missing to email address");
    return;
  }

  if (!suite) {
    return;
  }

  const transportOptions: {
      host: string;
      secure?: boolean;
      port: number;
      auth?: {
          user: string;
          pass: string;
      };
  } = {
      host: options.host,
      secure: options.secure,
      port: options.port,
  };
  if (options.username && options.password) {
      transportOptions.auth = {
          user: options.username,
          pass: options.password,
      };
  }

  const transporter = nodemailer.createTransport(transportOptions);

  const totalStatus = getTotalStatus(suite.suites);
  const summary = getSummaryDetails(suite);

  const testMarkup = [];
  for (const crntSuite of suite.suites) {
    const project = crntSuite.project();
    const tests = getTestsPerFile(crntSuite);

    for (const filePath of Object.keys(tests)) {
      const fileName = basename(filePath);

      const content = await getHtmlTable(tests[filePath], !!options.showError);

      if (content) {
        testMarkup.push(
          `<h3 style="${styles.heading3}">${getTestHeading(
            fileName,
            process.platform,
            project
          )}</h3>`
        );
        testMarkup.push(content);
      }
    }
  }

  const totalFailed = totalStatus.failed + totalStatus.timedOut;
  const hasFailed = totalFailed > 0;

  if (!options.mailOnSuccess && !hasFailed) {
    console.log("Not sending email on success");
    return;
  }

  const toFields = options.to.split(",").map((to) => to.trim());

  const info = await transporter.sendMail({
    from: options.from,
    to: toFields.join(", "),
    subject: `${options.subject} - ${hasFailed ? "Failed" : "Success"}`,
    html: `<h2 style="${styles.heading2}">Summary</h2>
${summary}

<h2 style="${styles.heading2}">Test results</h2>
${testMarkup.join("")}

${
  options.linkToResults
    ? `<br/><hr/><br/><a style="${styles.anchor}" href="${options.linkToResults}">View results</a>`
    : ""
}
    `,
  });

  console.log(`Message sent: ${info.messageId}`);
};
