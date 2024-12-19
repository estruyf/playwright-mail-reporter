import { TestCase } from "@playwright/test/reporter";
import Convert from "ansi-to-html";
import {
  getTestAnnotations,
  getTestDuration,
  getTestStatus,
  getTestTags,
  getTestTitle,
} from ".";
import { styles } from "../constants";

export const getHtmlTable = async (
  tests: TestCase[],
  showError: boolean
): Promise<string> => {
  const convert = new Convert();

  const content: string[] = [];

  let colLength = 5;
  if (showError) {
    colLength++;
  }

  const titleWidth = "20%";
  const restWidth = 80 / (colLength - 1) + "%";

  content.push(
    `<table role="presentation" border="0" width="100%" style="${styles.table.root}">`
  );
  content.push(`<thead style="${styles.table.thead}">`);
  content.push(`<tr>`);
  content.push(`<th style="${styles.table.th} width:${titleWidth}">Test</th>`);
  content.push(`<th style="${styles.table.th} width:${restWidth}">Status</th>`);
  content.push(
    `<th style="${styles.table.th} width:${restWidth}">Duration</th>`
  );
  content.push(
    `<th style="${styles.table.th} width:${restWidth}">Retries</th>`
  );
  content.push(`<th style="${styles.table.th} width:${restWidth}">Tags</th>`);
  if (showError) {
    content.push(
      `<th style="${styles.table.th} width:${restWidth}">Error</th>`
    );
  }
  content.push(`</tr>`);
  content.push(`</thead>`);
  content.push(`<tbody style="${styles.table.tbody}">`);

  for (const test of tests) {
    // Get the last result
    const result = test.results[test.results.length - 1];

    if (test.annotations) {
      const annotations = await getTestAnnotations(test);
      if (annotations) {
        content.push(`<tr>`);
        content.push(
          `<td style="${styles.table.td}" colspan="${colLength}">${annotations}</td>`
        );
        content.push(`</tr>`);
      }
    }

    content.push(`<tr>`);
    content.push(
      `<td style="${styles.table.td} width:${titleWidth}">${getTestTitle(
        test
      )}</td>`
    );
    content.push(
      `<td style="${styles.table.td} width:${restWidth}">${getTestStatus(
        test,
        result
      )}</td>`
    );
    content.push(
      `<td style="${styles.table.td} width:${restWidth}">${getTestDuration(
        result
      )}</td>`
    );
    content.push(
      `<td style="${styles.table.td} width:${restWidth}">${
        result?.retry || ""
      }</td>`
    );
    content.push(
      `<td style="${styles.table.td} width:${restWidth}">${getTestTags(
        test
      )}</td>`
    );

    if (showError) {
      const error = result?.error?.message || "";
      const errorMarkup = convert.toHtml(error);
      const cleanErrorMarkup = errorMarkup.replace(/style="[^"]*"/g, "");
      content.push(
        `<td style="${styles.table.td} width:${restWidth}">${cleanErrorMarkup}</td>`
      );
    }
    content.push(`</tr>`);
  }

  content.push(`</tbody>`);
  content.push(`</table>`);

  return content.join("\n");
};
