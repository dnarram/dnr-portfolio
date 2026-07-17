/**
 * Configuración central del sitio.
 * TODO(David): completar email, LinkedIn y NEXT_PUBLIC_SITE_URL antes de publicar.
 */
export const SITE = {
  name: "David Naranjo Ramírez",
  shortName: "DNR",
  role: "Data Science · Desarrollo Full-Stack",
  description:
    "Portfolio adaptativo de David Naranjo Ramírez: data engineering, análisis de datos y desarrollo web full-stack. El contenido se adapta a quien lo visita.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dnr-portfolio.vercel.app",
  email: "naranjoramirez.d@gmail.com", 
  github: "https://github.com/dnarram",
  linkedin: "https://www.linkedin.com/in/davidnaranjoramirez", 
  location: "Málaga/Madrid · España",
  availability: "Disponible · Málaga / remoto",
} as const;

/**
 * Perfil compacto que el endpoint /api/chat inyecta como contexto del sistema.
 * Regla: solo hechos verificables. El asistente tiene prohibido inventar.
 */
export const AI_PROFILE = `
Perfil de David Naranjo Ramírez:
- Ubicación: Málaga/Madrid, España. Disponible en Málaga, Madrid y en remoto.
- Formación (simultánea, en curso): Máster en Data Science (Evolve Academy) y ciclo superior DAW - Desarrollo de Aplicaciones Web (Ilerna).
- Enfoque: data engineering / data analysis + desarrollo web full-stack. Sello personal: toda cifra publicada se verifica contra los datos crudos.

Proyectos:
1) Data Warehouse Olist — PostgreSQL. Esquema en estrella (5 dimensiones + tabla de hechos), índices, vistas y función de utilidad sobre el dataset público de e-commerce de Olist. ETL auditado en dos pasadas (réplica del pipeline en pandas y verificación contra los CSVs reales), KPIs verificados cifra a cifra. Bug resuelto en directo: INSERT de la tabla de hechos colgado por estadísticas obsoletas del query planner; fix con ANALYZE sobre las 5 dimensiones a mitad de transacción. También detectó y resolvió un typo histórico en nombres de columna del propio dataset Olist. Repositorio: https://github.com/dnarram/olist-ecommerce-datawarehouse
2) EDAFatalForce — EDA avanzado en Python/pandas sobre la base Fatal Force del Washington Post (2015-2024), enriquecida con el censo ACS 2020 y legislación de bodycams (NCSL). Limpieza compleja: imputación de condados y corrección de miscodificaciones en flee_status y armed_with que afectaban a miles de filas, verificadas contra el CSV crudo. Entregables: notebook, README, análisis narrativo y artículos de divulgación.
3) RondaGuide — app web turística de Ronda (proyecto final DAW, defendido ante tribunal). Arquitectura dual Node.js/Express + Java HttpServer tras NGINX como reverse proxy, MySQL, mapas Leaflet, frontend HTML/CSS/JS. Auditoría técnica completa: esquema desincronizado, FK con tipos incompatibles, seeds ausentes y credenciales expuestas, hasta un despliegue full-stack limpio.

Stack: Python, pandas, SQL (PostgreSQL, MySQL), ETL, EDA, JavaScript/TypeScript, Node.js/Express, Java, NGINX, Leaflet, Git/GitHub, DBeaver, documentación técnica.
Idiomas: español nativo.
Contacto: "naranjoramirez.d@gmail.com" · GitHub: https://github.com/dnarram
`;
