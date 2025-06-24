import * as fs from "fs";
import * as path from "path";
import TestRail from "testrail-api";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const resultsFile = path.join(__dirname, "testrail-results.json");

const testrail = new TestRail({
  host: "https://nataliaproject.testrail.io",
  user: process.env.TESTRAIL_USERNAME!,
  password: process.env.TESTRAIL_API_TOKEN!,
});

function getCaseId(title: string) {
  const caseIdPattern = /(?:C|Case )(\d+)/i;
  const match = title.match(caseIdPattern);
  return match ? parseInt(match[1]) : null;
}

function saveTestResult(testResult: {
  case_id: number;
  [key: string]: unknown;
}) {
  let allResults: { case_id: number; [key: string]: unknown }[] = [];

  try {
    if (fs.existsSync(resultsFile)) {
      allResults = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
    }
  } catch (err) {
    console.error("Error reading results file:", err);
  }

  const existingIndex = allResults.findIndex(
    (r) => r.case_id === testResult.case_id,
  );
  if (existingIndex >= 0) {
    allResults[existingIndex] = testResult;
  } else {
    allResults.push(testResult);
  }

  try {
    fs.writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));
  } catch (err) {
    console.error("Error writing results file:", err);
  }
}

export async function afterTest(test: Test, context: unknown, passed: boolean) {
  const caseId = getCaseId(test.title);
  if (!caseId) return;

  const result = {
    case_id: caseId,
    status_id: passed ? 1 : 5, // 1 = Passed, 5 = Failed
    comment: `Test ${passed ? "passed" : "failed"} in ${path.basename(test.file)}`,
  };

  saveTestResult(result);
}

export async function onComplete() {
  try {
    if (!fs.existsSync(resultsFile)) {
      return;
    }

    const resultsData = fs.readFileSync(resultsFile, "utf8");
    const results = JSON.parse(resultsData);

    if (results.length === 0) {
      return;
    }

    const caseIds = [
      ...new Set(results.map((r: { case_id: unknown }) => Number(r.case_id))),
    ].filter((id): id is number => typeof id === "number" && !isNaN(id));

    const runName = `Automated Run ${new Date().toLocaleString()}`;
    console.log(`🏃 Creating TestRail run: "${runName}"`);

    const projectId = Number(process.env.TESTRAIL_PROJECT_ID);
    if (!projectId || isNaN(projectId)) {
      throw new Error(
        "TESTRAIL_PROJECT_ID environment variable is not set or not a valid number.",
      );
    }

    const run = await testrail
      .addRun(projectId, {
        name: `Run ${new Date().toISOString()}`,
        include_all: false,
        case_ids: caseIds,
      })
      .catch((error: { response: { status: unknown; data: unknown } }) => {
        console.error("Error creating run:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        throw error;
      });

    console.log(`📤 Submitting ${results.length} results to TestRail...`);

    await testrail.addResultsForCases(run.body.id, results);

    console.log(`🎉 Results successfully submitted.`);

    fs.unlinkSync(resultsFile);
  } catch (error) {
    console.error("❌ TestRail submission failed:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    if (typeof error === "object" && error !== null && "response" in error) {
      const errObj = error as {
        response?: { status?: unknown; data?: unknown };
      };
      console.error("Status:", errObj.response?.status);
      console.error("Response data:", errObj.response?.data);
    }
  }
}
