import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  status: string;
  retry: number;
}

interface Test {
  projectName: string;
  status: string;
  results: TestResult[];
}

interface Spec {
  title: string;
  tests: Test[];
}

interface Suite {
  title: string;
  specs: Spec[];
  suites?: Suite[];
}

interface PlaywrightReport {
  suites: Suite[];
}

interface FlakyTest {
  specTitle: string;
  projectName: string;
  attempts: number;
}

function collectFlakyTests(suites: Suite[], prefix = ''): FlakyTest[] {
  return suites.flatMap((suite) => {
    const title = prefix ? `${prefix} > ${suite.title}` : suite.title;
    const fromSpecs = suite.specs.flatMap((spec) =>
      spec.tests
        .filter((t) => t.status === 'flaky')
        .map((t) => ({
          specTitle: `${title} > ${spec.title}`,
          projectName: t.projectName,
          attempts: t.results.length,
        })),
    );
    return [...fromSpecs, ...collectFlakyTests(suite.suites ?? [], title)];
  });
}

const reportPath = path.resolve(__dirname, '../test-results/results.json');

if (!fs.existsSync(reportPath)) {
  console.error(`No test results found at ${reportPath}`);
  console.error('Ensure the JSON reporter is configured and tests have run.');
  process.exit(1);
}

const report: PlaywrightReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const flaky = collectFlakyTests(report.suites);

if (flaky.length > 0) {
  console.warn(`\n${flaky.length} test(s) passed only after retries:`);
  flaky.forEach(({ specTitle, projectName, attempts }) =>
    console.warn(`  - ${specTitle} [${projectName}] (${attempts} attempts)`),
  );
  process.exit(1);
}

console.log('No flaky tests detected.');
