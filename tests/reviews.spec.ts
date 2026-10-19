import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Synthetic data is injected only by the browser tests. It is never shipped in public/data.
const sourceUrl = "https://maps.app.goo.gl/di6EgPZXdHFrGjwb9";
const fixture = {
  source: "google_maps",
  sourceUrl,
  retrievedAt: "2026-10-19T12:00:00Z",
  rating: 4.2,
  reviewCount: 12,
  reviews: [
    {
      id: "test-a",
      author: "Autor de prueba A",
      text: "Texto sintético A para verificar el carrusel.",
      rating: 5,
      sourceUrl,
      publishedAt: "2026-10-01",
    },
    {
      id: "test-b",
      author: "Autor de prueba B",
      text: "Texto sintético B para verificar la navegación.",
      rating: 3,
      sourceUrl,
    },
    {
      id: "test-c",
      author: "Autor de prueba C",
      text: 'Texto de prueba C: <img src=x onerror="alert(1)">',
      rating: 4,
      sourceUrl,
    },
  ],
};

async function loadFixture(page: Page, value: unknown = fixture) {
  await page.route("**/data/google-reviews.json", (route) =>
    route.fulfill({ json: value }),
  );
  await page.goto("/");
  await expect(page.locator("#resenas")).toHaveAttribute(
    "data-reviews-state",
    "loaded",
  );
}

test("empty published data shows a Maps link without invented ratings or quotes", async ({
  page,
}) => {
  await page.goto("/");
  const response = await page.request.get("/data/google-reviews.json");
  const data = await response.json();
  expect(data.reviews).toEqual([]);
  expect(data.rating).toBeNull();
  expect(data.reviewCount).toBeNull();
  await expect(page.locator("[data-reviews-fallback]")).toBeVisible();
  await expect(page.locator("[data-reviews-carousel]")).not.toBeVisible();
  await expect(page.locator("[data-reviews-summary]")).not.toBeVisible();
  await expect(
    page.getByRole("link", { name: "Leer las reseñas" }),
  ).toHaveAttribute("href", sourceUrl);
});

test("real-data renderer supports navigation, attribution, ratings and safe text", async ({
  page,
}) => {
  await loadFixture(page);
  const carousel = page.locator("[data-reviews-carousel]");
  await expect(carousel).toBeVisible();
  await expect(page.locator("[data-reviews-rating]")).toHaveText("4,2");
  await expect(page.locator("[data-review-text]")).toHaveText(
    fixture.reviews[0].text,
  );
  await expect(page.locator("[data-review-date]")).toHaveAttribute(
    "datetime",
    "2026-10-01",
  );
  await page.getByRole("button", { name: "Siguiente reseña" }).click();
  await expect(page.locator("[data-review-text]")).toHaveText(
    fixture.reviews[1].text,
  );
  await expect(page.locator("[data-review-stars]")).toHaveAttribute(
    "aria-label",
    "3 de 5 estrellas",
  );
  await expect(page.locator("[data-review-date]")).not.toBeVisible();
  await expect(page.locator("[data-review-original]")).toHaveAttribute(
    "href",
    sourceUrl,
  );
  await page.getByRole("button", { name: "Siguiente reseña" }).click();
  await expect(page.locator("[data-review-text]")).toHaveText(
    fixture.reviews[2].text,
  );
  await expect(carousel.locator("img")).toHaveCount(0);
  await page.getByRole("button", { name: "Siguiente reseña" }).click();
  await expect(page.locator("[data-review-position]")).toHaveText("1 / 3");
  await page.getByRole("button", { name: "Reseña anterior" }).click();
  await expect(page.locator("[data-review-position]")).toHaveText("3 / 3");
});

test("reviews rotate only in view and a pointer pause remains paused", async ({
  page,
}) => {
  await page.clock.install();
  await loadFixture(page);
  await expect(page.locator("[data-reviews-carousel]")).toBeVisible();
  await page.clock.runFor(7500);
  await expect(page.locator("[data-review-position]")).toHaveText("1 / 3");
  await page.locator("[data-reviews-carousel]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-review-slide]")).toHaveAttribute(
    "aria-live",
    "off",
  );
  await page.clock.runFor(7100);
  await expect(page.locator("[data-review-position]")).toHaveText("2 / 3");
  await page.getByRole("button", { name: "Pausar reseñas" }).click();
  await expect(
    page.getByRole("button", { name: "Reanudar reseñas" }),
  ).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(page.locator("[data-review-position]")).toHaveText("2 / 3");
  await page.getByRole("button", { name: "Reanudar reseñas" }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(7100);
  await expect(page.locator("[data-review-position]")).toHaveText("3 / 3");
});

test("keyboard focus pauses rotation until the visitor explicitly resumes it", async ({
  page,
}) => {
  await page.clock.install();
  await loadFixture(page);
  await page.locator("[data-review-author]").focus();
  await expect(
    page.getByRole("button", { name: "Reanudar reseñas" }),
  ).toBeVisible();
  await expect(page.locator("[data-review-slide]")).toHaveAttribute(
    "aria-live",
    "polite",
  );
  await page.locator(".header-order").focus();
  await page.locator("[data-reviews-carousel]").scrollIntoViewIfNeeded();
  await page.clock.runFor(15000);
  await expect(page.locator("[data-review-position]")).toHaveText("1 / 3");
});

test("reduced motion disables automatic rotation and a single review hides controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await loadFixture(page);
  await page.locator("[data-reviews-carousel]").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Reanudar reseñas" }),
  ).toBeVisible();
  await page.clock.runFor(15000);
  await expect(page.locator("[data-review-position]")).toHaveText("1 / 3");
  await loadFixture(page, { ...fixture, reviews: [fixture.reviews[0]] });
  await expect(page.locator("[data-reviews-carousel]")).toBeVisible();
  await expect(page.locator("[data-review-controls]")).not.toBeVisible();
});

test("missing, undated or unsafe review data keeps the usable fallback", async ({
  page,
}) => {
  await loadFixture(page, { ...fixture, retrievedAt: null });
  await expect(page.locator("[data-reviews-carousel]")).not.toBeVisible();
  await loadFixture(page, {
    ...fixture,
    reviews: [{ ...fixture.reviews[0], sourceUrl: "javascript:alert(1)" }],
  });
  await expect(page.locator("[data-reviews-carousel]")).not.toBeVisible();
  await page.route("**/data/google-reviews.json", (route) =>
    route.fulfill({ status: 503 }),
  );
  await page.goto("/");
  await expect(page.locator("#resenas")).toHaveAttribute(
    "data-reviews-state",
    "loaded",
  );
  await expect(page.locator("[data-reviews-fallback]")).toBeVisible();
});

test("populated carousel passes automated accessibility checks", async ({
  page,
}) => {
  await loadFixture(page);
  await page.locator("[data-reviews-carousel]").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Pausar reseñas" }).click();
  const audit = await new AxeBuilder({ page })
    .include("#resenas")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});
