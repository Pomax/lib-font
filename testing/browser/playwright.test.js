import { test, expect } from "@playwright/test";

test(`has title`, async ({ page }) => {
  await page.goto(`http://localhost:8000/`);
  await page.waitForSelector(`#finished`);

  // count how many tests failed
  const failures = await page.evaluate((qs) => {
    return Array.from(document.querySelectorAll(qs)).map((e) =>
      e.textContent.trim()
    );
  }, `.fail`);

  await page.goto(`http://localhost:8000/shutdown`);

  if (failures.length) {
    console.error(`${failures.length} browser tests failed.\n`);
    failures.forEach((f) => console.error(f));
    console.log(``);
  } else {
    console.log(`All browser tests passed.\n`);
  }

  expect(failures.length).toBe(0);
});
