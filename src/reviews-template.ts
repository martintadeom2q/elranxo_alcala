import { business } from "./business.ts";

const externalIcon =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrowIcon =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const starIcon =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.2-6 3.2 1.2-6.7-4.9-4.7 6.7-1Z"/></svg>';

/** No fabricated quotes or aggregate rating: the empty state links to the actual listing. */
export function renderReviews() {
  return `
    <section class="reviews-section section-space" id="resenas" aria-labelledby="reviews-title">
      <div class="container reviews-grid">
        <div class="reviews-heading">
          <span class="eyebrow dark-eyebrow">LO CUENTAN EN GOOGLE MAPS</span>
          <h2 id="reviews-title">EL RANXO,<br><span>EN SUS<br>PALABRAS.</span></h2>
          <p>Los mejores planes también se comparten.</p>
          <div class="reviews-summary" data-reviews-summary role="group" hidden>
            <strong data-reviews-rating></strong>
            <span><span class="review-stars" aria-hidden="true">${starIcon.repeat(5)}</span><span data-reviews-count></span></span>
          </div>
          <a class="text-link dark-link" href="${business.maps}" target="_blank" rel="noopener noreferrer">Ver reseñas en Google Maps ${externalIcon}</a>
        </div>
        <div class="reviews-panel">
          <div class="reviews-fallback" data-reviews-fallback>
            <span class="reviews-quote-mark" aria-hidden="true">“</span>
            <h3>CADA MORDISCO<br>TIENE SU HISTORIA.</h3>
            <p>¿Ya has probado El Ranxo? Descubre lo que cuentan nuestros clientes en Google Maps y comparte tu experiencia.</p>
            <a class="button button-red" href="${business.maps}" target="_blank" rel="noopener noreferrer">Leer las reseñas ${externalIcon}</a>
          </div>
          <div class="reviews-carousel" data-reviews-carousel role="region" aria-roledescription="carrusel" aria-label="Reseñas de Google Maps" hidden>
            <div class="review-slide" data-review-slide role="group" aria-roledescription="diapositiva" aria-live="off" aria-atomic="true">
              <span class="reviews-quote-mark" aria-hidden="true">“</span>
              <p class="review-stars" data-review-stars role="img"></p>
              <blockquote data-review-text></blockquote>
              <div class="review-author-row"><span class="review-avatar" data-review-avatar aria-hidden="true"></span><div><a data-review-author></a><time data-review-date></time></div><span class="review-source">Google Maps</span></div>
              <a class="review-original" data-review-original>Ver reseña en Google Maps ${externalIcon}</a>
            </div>
            <div class="review-controls" data-review-controls hidden>
              <div><button class="review-control" type="button" data-review-previous aria-label="Reseña anterior">${arrowIcon}</button><button class="review-control" type="button" data-review-next aria-label="Siguiente reseña">${arrowIcon}</button></div>
              <span class="review-position" data-review-position></span>
              <button class="review-pause" type="button" data-review-pause aria-label="Pausar reseñas">Pausar</button>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}
