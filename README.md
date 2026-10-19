# El Ranxo · Alcalá de Henares

Web adaptable en español para descubrir el negocio y acceder a sus pedidos en Uber Eats, Just Eat y Glovo. HTML estático, TypeScript y Vite; sin backend, formularios, analítica ni cookies propias. Las fuentes y la ilustración se alojan con la web. No requiere claves privadas ni base de datos.

![Vista de escritorio](docs/preview-desktop.png)

[Vista móvil](docs/preview-mobile.png). Las licencias de las fuentes se distribuyen en `public/licenses` y en la compilación.

## Estado de la versión

La versión técnica funciona y tiene pruebas de navegador. **No es una publicación comercial completada ni una reproducción verificada de la identidad oficial.**

Los enlaces y el nombre proceden del propietario. El entorno ha denegado la lectura de Instagram, Google Maps y las plataformas con `403 Domain forbidden`. Por ello:

- La paleta negro, blanco y rojo sigue la indicación del propietario. La identidad tipográfica sigue siendo provisional; no es el logo extraído de Instagram.
- La hamburguesa es una ilustración original, indicada como tal; no es una foto del negocio. El plano es decorativo y no sirve como mapa geográfico.
- No se han inventado productos, precios, ingredientes, alérgenos, dirección, teléfono, horarios ni reseñas.
- La sección de carta enlaza las plataformas. Los pedidos y pagos se tramitan fuera de la web; no hay carrito ni cobro propio.
- No se han comprobado los destinos externos desde este entorno. Las pruebas comprueban que apuntan exactamente a los enlaces proporcionados.
- Quedan por confirmar los recursos oficiales, los datos del local y la identificación legal del titular antes de lanzar la web comercial.

## Desarrollo

Node.js 24 recomendado (mínimo 22.12). Desde la raíz del checkout:

```sh
npm ci
npm run dev
```

En el entorno cloud, utiliza `npm ci --cache /tmp/ranxo-npm-cache` si el directorio predeterminado de caché no es escribible. Usa el checkout existente; las tareas cloud ya están aisladas y no necesitan un worktree adicional.

## Verificación

```sh
npm run build
npm test
```

Las pruebas cubren escritorio y móvil: carga de recursos locales, destinos de pedidos, teclado y foco del modal, menú móvil, FAQ, privacidad, anchura de 320 px, contenido sin JavaScript y análisis automatizado de accesibilidad WCAG AA. El análisis automatizado no sustituye una revisión humana de accesibilidad.

