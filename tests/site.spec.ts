import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage loads local assets without errors or third-party requests", async ({
  page,
}) => {
  const errors: string[] = [];
  const thirdParty: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4173"))
      thirdParty.push(request.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "MÁS BURGER.",
  );
  await expect(page.locator(".hero-burger")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".hero-burger")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(errors).toEqual([]);
  expect(thirdParty).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("order dialog contains the three exact supplied stores and closes with Escape", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.locator(".header-order");
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "¿DÓNDE PEDIMOS?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveCount(3);
  await expect(dialog.getByRole("link", { name: "Uber Eats" })).toHaveAttribute(
    "href",
    "https://www.ubereats.com/es/store/el-ranxo-alcala-de-henares/mJNAHg0nURutJxW-drpqnw",
  );
  await expect(dialog.getByRole("link", { name: "Just Eat" })).toHaveAttribute(
    "href",
    "https://www.just-eat.es/restaurants-elrancho-smashburger-alcaladehenares/menu",
  );
  await expect(dialog.getByRole("link", { name: "Glovo" })).toHaveAttribute(
    "href",
    /glovoapp.com/,
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("dialog traps keyboard focus and can be closed with its button", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".header-order").click();
  const dialog = page.locator(".order-dialog");
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await dialog
    .getByRole("button", { name: "Cerrar selector de plataformas" })
    .click();
  await expect(dialog).not.toBeVisible();
});

test("menu cards, location and Instagram use the supplied external destinations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".platform-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/di6EgPZXdHFrGjwb9",
  );
  await expect(
    page.getByRole("link", { name: "Conócenos en Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/elranxo_alcala/");
  const destinations = await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) =>
      links.map((link) => ({
        href: link.getAttribute("href"),
        rel: link.getAttribute("rel"),
      })),
    );
  expect(destinations.length).toBeGreaterThan(8);
  destinations.forEach((link) => {
    expect(link.href).toMatch(/^https:\/\//);
    expect(link.rel).toContain("noopener");
    expect(link.rel).toContain("noreferrer");
  });
});

test("questions reveal answers and privacy information opens", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("¿Cómo hago un pedido?", { exact: false }).click();
  await expect(page.locator(".faq-list details").first()).toHaveAttribute(
    "open",
    "",
  );
  await expect(
    page.locator(".faq-list details").first().locator("p"),
  ).toBeVisible();
  await page
    .getByText("¿Dónde veo la carta y los precios?", { exact: false })
    .click();
  await expect(page.locator(".faq-list details").first()).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .getByRole("button", { name: "Privacidad y enlaces externos" })
    .click();
  await expect(page.locator(".privacy-dialog")).toBeVisible();
  await expect(page.locator(".privacy-dialog")).toContainText(
    "no utiliza cookies",
  );
});

test("mobile navigation reaches a section and collapses", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Only the mobile layout has a collapsed menu.",
  );
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Encuéntranos" })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#encuentranos$/);
  await expect(page.locator("#mobile-nav")).not.toBeVisible();
  await page.locator(".mobile-order [data-order]").click();
  await expect(page.locator(".order-dialog")).toBeVisible();
});

test("narrow screens do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.locator(".header-order").click();
  const box = await page.locator(".order-dialog").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
});

test("core content and delivery links remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".platform-card")).toHaveCount(3);
  await page.locator(".header-order").click();
  await expect(page).toHaveURL(/#carta$/);
  await expect(page.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/di6EgPZXdHFrGjwb9",
  );
  await context.close();
});

test("page and ordering modal pass automated WCAG AA checks", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const pageAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(pageAudit.violations).toEqual([]);
  await page.locator(".header-order").click();
  const modalAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(modalAudit.violations).toEqual([]);
});
