import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

async function createPage(browser, origin, options = {}) {
  const context = await browser.newContext({ baseURL: origin, ...options });
  const page = await context.newPage();
  return { context, page };
}

export async function runWorkRequestScenarios(
  browser,
  origin,
  { capture = false } = {},
) {
  const first = await createPage(browser, origin);
  try {
    await first.page.goto("/");
    await first.page
      .getByRole("heading", { name: "업무요청을 명세에서 증거까지" })
      .waitFor();
    await first.page
      .getByRole("heading", { name: "분기 접근 권한 점검" })
      .waitFor();

    const title = first.page.getByLabel("제목");
    await title.fill("ab");
    await first.page.getByRole("button", { name: "요청 등록" }).click();
    assert.match(
      await first.page.locator("#title-error").innerText(),
      /3자 이상/,
    );
    assert.equal(
      await title.evaluate((element) => element === document.activeElement),
      true,
    );

    await title.fill("배포 전 보안 점검");
    await first.page.getByLabel("분류").selectOption("security");
    await first.page.getByRole("button", { name: "요청 등록" }).click();
    await first.page
      .getByRole("heading", { name: "배포 전 보안 점검" })
      .waitFor();

    if (capture) {
      const assetDirectory = new URL("../docs/assets/", import.meta.url);
      await mkdir(assetDirectory, { recursive: true });
      await first.page.screenshot({
        path: fileURLToPath(
          new URL("week-03-dashboard-desktop.png", assetDirectory),
        ),
        fullPage: true,
      });

      const mobile = await createPage(browser, origin, {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      });
      try {
        await mobile.page.goto("/");
        await mobile.page
          .getByRole("heading", { name: "업무요청을 명세에서 증거까지" })
          .waitFor();
        await mobile.page
          .getByRole("heading", { name: "분기 접근 권한 점검" })
          .waitFor();
        await mobile.page.screenshot({
          path: fileURLToPath(
            new URL("week-03-dashboard-mobile.png", assetDirectory),
          ),
          fullPage: true,
        });
      } finally {
        await mobile.context.close();
      }
    }

    console.log("ok 1 - 짧은 제목을 거부하고 정상 요청을 등록한다");
  } finally {
    await first.context.close();
  }

  const second = await createPage(browser, origin);
  try {
    await second.page.goto("/");
    const payload = "<img src=x onerror=globalThis.pwned=true>";
    await second.page.getByLabel("제목").fill(payload);
    await second.page.getByRole("button", { name: "요청 등록" }).click();
    await second.page.getByRole("heading", { name: payload }).waitFor();
    assert.equal(await second.page.locator('img[src="x"]').count(), 0);
    assert.equal(
      await second.page.evaluate(() => Reflect.get(globalThis, "pwned")),
      undefined,
    );
    console.log("ok 2 - XSS payload를 실행하지 않고 text로 표시한다");
  } finally {
    await second.context.close();
  }
}