Se usa Chromium del sistema si existe `/usr/bin/chromium`; se puede configurar otro ejecutable con `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. En otros equipos:

```sh
npx playwright install chromium
# En Linux, si faltan librerías del navegador:
npx playwright install --with-deps chromium
```

`npm run preview` sirve la compilación para verificación. No es el servidor de producción.

## Contenido

- `src/business.ts`: enlaces del negocio y campos pendientes de dirección, horario y teléfono. Los campos vacíos se omiten.
- `src/template.ts`: contenido HTML, preparado por Vite al compilar. El contenido principal y los enlaces de pedido funcionan también sin JavaScript.
- `src/main.ts`: navegación y modales; no realiza pedidos ni procesa pagos.
- `src/style.css` y `src/responsive.css`: identidad propuesta y adaptación de pantalla.
- `public/images/burger-illustration.svg`: ilustración original provisional.
- `src/reviews-template.ts`, `src/reviews.ts` y `src/reviews.css`: apartado de Google Maps y carrusel accesible.
- `public/data/google-reviews.json`: datos de reseñas confirmados; actualmente vacío porque la fuente continúa bloqueada.

Para incorporar la carta, usa productos, precios e información de alérgenos confirmados por el negocio, con fecha de actualización. Sustituye la ilustración y la marca tipográfica por los recursos oficiales cuando estén disponibles y autorizados. Añade el aviso legal con la información real del titular y revisa la privacidad según el alojamiento elegido. Los campos `legalName` y `taxId` todavía no generan un aviso legal; hay que redactarlo e incorporarlo cuando el titular lo confirme.

### Reseñas de Google Maps

El carrusel muestra una reseña cada siete segundos mientras está en pantalla. Tiene anterior, siguiente y pausa; se detiene al pasar el puntero, al entrar el foco de teclado, al ocultar la pestaña y al salir de pantalla. Tras usar el teclado o cambiar una reseña manualmente, solo reanuda con el control explícito. Con movimiento reducido empieza pausado. Si hay una sola reseña, se ocultan los controles.

La web lee un archivo JSON local, **no una conexión en directo ni una sincronización automática con Google**. Sin datos, mantiene una invitación y un enlace a la ficha real, sin citas ni valoraciones inventadas. El 19 de octubre de 2026 se volvió a comprobar el acceso a todas las fuentes: el proxy continúa devolviendo `403 Forbidden`. Los dominios figuran en el borrador de configuración, pero no están activos en la política de red de la máquina actual.

Para añadir contenido verificado, actualiza `public/data/google-reviews.json` y vuelve a desplegar:

- Conserva `source: "google_maps"` y la URL real de la ficha en `sourceUrl`.
- `retrievedAt` debe indicar la fecha real de consulta en formato ISO. Es obligatorio para mostrar citas o cifras.
- `rating` y `reviewCount` son la valoración global y el número de valoraciones comprobados en Google; no se calculan a partir de una selección de testimonios. Usa `null` si no están confirmados.
- Cada elemento de `reviews` necesita `id` único, `author`, `text` íntegro, `rating` entero de 1 a 5 y `sourceUrl`. Puede incluir `authorUrl` para atribuir el perfil y `publishedAt` en formato `AAAA-MM-DD` si la fecha es conocida.
- Mantén la atribución y el acceso a la fuente. No añadas una traducción como si fuera el texto original ni inventes fechas, autores o estrellas. El componente no filtra por puntuación.

El texto se inserta con `textContent`; las URLs se validan contra los dominios HTTPS de Google. Si el archivo falta, contiene datos inválidos o tarda demasiado, se conserva el enlace a Google Maps. Los testimonios sintéticos de las pruebas se inyectan por Playwright y no forman parte del archivo publicado.

## Publicación

Se incluyen configuraciones para Vercel y Netlify y un flujo manual para GitHub Pages. El repositorio contiene código; subirlo no publica la web ni conecta un dominio.

### Vercel o Netlify

Importa el repositorio, selecciona `main` y confirma la configuración Vite. Construcción: `npm run build`; salida: `dist`. No hacen falta variables ni secretos de aplicación. Los archivos de configuración aplican cabeceras de seguridad y caché de los recursos versionados. Comprueba HTTPS y completa los datos oficiales antes de conectar el dominio.

### GitHub Pages

En `Settings → Pages`, selecciona `GitHub Actions` como origen. Después ejecuta manualmente `Publish GitHub Pages` desde la pestaña Actions en `main`. El flujo obtiene el prefijo correcto con `configure-pages`, construye y publica `dist`. No se ha ejecutado este despliegue durante el desarrollo. La disponibilidad de Pages depende de la visibilidad del repositorio y del plan de GitHub.

Para verificar localmente la compilación bajo un subdirectorio:

```sh
npm run build -- --base=/elranxo_alcala/
npm run preview -- --base=/elranxo_alcala/
```

Vercel y Netlify aplican las cabeceras indicadas; GitHub Pages no permite configurar esas cabeceras con estos archivos.

### Antes de abrir al público

1. Verificar la identidad, logo, imágenes y carta reales.
2. Confirmar dirección, teléfono, horarios, alérgenos y titular legal.
3. Probar los enlaces en un navegador con acceso a las plataformas y una dirección de reparto válida. No hacer pedidos de prueba con pago sin autorización.
4. Elegir alojamiento, publicar, comprobar HTTPS y los recursos desde el dominio real.

## Versiones

`main` conserva la base estable; `feat/ranxo-website-v1` conserva el desarrollo inicial. La versión validada se conserva también en `release/ranxo-v1` y en la etiqueta `v1.0.0`. No se borran ramas ni se fuerzan subidas.

La paleta negro/blanco/rojo y el carrusel se conservan en `feat/red-brand-google-reviews`, `release/ranxo-v1.1` y `v1.1.0`. Los recursos oficiales y las reseñas reales siguen pendientes de acceso a las fuentes.
