import { business } from "./business.ts";

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const diagonal =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pin =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const instagram =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
const star =
  '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="m16 0 3.3 10.3 9.7-5.6-5.6 9.7L32 16l-10.3 3.3 5.6 9.7-9.7-5.6L16 32l-3.3-10.3-9.7 5.6 5.6-9.7L0 16l10.3-3.3L4.7 3l9.7 5.6Z"/></svg>';
const logo =
  '<span class="brand-word">EL RANXO<span class="brand-dot">✳</span></span><span class="brand-sub">ALCALÁ DE HENARES</span>';
const external = 'target="_blank" rel="noopener noreferrer"';

const platformLinks = business.platforms
  .map(
    (p) => `
  <a class="platform-card ${p.id}" href="${p.url}" ${external}>
    <div class="platform-top"><span class="platform-number">0${business.platforms.indexOf(p) + 1}</span><span class="external-icon">${diagonal}</span></div>
    <span class="platform-logo">${p.id === "uber" ? "Uber <b>Eats</b>" : p.name}</span>
    <span class="platform-description">${p.description}</span>
    <span class="platform-action">Ver carta y pedir ${arrow}</span>
  </a>`,
  )
  .join("");

export function renderSite() {
  return `
  <div class="announcement">ALCALÁ, ESTO VA CONTIGO. <span>ENCUÉNTRANOS EN UBER EATS, JUST EAT Y GLOVO</span> ${star}</div>
  <header class="site-header">
    <div class="header-inner container">
      <a class="brand" href="#inicio" aria-label="El Ranxo, inicio">${logo}</a>
      <nav class="desktop-nav" aria-label="Navegación principal">
        <a href="#carta">La carta</a><a href="#ranxo">El Ranxo</a><a href="#encuentranos">Encuéntranos</a>
      </nav>
      <div class="header-actions">
        <a href="#carta" class="button button-dark header-order" data-order>Haz tu pedido ${diagonal}</a>
        <button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
      </div>
    </div>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Navegación móvil" hidden>
      <a href="#carta">La carta ${arrow}</a><a href="#ranxo">El Ranxo ${arrow}</a><a href="#encuentranos">Encuéntranos ${arrow}</a>
      <a href="#carta" class="button button-yellow" data-order>Haz tu pedido ${diagonal}</a>
    </nav>
  </header>
  <main id="contenido">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow"><span class="tiny-star">✳</span> HAMBURGUESAS EN ALCALÁ</span>
          <h1 id="hero-title">MENOS<br>VUELTAS.<br><span>MÁS BURGER.</span></h1>
          <p>Ese antojo tiene nombre.<br>Bienvenido a <strong>El Ranxo.</strong></p>
          <div class="hero-actions"><a href="#carta" class="button button-yellow" data-order>Pídete un Ranxo ${diagonal}</a><a class="text-link" href="#carta">Explora la carta ${arrow}</a></div>
          <div class="hero-platforms"><span>TU PEDIDO, A UN CLIC</span><div><a href="${business.platforms[0].url}" ${external}>Uber <b>Eats</b></a><a href="${business.platforms[1].url}" ${external}>Just Eat</a><a href="${business.platforms[2].url}" ${external}>Glovo</a></div></div>
        </div>
        <div class="hero-art">
          <span class="art-note">BURGER MOOD: ON.</span>
          <div class="burger-orbit"></div><span class="art-spark spark-one">${star}</span><span class="art-spark spark-two">${star}</span>
          <img class="hero-burger" src="/images/burger-illustration.svg" alt="Ilustración de una hamburguesa con queso" width="720" height="660" fetchpriority="high" />
          <div class="round-sticker"><span>EL RANXO</span><strong>DALE<br>UN MORDISCO.</strong><span>ALCALÁ DE HENARES</span></div>
          <span class="art-caption">UN ANTOJO. UN PLAN. EL RANXO.</span>
        </div>
      </div>
      <a class="hero-scroll" href="#carta" aria-label="Descubrir la carta">↓</a>
    </section>
    <div class="ticker" aria-hidden="true"><div>${Array(4).fill(`<span>EL RANXO</span>${star}<span>ALCALÁ DE HENARES</span>${star}<span>BURGER MOOD</span>${star}`).join("")}</div></div>
    <section id="carta" class="menu-section section-space" aria-labelledby="menu-title">
      <div class="container">
        <div class="section-heading"><div><span class="eyebrow dark-eyebrow">01 / LA CARTA</span><h2 id="menu-title">TU ANTOJO.<br><span class="outline-text">TÚ ELIGES.</span></h2></div><p>La carta, los precios y la disponibilidad,<br class="desktop-break"> siempre actualizados en tu plataforma.<br class="desktop-break"> Elige una y encuentra tu próximo pedido.</p></div>
        <div class="platform-grid">${platformLinks}</div>
        <p class="menu-footnote"><span>↗</span> El pedido y el pago se completan en la plataforma que elijas. Consulta allí los ingredientes, alérgenos, gastos de envío y zona de reparto.</p>
      </div>
    </section>
    <section id="ranxo" class="about-section" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-poster"><div class="poster-top"><span>DE ALCALÁ</span>${star}<span>BURGER CLUB</span></div><div class="poster-title">GOOD<br>MOOD.<br><span>GREAT<br>BURGER.</span></div><div class="poster-bottom">EL RANXO <span>✳</span> SIN DARLE MÁS VUELTAS.</div></div>
        <div class="about-copy"><span class="eyebrow dark-eyebrow">02 / SOMOS EL RANXO</span><h2 id="about-title">EL PLAN<br>ES <span class="underline">RANXO.</span></h2><p class="about-lead">Hay días de cocinar.<br>Y días de pedirte una burger.</p><p>Para una cena con amigos, una noche de sofá o ese antojo que no se va: aquí empieza tu próximo plan en Alcalá de Henares.</p><p>Elige tu plataforma, descubre la carta y deja que el pedido haga el resto.</p><a class="button button-dark" href="${business.instagram}" ${external}>Conócenos en Instagram ${instagram}</a></div>
      </div>
    </section>
    <section class="how-section section-space" aria-labelledby="how-title"><div class="container"><div class="section-heading compact"><div><span class="eyebrow dark-eyebrow">SIN COMPLICACIONES</span><h2 id="how-title">DEL ANTOJO AL PEDIDO.</h2></div><a href="#carta" class="text-link dark-link" data-order>Vamos a ello ${diagonal}</a></div><div class="steps"><article><span class="step-number">01</span><div><h3>Elige tu plataforma.</h3><p>Uber Eats, Just Eat o Glovo.<br>La que mejor te venga.</p></div></article><article><span class="step-number">02</span><div><h3>Encuentra tu burger.</h3><p>Consulta la carta, los extras y<br>la disponibilidad en ese momento.</p></div></article><article><span class="step-number">03</span><div><h3>Confirma y disfruta.</h3><p>Revisa la entrega y paga de forma<br>segura dentro de la plataforma.</p></div></article></div></div></section>
    <section class="location-section" id="encuentranos" aria-labelledby="location-title"><div class="container location-grid"><div class="location-copy"><span class="eyebrow">03 / DE AQUÍ, DE ALCALÁ</span><h2 id="location-title">NOS VEMOS<br>EN <span>EL RANXO.</span></h2><p>Encuentra el local, consulta los horarios publicados y prepara tu ruta en Google Maps.</p><div class="location-details"><span>${pin} ${business.city}</span>${business.address ? `<span>${business.address}</span>` : ""}${business.hours ? `<span>${business.hours}</span>` : ""}${business.phone ? `<a href="tel:${business.phone.replace(/\s/g, "")}">${business.phone}</a>` : ""}</div><a class="button button-yellow" href="${business.maps}" ${external}>Cómo llegar ${diagonal}</a></div><a class="map-card" href="${business.maps}" ${external} aria-label="Abrir ubicación de El Ranxo en Google Maps"><div class="map-art" aria-hidden="true"><div class="map-road road-one"></div><div class="map-road road-two"></div><div class="map-road road-three"></div><div class="map-road road-four"></div><span class="map-block block-one"></span><span class="map-block block-two"></span><span class="map-block block-three"></span><span class="map-park"></span><div class="map-marker">${star}<span>EL RANXO</span></div><span class="map-city">ALCALÁ<br>DE HENARES</span></div><span class="map-card-bottom"><span>Tu próximo destino.</span><span>Google Maps ${diagonal}</span></span></a></div></section>
    <section class="faq-section section-space" aria-labelledby="faq-title"><div class="container faq-grid"><div><span class="eyebrow dark-eyebrow">POR SI TE LO PREGUNTABAS</span><h2 id="faq-title">TODO<br>CLARO.</h2></div><div class="faq-list"><details><summary>¿Cómo hago un pedido?<span>+</span></summary><p>Elige Uber Eats, Just Eat o Glovo desde esta web. En la plataforma podrás consultar la carta, introducir tu dirección y completar el pedido y el pago.</p></details><details><summary>¿Dónde veo la carta y los precios?<span>+</span></summary><p>En los enlaces de las plataformas de reparto. Cada plataforma muestra sus productos, precios y disponibilidad actuales. Los precios y promociones pueden variar entre plataformas.</p></details><details><summary>¿Repartís hasta mi dirección?<span>+</span></summary><p>Introduce tu dirección en la plataforma elegida antes de confirmar el pedido. Allí se mostrará si el local está disponible, los gastos y el tiempo estimado de entrega.</p></details><details><summary>¿Dónde consulto los alérgenos?<span>+</span></summary><p>Consulta la información de cada producto en la plataforma y contacta directamente con el establecimiento si necesitas aclarar ingredientes o contaminación cruzada. Si esa información no está disponible, confírmala antes de pedir.</p></details><details><summary>¿Cuál es el horario del local?<span>+</span></summary><p>Consulta la ficha del negocio en <a href="${business.maps}" ${external}>Google Maps</a>. Para pedidos a domicilio, comprueba la disponibilidad actual dentro de tu plataforma.</p></details><details><summary>¿Quién gestiona mi pedido?<span>+</span></summary><p>Los pedidos se realizan en la plataforma que elijas. Para conocer su estado, cambiarlo o resolver una incidencia, utiliza el soporte del pedido dentro de esa plataforma.</p></details></div></div></section>
    <section class="social-section"><div class="container social-inner"><div><span class="eyebrow dark-eyebrow">NOS VEMOS EN TU FEED</span><h2>@ELRANXO_ALCALA</h2><p>Un poco de Ranxo entre scroll y scroll.</p></div><a href="${business.instagram}" ${external} class="social-circle" aria-label="Visitar el Instagram de El Ranxo">${instagram}${diagonal}</a></div></section>
    <section class="final-cta"><div class="container"><span class="eyebrow">YA SABES QUÉ TOCA.</span><h2>¿NOS DAMOS<br><span>UN MORDISCO?</span></h2><a href="#carta" class="button button-yellow" data-order>Haz tu pedido ${diagonal}</a><span class="cta-star">${star}</span></div></section>
  </main>
  <footer class="site-footer"><div class="container"><div class="footer-top"><a class="brand" href="#inicio" aria-label="El Ranxo, volver al inicio">${logo}</a><p>Tu próximo antojo empieza aquí.<br>Alcalá de Henares.</p><div class="footer-links"><a href="${business.instagram}" ${external}>Instagram ${diagonal}</a><a href="${business.maps}" ${external}>Google Maps ${diagonal}</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} El Ranxo.</span><button class="legal-button" data-privacy>Privacidad y enlaces externos</button><span class="illustration-note">Ilustración artística; no representa un producto de la carta.</span></div></div></footer>
  <div class="mobile-order"><a href="#carta" class="button button-yellow" data-order>¿Te apetece un Ranxo? <span>Pedir ${diagonal}</span></a></div>
  <dialog class="order-dialog" aria-labelledby="order-title"><div class="dialog-inner"><button class="close-dialog" data-close aria-label="Cerrar selector de plataformas">×</button><span class="eyebrow dark-eyebrow">EL ANTOJO EMPIEZA AQUÍ</span><h2 id="order-title">¿DÓNDE<br>PEDIMOS?</h2><p>Elige tu plataforma para ver la carta y completar tu pedido.</p><div class="dialog-platforms">${business.platforms.map((p) => `<a class="dialog-platform ${p.id}" href="${p.url}" ${external}><span>${p.name}</span>${diagonal}</a>`).join("")}</div><p class="dialog-note">Abriremos la plataforma en una nueva pestaña. Precios, entrega y disponibilidad se confirman allí.</p></div></dialog>
  <dialog class="privacy-dialog" aria-labelledby="privacy-title"><div class="dialog-inner"><button class="close-dialog" data-close aria-label="Cerrar información de privacidad">×</button><span class="eyebrow dark-eyebrow">TU PRIVACIDAD</span><h2 id="privacy-title">SIN COMPLICACIONES.</h2><div class="privacy-copy"><p>Esta web no utiliza cookies, analítica, formularios ni tecnologías publicitarias propias, y no recoge pedidos ni pagos.</p><p>Los enlaces a Uber Eats, Just Eat, Glovo, Instagram y Google Maps te llevan a servicios externos que aplican sus propias políticas de privacidad y condiciones.</p><p>El proveedor de alojamiento puede procesar datos técnicos de conexión para servir la web. Para consultas relativas a un pedido, utiliza el servicio de atención de la plataforma en la que lo realizaste.</p></div></div></dialog>
`;
}
