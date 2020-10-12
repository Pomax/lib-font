import puppeteer from "puppeteer";

let failed = false;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:8000/");

    await page.waitForSelector("#finished");

    // count how many tests failed
    const failures = await page.evaluate((qs) => {
      return Array.from(document.querySelectorAll(qs)).map((e) =>
        e.textContent.trim()
      );
    }, `.fail`);

    if (failures.length) {
      failed = true;
      console.error(`${failures.length} browser tests failed.\n`);
      failures.forEach((f) => console.error(f));
      console.log(``);
    } else {
      console.log(`All browser tests passed.\n`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    try {
      await page.goto("http://localhost:8000/shutdown");
    } catch (err) {
      console.error(err);
    }
    await browser.close();
  }

  process.exit(failed ? 1 : 0);
})();
