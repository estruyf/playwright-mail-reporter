import { TestCase } from "@playwright/test/reporter";

export const getTestAnnotations = async (test: TestCase): Promise<string> => {
  if (!test || !test.annotations) {
    return "";
  }

  let list = [];
  const isList = test.annotations.length > 1;
  for (const annotation of test.annotations) {
    if (isList) {
      list.push(
        `<li><b>${annotation.type}</b>: ${annotation.description}</li>`
      );
    } else {
      list.push(`<b>${annotation.type}</b>: ${annotation.description}`);
    }
  }

  return isList
    ? `<ul style="padding-left: 0;">${list.join("")}</ul>`
    : list.join("");
};
