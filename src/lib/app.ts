// La app Sara AI para iPhone y iPad (App Store, sep 2026). Fuente única del ID y
// del link: la usan la página /app, el badge del footer, el Smart App Banner de
// Safari (Layout) y el JSON-LD. Solo iOS por ahora.
//
// El link va sin storefront (/app/id…): Apple manda a cada visitante a la tienda
// de su país. `ct` es el campaign token de App Analytics para atribuir la descarga
// al sitio; `mt=8` = App Store (requisito del formato de campaña).

export const APP_STORE_ID = '6804769628';

export const APP_BUNDLE_ID = 'ai.rayapp.sara';

export const appStoreUrl = (campaign = 'website') =>
  `https://apps.apple.com/app/id${APP_STORE_ID}?ct=${campaign}&mt=8`;
