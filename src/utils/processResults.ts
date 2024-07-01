import { Suite } from "@playwright/test/reporter";
import { MailReporterOptions } from "..";
import { Resend } from "resend";
import {
  getHtmlTable,
  getSummaryDetails,
  getTestHeading,
  getTestsPerFile,
  getTotalStatus,
} from ".";
import { basename } from "path";
import { styles } from "../constants";

export const processResults = async (
  suite: Suite | undefined,
  options: MailReporterOptions
) => {
  if (!options.from || !options.to || !options.apiKey) {
    return;
  }

  if (!suite) {
    return;
  }

  const resend = new Resend(options.apiKey);

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

  const hasFailed = totalStatus.failed > 0;

  if (!options.mailOnFailure && hasFailed) {
    console.log("Not sending email on failure");
    return;
  }

  if (!options.mailOnSuccess && !hasFailed) {
    console.log("Not sending email on success");
    return;
  }

  const { error } = await resend.emails.send({
    from: options.from,
    to: [...options.to],
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

  if (error) {
    return console.error({ error });
  }
};
