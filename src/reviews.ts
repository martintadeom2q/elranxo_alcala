type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  sourceUrl: string;
  authorUrl?: string;
  publishedAt?: string;
};

type Reviews = {
  source: "google_maps";
  sourceUrl: string;
  retrievedAt: string | null;
  rating: number | null;
  reviewCount: number | null;
  reviews: Review[];
};

const googleHosts = new Set([
  "www.google.com",
  "maps.google.com",
  "maps.app.goo.gl",
]);

function googleUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      googleHosts.has(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validData(value: unknown): value is Reviews {
  if (
    !isRecord(value) ||
    value.source !== "google_maps" ||
    !googleUrl(value.sourceUrl) ||
    !Array.isArray(value.reviews)
  )
    return false;
  const validRating =
    value.rating === null ||
    (typeof value.rating === "number" &&
      Number.isFinite(value.rating) &&
      value.rating >= 1 &&
      value.rating <= 5);
  const validCount =
    value.reviewCount === null ||
    (Number.isInteger(value.reviewCount) && Number(value.reviewCount) >= 0);
  if (
    !validRating ||
    !validCount ||
    !(
      value.retrievedAt === null ||
      (typeof value.retrievedAt === "string" &&
        Number.isFinite(Date.parse(value.retrievedAt)))
    )
  )
    return false;
  // A dated source is mandatory whenever there are actual quotes or aggregate figures.
  if (
    (value.reviews.length > 0 ||
      value.rating !== null ||
      value.reviewCount !== null) &&
    value.retrievedAt === null
  )
    return false;
  const ids = new Set<string>();
  return value.reviews.every((review: unknown) => {
    if (
      !isRecord(review) ||
      typeof review.id !== "string" ||
      !review.id.trim() ||
      ids.has(review.id)
    )
      return false;
    ids.add(review.id);
    return (
      typeof review.author === "string" &&
      !!review.author.trim() &&
      typeof review.text === "string" &&
      !!review.text.trim() &&
      Number.isInteger(review.rating) &&
      Number(review.rating) >= 1 &&
      Number(review.rating) <= 5 &&
      googleUrl(review.sourceUrl) &&
      (review.authorUrl === undefined || googleUrl(review.authorUrl)) &&
      (review.publishedAt === undefined ||
        (typeof review.publishedAt === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(review.publishedAt) &&
          Number.isFinite(Date.parse(review.publishedAt))))
    );
  });
}

export async function initReviews() {
  const section = document.querySelector<HTMLElement>("#resenas");
  if (!section) return;
  const select = <T extends HTMLElement = HTMLElement>(selector: string) =>
    section.querySelector<T>(selector)!;
  section.dataset.reviewsState = "loading";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  let data: Reviews;
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}data/google-reviews.json`,
      { signal: controller.signal },
    );
    if (!response.ok) return;
    const payload: unknown = await response.json();
    if (!validData(payload)) return;
    data = payload;
  } catch {
    // Keep the static Maps link usable if the local data file cannot be read.
    return;
  } finally {
    window.clearTimeout(timeout);
    section.dataset.reviewsState = "loaded";
  }

  if (
    data.rating !== null &&
    data.reviewCount !== null &&
    data.reviewCount > 0
  ) {
    const summary = select("[data-reviews-summary]");
    select("[data-reviews-rating]").textContent = data.rating.toLocaleString(
      "es-ES",
      { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    );
    select("[data-reviews-count]").textContent =
      `${data.reviewCount.toLocaleString("es-ES")} valoraciones en Google`;
    summary.setAttribute(
      "aria-label",
      `${data.rating.toLocaleString("es-ES")} de 5, ${data.reviewCount} valoraciones en Google Maps`,
    );
    summary.hidden = false;
  }
  if (data.reviews.length === 0) return;

  const carousel = select("[data-reviews-carousel]");
  const slide = select("[data-review-slide]");
  const pauseButton = select<HTMLButtonElement>("[data-review-pause]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let userPaused = reducedMotion.matches;
  let focusPaused = false;
  let pauseIntent: boolean | undefined;
  let hovering = false;
  let visible = false;
  let timer: number | undefined;

  function render() {
    const review = data.reviews[index];
    select("[data-review-text]").textContent = review.text;
    select("[data-review-avatar]").textContent = review.author
      .trim()
      .charAt(0)
      .toLocaleUpperCase("es-ES");
    const author = select<HTMLAnchorElement>("[data-review-author]");
    author.textContent = review.author;
    author.href = review.authorUrl ?? review.sourceUrl;
    author.target = "_blank";
    author.rel = "noopener noreferrer";
    const date = select<HTMLTimeElement>("[data-review-date]");
    date.hidden = !review.publishedAt;
    if (review.publishedAt) {
      date.dateTime = review.publishedAt;
      date.textContent = new Date(
        `${review.publishedAt}T12:00:00Z`,
      ).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    const stars = select("[data-review-stars]");
    stars.replaceChildren();
    for (let index = 0; index < 5; index++) {
      const icon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("aria-hidden", "true");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute(
        "d",
        "m12 2 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1Z",
      );
      path.setAttribute(
        "fill",
        index < review.rating ? "currentColor" : "none",
      );
      path.setAttribute("stroke", "currentColor");
      icon.append(path);
      stars.append(icon);
    }
    stars.setAttribute("aria-label", `${review.rating} de 5 estrellas`);
    const original = select<HTMLAnchorElement>("[data-review-original]");
    original.href = review.sourceUrl;
    original.target = "_blank";
    original.rel = "noopener noreferrer";
    select("[data-review-position]").textContent =
      `${index + 1} / ${data.reviews.length}`;
    slide.setAttribute(
      "aria-label",
      `Reseña ${index + 1} de ${data.reviews.length}`,
    );
    if (!reducedMotion.matches)
      slide.animate([{ opacity: 0.35 }, { opacity: 1 }], {
        duration: 280,
        easing: "ease-out",
      });
  }

  function syncRotation() {
    window.clearInterval(timer);
    const paused = userPaused || focusPaused;
    const playing =
      !paused &&
      !hovering &&
      !document.hidden &&
      visible &&
      data.reviews.length > 1;
    slide.setAttribute("aria-live", playing ? "off" : "polite");
    const label = paused ? "Reanudar reseñas" : "Pausar reseñas";
    pauseButton.setAttribute("aria-label", label);
    pauseButton.textContent = paused ? "Reanudar" : "Pausar";
    if (playing)
      timer = window.setInterval(() => {
        index = (index + 1) % data.reviews.length;
        render();
      }, 7000);
  }

  function move(direction: number) {
    userPaused = true;
    syncRotation();
    index = (index + direction + data.reviews.length) % data.reviews.length;
    render();
  }

  select("[data-review-previous]").addEventListener("click", () => move(-1));
  select("[data-review-next]").addEventListener("click", () => move(1));
  // Remember pointer intent before focus pauses rotation, so clicking "Pausar" really pauses.
  pauseButton.addEventListener("pointerdown", () => {
    pauseIntent = !(userPaused || focusPaused);
  });
  pauseButton.addEventListener("pointercancel", () => {
    pauseIntent = undefined;
  });
  pauseButton.addEventListener("click", () => {
    userPaused = pauseIntent ?? !(userPaused || focusPaused);
    focusPaused = false;
    pauseIntent = undefined;
    syncRotation();
  });
  carousel.addEventListener("mouseenter", () => {
    hovering = true;
    syncRotation();
  });
  carousel.addEventListener("mouseleave", () => {
    hovering = false;
    syncRotation();
  });
  carousel.addEventListener("focusin", () => {
    focusPaused = true;
    syncRotation();
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) userPaused = true;
    syncRotation();
  });
  document.addEventListener("visibilitychange", syncRotation);
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    syncRotation();
  });
  observer.observe(carousel);
  select("[data-reviews-fallback]").hidden = true;
  carousel.hidden = false;
  select("[data-review-controls]").hidden = data.reviews.length < 2;
  render();
  syncRotation();
}
