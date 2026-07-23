import type { PersonaId } from "./personas";

/* ============================================================
   CV MAESTRO — fuente única de verdad del contenido del CV.
   ------------------------------------------------------------
   PEGA tu CV_MAESTRO_DNR.md completo entre los backticks de
   CV_MARKDOWN. El parser:
   - ignora las líneas de comentario que empiezan por ">"
   - omite líneas con el marcador ⟨privado⟩ y campos sensibles
     (teléfono, motivo de salida, expectativa salarial)
   - limpia los marcadores ⟨por confirmar⟩ del texto
   - descarta campos vacíos ("- Campo:" sin valor)
   La IA SOLO selecciona bloques por id; el texto que se muestra
   es SIEMPRE el literal de este archivo. La IA elige, no redacta.
   ============================================================ */

export const CV_MARKDOWN = `
# CV MAESTRO — David Naranjo Ramírez
> Fuente única de verdad. Rellena cada bloque con datos EXACTOS y verificables.
> Cada bloque tiene un ID entre [corchetes]: es lo que la IA seleccionará para
> armar el CV adaptado. NUNCA borres los IDs. Escribe en primera o tercera
> persona de forma consistente (recomendado: tercera para el CV, "David…").
>
> Regla de oro: si un dato no es cierto o no lo puedes demostrar en una
> entrevista, NO lo pongas. Este documento es la red de seguridad contra
> invenciones.
>
> ETIQUETAS DE LÍNEA (para el CV descargable):
>   {p1} siempre · {p2} importante · {p3} relleno si cabe
>   afinidad: {data} {web} {dev} {tech} {hr} {clinical}
>   Ej.:  - Redujo el backlog un 30% {p1 data}
>   La afinidad ORDENA qué se incluye primero según la vista/rol del
>   visitante; {p1} aparece siempre. Sin etiqueta, se aplica la heurística.
>
> [Fuente canónica de experiencia y formación: LinkedIn (jul 2026).]

---

## 0. IDENTIDAD Y CONTACTO  [id: meta_identidad]
- Nombre completo: David Naranjo Ramírez
- Titular profesional: Data Scientist | Desarrollador Web Full-Stack
- Tagline de aptitudes: Python · Java · Machine Learning · Web Apps
- Ubicación (ciudad, país): Málaga, España / Madrid, España
- Disponibilidad geográfica (remoto / híbrido / presencial / relocalización): remoto / híbrido / presencial / relocalización
- Email de contacto: naranjoramirez.d@gmail.com
- Teléfono: +34 744 732 639
- LinkedIn: https://www.linkedin.com/in/davidnaranjoramirez/
- GitHub: https://github.com/dnarram
- Portfolio web: https://dnr-portfolio-omega.vercel.app
- Idiomas del CV que quieres poder generar (ej. ES, EN): ES, EN, FR, PT

---

## 1. RESUMEN PROFESIONAL  [id: resumen_general]
> 3-4 frases. Quién eres, qué haces, qué valor aportas. Sin adjetivos vacíos.
> Este es el bloque "por defecto"; abajo puedes escribir variantes por perfil.

Texto: David Naranjo Ramírez tiende puentes entre el desarrollo web full-stack y la ciencia de datos / IA. Aporta 5 años de experiencia en entornos tecnológicos internacionales (proyectos de Medidata, Pfizer y Novo Nordisk en C3i Solutions/HCLTech, Sofía), donde progresó de agente de soporte técnico a supervisor y project manager. Actualmente finaliza el CFGS en Desarrollo de Aplicaciones Web (DAW) y cursa el Máster en Data Science e IA en Evolve Academy, aplicando esa madurez a proyectos técnicos llevados de principio a fin: desde un data warehouse en PostgreSQL hasta aplicaciones web desplegadas. Su sello es el rigor verificable: audita sus datos contra las fuentes crudas y resuelve los problemas de raíz.

### Variante para perfil TÉCNICO  [id: resumen_tech]
> Mismo contenido, tono técnico: stack, rigor, métricas.
Texto: Perfil técnico que combina desarrollo full-stack y datos/IA, con base profesional en entornos corporativos IT de ensayos clínicos. Diseña modelos dimensionales (esquema en estrella) en PostgreSQL, construye pipelines ETL auditados y realiza análisis exploratorio reproducible en Python/pandas, verificando cada corrección contra los datos crudos. En desarrollo, ha desplegado arquitecturas full-stack (Node.js/Express + Java tras NGINX, MySQL, Leaflet) y aplicaciones Next.js/TypeScript en Vercel. Resuelve de raíz: diagnosticó un INSERT bloqueado por estadísticas obsoletas del planificador de PostgreSQL y lo corrigió con ANALYZE a mitad de transacción. A ello suma 5 años con herramientas corporativas (Azure, Jira, CRM, SOPs) en proyectos de Medidata, Pfizer y Novo Nordisk.

### Variante para perfil HR / NEGOCIO  [id: resumen_hr]
> Mismo contenido, tono de encaje: impacto, colaboración, autonomía.
Texto: Profesional con una progresión demostrada: en 5 años en C3i/HCLTech (Sofía) pasó de agente de soporte técnico en ensayos clínicos a Team Lead, Supervisor/SME y Project Manager en proyectos de Medidata, Pfizer y Novo Nordisk, encargándose de formación de agentes, control de calidad, KPIs y SLAs. Hoy reorienta esa madurez hacia el ámbito técnico con doble formación en Data Science/IA y Desarrollo Web, y proyectos técnicos completos llevados de principio a fin. Comunica con claridad en cuatro idiomas, trabaja con autonomía y prioriza la calidad verificable. Busca un equipo donde su mezcla de experiencia corporativa y capacidad técnica aporte desde el primer día.

### Variante DIVULGATIVA / JUNIOR  [id: resumen_fan]
> Sin jerga, cercano.
Texto: David pasó 5 años trabajando en proyectos internacionales de software para ensayos clínicos (Medidata, Pfizer, Novo Nordisk), donde acabó liderando y formando equipos, y decidió dar el salto a lo que le apasiona: unir el desarrollo web con los datos y la IA. Ahora termina su ciclo de Desarrollo Web y cursa un máster en Data Science, y aprende construyendo: desde un almacén de datos para analizar un e-commerce hasta una app turística de su ciudad, Ronda. Habla cuatro idiomas, escribe sobre lo que aprende y le importa que las cosas estén bien hechas y comprobadas.

---

## 2. FORMACIÓN  (un bloque por titulación)

### [id: edu_master_datascience]
- Titulación exacta: Máster en Data Science e Inteligencia Artificial
- Centro: Evolve Academy
- Fechas (inicio – fin o "en curso"): abr. 2026 – actualidad
- Estado (en curso / finalizado / % completado): en curso {p2}
- Contenido clave / asignaturas relevantes: Machine Learning, Python para análisis de datos, Data Analytics, IA aplicada, procesamiento y visualización de datos, SQL y modelado de data warehouses {p2 data tech}
- Proyecto o trabajo destacado: EDAFatalForce (análisis exploratorio avanzado) y Data Warehouse Olist (modelado dimensional en PostgreSQL) — ver sección 5 {p2 data}
- Nota o distinción (si aplica y ayuda): ⟨por confirmar⟩ {p3}

### [id: edu_daw]
- Titulación exacta (Desarrollo de Aplicaciones Web): CFGS — Técnico Superior en Desarrollo de Aplicaciones Web (DAW)
- Centro: ILERNA Online
- Fechas: finalizando ⟨fecha de finalización prevista por confirmar⟩
- Estado: finalizando · proyecto final (RondaGuide) pendiente de defensa {p2 web dev}
- Contenido clave: desarrollo web frontend y backend, programación orientada a objetos (Java), entornos de desarrollo, bases de datos relacionales (MySQL) {p2 web dev}
- Proyecto destacado: RondaGuide — aplicación web turística de Ronda (proyecto final de ciclo) — ver sección 5 {p2 web dev}

### [id: edu_master_profesorado]
- Titulación: Máster en Profesorado de ESO, Bachillerato, FP y Enseñanza de Idiomas — especialidad Lengua Extranjera (Francés)
- Centro: Universidad de Málaga
- Fechas: 2018
- Relevancia: capacidad pedagógica y de comunicación (formación y onboarding de agentes en C3i); especialidad en francés que respalda su nivel C1. {p3 hr}

### [id: edu_grado_traduccion]
- Titulación: Grado en Traducción e Interpretación
- Centro: Universidad de Málaga
- Fechas: 2016
- Relevancia: base de su perfil multilingüe (EN C1, FR C1, PT B2) y de su precisión con el lenguaje y la documentación técnica; fundamento de sus 5 años de soporte multilingüe. {p3 hr}

### [id: edu_otros]
> Duplica este patrón para cada formación adicional. Cambia el ID
> (edu_xxx). Incluye bootcamps, FP previa, bachillerato solo si es relevante.
- Titulación:
- Centro:
- Fechas:
- Relevancia:

---

## 3. CERTIFICACIONES Y CURSOS  [id: certs]
> Lista. Para cada uno: nombre, entidad emisora, fecha, y (si tiene) enlace
> de verificación. Solo los que puedas demostrar.
- ICH Good Clinical Practice E6(R2) — Global Health Training Centre — 2020 ⟨enlace de verificación si lo tienes⟩ {p2 clinical}
- Acreditación de examinadores DELE B1-B2 (Par-649-17) — Instituto Cervantes — abr. 2017 — ID de credencial: 856247 {p3 hr}
-

---

## 4. EXPERIENCIA LABORAL  (un bloque por puesto)
> Fuente canónica: LinkedIn. Trayectoria de 5 años en C3i Solutions / HCLTech
> (Sofía, Bulgaria, ago 2018 – jul 2023), en proyectos de software para ensayos
> clínicos de Medidata, Pfizer y Novo Nordisk. Un bloque por etapa para poder
> seleccionar según la vacante. Debajo, una etapa previa de docencia/traducción.

### [id: exp_c3i_pm_tier2]
- Puesto: Project Manager – Tier 2 Support
- Empresa / organización: C3i Solutions / HCLTech — proyecto Novo Nordisk (solución de software ePID)
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: may. 2023 – jul. 2023 (3 meses)
- Modalidad: presencial — Sofía, Bulgaria
- Descripción en 1 frase: gestión y resolución de escalados de Tier 1 y peticiones directas del cliente para la solución ePID de Novo Nordisk. {p2 tech clinical}
- Responsabilidades:
  - Resolvió escalados de Tier 1 y peticiones directas del cliente; cuando la incidencia no podía resolverse en soporte, la coordinaba con las áreas correspondientes. {p2 tech clinical}
  - Trabajó con Azure, CRM y workflows corporativos basados en SOPs; elaboró documentación técnica y reporting operativo. {p2 data tech}
  - Realizó seguimiento de KPIs y coordinación con equipos internacionales; comunicación con stakeholders. {p2 data hr}
- Logros CUANTIFICADOS: creación de flujos de trabajo, SOPs, documentación y Objetos de Conocimiento para su gestión en una Base de Conocimiento para la fundación del soporte Tier 2 {p1 tech hr}
- Stack / herramientas usadas: Azure, CRM corporativo, Jira, Excel avanzado, workflows SOP, Knova, Horizon {p3 tech}
- Motivo de salida: ⟨privado⟩

### [id: exp_c3i_sme_supervisor]
- Puesto: Supervisor – Subject Matter Expert (SME)
- Empresa / organización: C3i Solutions / HCLTech — soluciones de software de Pfizer
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: dic. 2021 – may. 2023 (1 año 6 meses)
- Modalidad: presencial — Sofía, Bulgaria
- Descripción en 1 frase: responsable de la formación y el desarrollo de los agentes, tareas de supervisión y aseguramiento de la calidad para las soluciones de software de Pfizer en soporte de Emergencias Médicas y Desenmascaramiento gestionando un equipo de unos 100 agentes. {p2 hr clinical}
- Responsabilidades:
  - Dirigió la formación y el desarrollo (training & development) de los agentes del proyecto. {p2 hr}
  - Ejecutó tareas de supervisión y aseguramiento de la calidad (QA) del servicio. {p2 hr tech}
  - Analizó métricas y SLAs; reporting y soporte a la dirección. {p2 data hr}
- Logros CUANTIFICADOS: el equipo de agentes creció un 40%, la linea de soporte mejoró la calidad y los resultados SLA hasta mantener niveles superiores a los exigidos por el cliente, se hizo frente a la crisis provocada por la pandemia y la guerra en Ucrania sin afectar a la calidad del servicio {p1 hr data}
- Stack / herramientas usadas: Azure, CRM, Jira, Excel avanzado, herramientas de reporting, Knova, Horizon {p3 tech}
- Motivo de salida: promoción a Project Manager – Tier 2

### [id: exp_c3i_teamlead]
- Puesto: Team Lead – Specialist
- Empresa / organización: C3i Solutions / HCLTech — soluciones de software de Pfizer
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: abr. 2021 – dic. 2021 (9 meses)
- Modalidad: jornada completa · presencial — Sofía, Bulgaria
- Descripción en 1 frase: responsable del entrenamiento de agentes y del control de calidad, supervisión y revisión de procedimientos en aplicaciones de ensayos clínicos en Pfizer. {p2 hr clinical}
- Responsabilidades:
  - Encargado del entrenamiento de agentes para asistencia técnica en distintas aplicaciones de ensayos clínicos. {p2 hr}
  - Responsable de control de calidad, supervisión y revisión de los procedimientos internos. {p2 hr tech}
  - Coordinó incidencias escaladas de alto impacto con equipos internacionales. {p3 tech}
- Logros CUANTIFICADOS: ⟨por confirmar⟩ {p2}
- Stack / herramientas usadas: CRM, Jira, workflows corporativos {p3 tech}
- Motivo de salida: promoción a Supervisor – SME

### [id: exp_c3i_pfizer_senior]
- Puesto: Asistencia técnica – Pfizer – Senior
- Empresa / organización: C3i Solutions / HCLTech — proyecto Pfizer
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: ago. 2020 – abr. 2021 (9 meses)
- Modalidad: jornada completa · presencial — Sofía, Bulgaria
- Descripción en 1 frase: soporte técnico senior a usuarios de plataformas y software de ensayos clínicos de Pfizer. {p2 tech clinical}
- Responsabilidades:
  - Prestó soporte técnico senior a usuarios de las plataformas de Pfizer. {p3 tech clinical}
  - Registró, priorizó y resolvió incidencias con trazabilidad; documentación y reportes. {p3 tech}
  - Colaboró con equipos internacionales de QA y desarrollo. {p2 dev tech}
- Logros CUANTIFICADOS: ⟨por confirmar⟩ {p3}
- Stack / herramientas usadas: CRM, plataformas eClinical de Pfizer, herramientas de ticketing {p3 clinical}
- Motivo de salida: promoción a Team Lead – Specialist

### [id: exp_c3i_pfizer]
- Puesto: Asistencia técnica – Pfizer
- Empresa / organización: C3i Solutions / HCLTech — proyecto Pfizer
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: jun. 2019 – ago. 2020 (1 año 3 meses)
- Modalidad: jornada completa · presencial — Sofía, Bulgaria
- Descripción en 1 frase: soporte técnico a usuarios de plataformas y software de ensayos clínicos de Pfizer. {p3 tech clinical}
- Responsabilidades:
  - Atendió y resolvió incidencias de usuarios de las plataformas de Pfizer (llamadas, correos y chat). {p3 tech clinical}
  - Documentó casos y generó reportes. {p3 tech}
  - Trabajó en inglés, francés y portugués con usuarios y equipos internacionales. {p3 hr}
- Logros CUANTIFICADOS: ⟨por confirmar⟩ {p3}
- Stack / herramientas usadas: CRM, plataformas eClinical de Pfizer {p3 clinical}
- Motivo de salida: promoción a Asistencia técnica – Pfizer – Senior

### [id: exp_c3i_medidata]
- Puesto: Asistencia técnica – Medidata
- Empresa / organización: C3i Solutions / HCLTech — proyecto Medidata
- Sector: soporte IT corporativo · software para ensayos clínicos (farma)
- Fechas: ago. 2018 – jun. 2019 (11 meses)
- Modalidad: jornada completa · presencial — Sofía, Bulgaria ⟨confirmar⟩
- Descripción en 1 frase: agente de asistencia técnica de software y aplicaciones para Medidata, atendiendo a usuarios involucrados en ensayos clínicos. {p3 tech clinical}
- Responsabilidades:
  - Atendió llamadas, correos y sesiones de chat de usuarios de las aplicaciones de Medidata (p. ej. Medidata Rave) en ensayos clínicos. {p3 clinical}
  - Registró y resolvió incidencias en varios idiomas (inglés, francés, portugués). {p3 hr}
  - Documentó casos y colaboró con equipos globales. {p3 tech}
- Logros CUANTIFICADOS: ⟨por confirmar⟩ {p3}
- Stack / herramientas usadas: CRM, Medidata Rave, herramientas de ticketing {p3 clinical}
- Motivo de salida: continuidad en la cuenta Pfizer (progresión interna)

### [id: exp_docencia_traduccion]
> Etapa previa a la carrera IT (2016–2017). Contexto secundario para vacantes
> técnicas, pero refuerza el perfil multilingüe e internacional. Inclúyelo
> condensado o omítelo según el espacio del CV final.
- Puesto(s): Auxiliar de conversación (español) · Personal de apoyo (Instituto Cervantes) · Traductor y revisor (voluntariado)
- Organizaciones: Lycée Jean Monnet y Collège Jean de La Fontaine (Crépy-en-Valois, Francia); Instituto Cervantes (París); PerMondo (España)
- Fechas: oct. 2016 – dic. 2017
- Descripción en 1 frase: docencia de español y creación de material didáctico en Francia, apoyo en exámenes oficiales DELE, y traducción/revisión voluntaria de textos para ONG. {p3 hr}
- Responsabilidades:
  - Enseñanza de español a alumnos de secundaria y bachillerato bajo supervisión del profesor titular; creación de material didáctico para la competencia oral. {p3 hr}
  - Profesor en la convocatoria oficial de exámenes DELE (Instituto Cervantes, París). {p3 hr}
  - Traducción y corrección voluntaria de textos para ONG y asociaciones sin ánimo de lucro (PerMondo). {p3 hr}
- Stack / herramientas usadas: —
- Relevancia: inmersión en entorno francófono (respalda FR C1); experiencia docente y de comunicación. {p3 hr}

> Duplica este bloque por cada empleo. Un ID único por puesto (exp_empresa).

---

## 5. PROYECTOS  (el núcleo — un bloque por proyecto)
> Aquí es donde brillas. Para cada proyecto, sé específico y honesto sobre
> TU rol. Distingue "lideré / diseñé / implementé solo" de "colaboré en".

### [id: proj_olist]  — Data Warehouse Olist
- Nombre / título: Data Warehouse — Olist (e-commerce brasileño)
- Una frase de qué es: almacén de datos analítico sobre el dataset de e-commerce brasileño Olist, con esquema en estrella en PostgreSQL. {p1 data}
- Tu rol exacto: diseño e implementación individual (proyecto del Máster en Data Science, Evolve Academy). {p2 data}
- Problema que resolvía: transformar datos transaccionales crudos de Olist en un modelo dimensional consultable para obtener KPIs de negocio. {p2 data}
- Qué construiste (arquitectura, decisiones técnicas): esquema en estrella con 5 dimensiones y 1 tabla de hechos, con claves, índices, vistas y una función requerida; proceso ETL auditado en dos pasadas completas; corrección de una discrepancia de nombres de columna causada por una errata histórica en los CSV de Olist; resolución de una incoherencia entre el diagrama ER y el esquema. {p1 data}
- Reto técnico concreto superado (el "war story"): un INSERT en la tabla de hechos se colgaba de forma indefinida. Diagnosticó que la causa eran estadísticas obsoletas del planificador de PostgreSQL y lo resolvió añadiendo ANALYZE sobre las cinco dimensiones a mitad de transacción en 02_data.sql. {p2 data tech}
- Resultado / métricas verificables: KPIs verificados. ⟨métricas numéricas concretas por añadir si las tienes⟩ {p1 data}
- Stack: PostgreSQL, SQL, modelado dimensional (esquema estrella), DBeaver, Git/GitHub. {p1 data}
- Enlace repo / demo: https://github.com/dnarram/olist-ecommerce-datawarehouse {p2 data dev}
- ¿Defendido ante tribunal / evaluado? Nota: proyecto evaluado del máster. {p3}
- Artículo relacionado: "Tres decisiones técnicas que habrían falsificado mi informe de negocio" (LinkedIn) — ver Extras. {p3 data}

### [id: proj_edafatalforce]  — EDA Fatal Force
- Nombre: EDAFatalForce — Análisis exploratorio de la base Fatal Force
- Una frase: análisis exploratorio de la base Fatal Force del Washington Post (2015-2024), enriquecida con el censo ACS 2020 y datos de bodycams de la NCSL. {p1 data}
- Tu rol: diseño e implementación individual (proyecto del Máster en Data Science, Evolve Academy). {p2 data}
- Problema / pregunta de análisis: analizar los datos de uso de fuerza letal policial en EE. UU., corrigiendo miscodificaciones del dataset y aportando contexto socioeconómico. {p2 data}
- Qué hiciste (limpieza, correcciones, hallazgos): corrigió errores críticos en features.py (miscodificación de flee_status y etiquetado erróneo de armed_with) y la imputación de condados en cleaning.py; verificó todas las correcciones contra el CSV crudo; entregó eda.ipynb corregido, README, análisis narrativo y artículos adaptados por plataforma. {p1 data}
- Reto técnico concreto: las miscodificaciones afectaban a miles de filas; el reto fue detectarlas y corregirlas garantizando la trazabilidad frente a los datos originales. {p2 data tech}
- Resultado / hallazgos clave: dataset corregido y verificado, con análisis narrativo comunicable a distintas audiencias. ⟨hallazgos concretos por destacar si quieres⟩ {p1 data}
- Stack: Python, pandas, Jupyter, EDA; fuentes ACS 2020 Census y NCSL. {p1 data}
- Enlace: ⟨pendiente de publicar⟩ {p2 data dev}
- Artículo relacionado: "Lo que aprendí analizando 10 años de violencia policial en EE.UU. — y por qué los datos sin contexto mienten" (LinkedIn) — ver Extras. {p3 data}

### [id: proj_rondaguide]  — RondaGuide
- Nombre: RondaGuide — Guía web turística de Ronda
- Una frase: aplicación web turística interactiva de Ronda con arquitectura de doble servidor tras NGINX (proyecto final del ciclo DAW, Ilerna). {p1 web dev}
- Tu rol: diseño e implementación individual (proyecto final de ciclo). {p2 web dev}
- Qué construiste: arquitectura de doble servidor (Node.js/Express + servidor HTTP en Java) tras NGINX, base de datos MySQL, mapas interactivos con Leaflet y frontend en HTML/CSS/JS. {p1 web dev}
- Reto técnico: se corrigió desincronización de esquema, un desajuste de tipo en una clave foránea y datos semilla ausentes; logró un despliegue full-stack limpio en local (Mac). {p2 web dev}
- Resultado: despliegue full-stack funcional. {p1 web dev}
- Stack: Node.js, Express, Java (HttpServer), NGINX, MySQL, Leaflet, HTML/CSS/JS. {p1 web dev}
- Enlace: ⟨pendiente de publicar⟩ {p2 web dev}
- ¿Defendido ante tribunal? Nota: pendiente de defensa para el ciclo DAW (Ilerna). {p3}

### [id: proj_portfolio]  — Portfolio Adaptativo (este proyecto)
- Nombre: Portfolio Adaptativo DNR
- Una frase: portfolio web que recompila su contenido, narrativa y orden de proyectos según el tipo de visitante (HR, tech recruiter, developer, curioso), con un concierge de IA integrado. {p1 web dev tech}
- Qué lo hace especial (adaptación por visitante, concierge IA): selección de vista con efecto "recompilando"; concierge de IA (Groq / Llama 3.3 70B, OpenRouter con modelos gratuitos) con modo FAQ determinista de coste cero como respaldo; analítica sin cookies (RGPD-friendly); notificaciones de interés a Telegram; canal de contacto opt-in; enlaces de candidatura personalizados por empresa; identidad de marca propia (DNR). {p2 web dev}
- Stack: Next.js 15 (App Router), TypeScript, Vercel, Groq API, analítica cookieless. {p1 web dev}
- Enlace: https://dnr-portfolio-omega.vercel.app {p2 web dev}

> Duplica para cada proyecto adicional. ID único (proj_xxx).

---

## 6. COMPETENCIAS TÉCNICAS  (agrupadas, cada grupo un bloque)
> Sé honesto con el nivel. Un recruiter técnico lo detecta enseguida.
> Sugerencia de niveles: Avanzado / Intermedio / Básico / En aprendizaje.

### [id: skill_lenguajes]
- Lenguajes: Python — inicial-intermedio orientado a Data Science; SQL — intermedio (modelado dimensional y data warehouse en proyectos reales); Java SE — básico-intermedio (POO, proyecto RondaGuide); JavaScript / TypeScript — intermedio (proyectos web desplegados) {p1 data web dev tech}

### [id: skill_datos]
- Datos / IA: pandas, NumPy, ETL, análisis exploratorio (EDA), limpieza y transformación de datos, visualización de datos, fundamentos de Machine Learning e IA aplicada, modelado dimensional (esquema en estrella), PostgreSQL, MySQL, Jupyter, DBeaver, KPIs y reporting operativo {p1 data}

### [id: skill_web]
- Desarrollo web: HTML5, CSS3, JavaScript, Node.js, Express, Next.js 15, React, TypeScript, NGINX, Leaflet, fundamentos de APIs REST, conocimientos básicos de Spring Boot y Maven {p1 web dev}

### [id: skill_herramientas]
- Herramientas / entornos: Git, GitHub, DBeaver, VS Code, Vercel, Excel avanzado, Azure, Jira, Microsoft Project, CRM corporativos, workflows empresariales y documentación técnica {p2 tech dev}

### [id: skill_blandas]
> Soft skills, pero con evidencia. No "trabajo en equipo" a secas, sino
> "defendí RondaGuide ante tribunal" (comunicación técnica).
- Liderazgo y formación de equipos: como Team Lead y Supervisor/SME en C3i, dirigió el entrenamiento y desarrollo de agentes y la revisión de procedimientos (abr 2021 – may 2023). {p2 hr}
- Comunicación técnica multilingüe: soporte y coordinación en inglés, francés y portugués con equipos internacionales; autor de artículos técnicos divulgativos. {p2 hr dev}
- Rigor y trazabilidad: mantuvo registros audit-ready bajo SOPs en entorno de ensayos clínicos; audita sus datos contra las fuentes crudas (Olist, EDAFatalForce). {p2 data tech}
- Depuración sistemática: análisis de causa raíz como práctica profesional (Tier 2) y técnica (bloqueo de INSERT por estadísticas del planificador; correcciones de miscodificación a escala de miles de filas). {p2 dev data tech}
- Autonomía extremo a extremo: proyectos técnicos llevados solo desde el diseño hasta el despliegue. {p2 dev web data}

---

## 7. IDIOMAS  [id: idiomas]
- Español: nativo {p2 hr}
- Inglés: C1 (5+ años de entorno de trabajo profesional en inglés) {p1 hr}
- Otros: Francés — C1 (Grado en Traducción, máster con especialidad en francés, año trabajando en Francia); Portugués — B2 {p2 hr}

---

## 8. MOTIVACIONES Y OBJETIVO PROFESIONAL  [id: motivacion]
> Para el chat y para cartas de presentación. Qué buscas, qué te mueve,
> qué tipo de rol/empresa encaja contigo. 3-5 frases honestas.
Texto: David es un apasionado de la tecnología y los datos, especializado en tender puentes entre el desarrollo web full-stack y la inteligencia artificial. Tras 5 años creciendo en entornos corporativos internacionales de ensayos clínicos, reorienta su carrera hacia la construcción con datos y con código, combinando su experiencia empresarial real (KPIs, procesos, coordinación y formación de equipos) con sus capacidades técnicas. Le mueve el aprendizaje continuo y el trabajo bien hecho y verificable, y busca una oportunidad donde crecer técnicamente y aportar valor desde el primer día. ⟨ajusta o amplía con tu voz⟩ {p3 hr}

### Qué tipo de puesto buscas  [id: objetivo_puesto]
- Roles objetivo: Desarrollador Web (Junior/Full-Stack), Data Analyst, Data Engineer (junior), Data Scientist / AI (junior), desarrollo backend, automatización; abierto a prácticas DAW, contrato junior o posiciones trainee {p2}
- Sectores de interés: ventaja diferencial en farma / salud / ensayos clínicos (experiencia con Medidata Rave y plataformas de Pfizer/Novo Nordisk + certificación ICH GCP); abierto a IT/tech en general ⟨confirma tu preferencia⟩ {p3 clinical hr}
- Lo que NO buscas (para filtrar): ⟨por confirmar⟩

---

## 9. DISPONIBILIDAD Y CONDICIONES  [id: condiciones]
> Para tu referencia y para que el chat responda si preguntan. Decide qué
> es público.
- Disponibilidad de incorporación: inmediata {p2 hr}
- Modalidad preferida: remoto, híbrido, presencial y relocalización {p2 hr}
- Expectativa salarial (normalmente NO en el CV): La expectativa salarial depende de las condiciones laborales, requisitos, localización y posición. Es mejor que sea tratado directamente con David.
- Disponibilidad para viajar / relocalización: sí, disponible para viajar y relocalización {p3 hr}

---

## 10. EXTRAS  [id: extras]
> Opcional. Solo si suma. Voluntariado, charlas, publicaciones, hobbies
> relevantes, comunidades, proyectos open source, etc.

### Publicaciones / artículos  [id: extras_articulos]
- "Tres decisiones técnicas que habrían falsificado mi informe de negocio" — LinkedIn. Sobre la fragilidad de los datos a partir del data warehouse de +100.000 pedidos (proyecto Olist). {p3 data tech}
- "Lo que aprendí analizando 10 años de violencia policial en EE.UU. — y por qué los datos sin contexto mienten" — LinkedIn. Sobre el proyecto EDAFatalForce. {p3 data}

### Otros  [id: extras_otros]
- Marca personal propia (DNR) con manual de identidad, aplicada a portfolio web y perfiles profesionales. {p3 web tech}
- Perfil multilingüe con formación universitaria en Traducción e Interpretación: precisión lingüística aplicada a documentación técnica en 4 idiomas. {p3 hr}
- Experiencia internacional: 5 años viviendo y trabajando en Sofía (Bulgaria) en proyectos globales, y una etapa previa en Francia. {p3 hr}
- Formación musical: Grado elemental en formación musical y Guitarra en el Conservatorio Ramón Corrales. {p3 hr}

---

## NOTAS DE USO (no forma parte del CV)
- Para el CHAT: usa una versión comprimida y limpia de este documento (sin
  etiquetas) para responder; las etiquetas solo guían el CV descargable.
- Para el CV ADAPTADO: la IA elige QUÉ bloques según el rol pedido; dentro de
  cada bloque, {p1} aparece siempre y la afinidad ordena el resto según la
  vista del visitante. La IA elige, no redacta.
- Recetas de bloques por rol (las 7 posiciones objetivo; orientativas):
  · Data Analyst / BI Analyst → resumen_tech, proj_edafatalforce, proj_olist,
    skill_datos, skill_lenguajes, edu_master_datascience,
    exp_c3i_sme_supervisor (KPIs/SLAs), exp_c3i_pm_tier2 (reporting),
    skill_blandas, idiomas, certs.
  · Data Engineer → resumen_tech, proj_olist, proj_edafatalforce, skill_datos,
    skill_lenguajes, edu_master_datascience, skill_herramientas,
    exp_c3i_pm_tier2, idiomas.
  · Data Scientist / ML (junior) → resumen_tech, proj_edafatalforce,
    proj_olist, skill_datos, skill_lenguajes, edu_master_datascience,
    extras_articulos, idiomas. (ML = fundamentos: sé honesto en entrevista.)
  · Full-Stack / Web Developer → resumen_tech, proj_rondaguide,
    proj_portfolio, skill_web, skill_lenguajes, edu_daw, skill_herramientas,
    proj_olist (BD/SQL), idiomas.
  · Frontend Developer → resumen_tech, proj_portfolio (Next.js/React/TS),
    proj_rondaguide (Leaflet/UI), skill_web, skill_lenguajes, edu_daw,
    idiomas.
  · Backend Developer → resumen_tech, proj_rondaguide (Node/Express/Java/
    NGINX/MySQL), proj_olist (SQL/modelado), skill_web, skill_lenguajes,
    skill_datos (PostgreSQL/MySQL), edu_daw, idiomas.
  · Rol en farma/salud (cualquiera de los anteriores) → añade certs
    (ICH GCP) y 1-2 exp_c3i_* (dominio clínico real: Medidata Rave,
    plataformas Pfizer/Novo Nordisk). Es el diferenciador de David.
- Mantén este archivo en el repo (src/data/cv.ts, dentro de CV_MARKDOWN) y
  edítalo como contenido: editar → commit → push.

`;

export interface CvBlock {
  id: string;
  title: string;
  lines: string[];
}

/* Campos que nunca se muestran ni viajan a la IA */
const PRIVATE_FIELD_PREFIXES = ["- motivo de salida", "- teléfono", "- telefono", "- expectativa salarial"];

const ID_RE = /\[id:\s*([a-z0-9_]+)\]/i;

export function parseCvBlocks(md: string = CV_MARKDOWN): CvBlock[] {
  const blocks: CvBlock[] = [];
  let current: CvBlock | null = null;

  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    const isHeader = /^#{2,3}\s/.test(line);
    const m = line.match(ID_RE);

    if (isHeader && m) {
      if (current) blocks.push(current);
      const title = line
        .replace(ID_RE, "")
        .replace(/^#{2,3}\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\(.*?\)/g, "")
        .replace(/^\s*—\s*/, "")
        .replace(/\s*—\s*$/, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      current = { id: m[1].toLowerCase(), title, lines: [] };
      continue;
    }
    if (isHeader && !m) {
      if (current) blocks.push(current);
      current = null;
      continue;
    }
    if (!current) continue;
    if (line.trim().startsWith(">")) continue;
    if (line.trim() === "---") {
      blocks.push(current);
      current = null;
      continue;
    }
    if (line.includes("⟨privado⟩")) continue;
    const lower = line.trim().toLowerCase();
    if (PRIVATE_FIELD_PREFIXES.some((p) => lower.startsWith(p))) continue;

    let clean = line.replace(/⟨[^⟩]*⟩/g, "").replace(/^Texto:\s*/, "").trimEnd();
    if (/^-\s*[^:]{0,90}:\s*$/.test(clean.trim())) continue; // campo sin valor
    if (clean.trim() === "-") continue;
    current.lines.push(clean);
  }
  if (current) blocks.push(current);
  return blocks.filter((b) => b.lines.some((l) => l.trim().length > 0));
}

/* Títulos amigables para el render */
export const TITLE_OVERRIDES: Record<string, string> = {
  meta_identidad: "Identidad y contacto",
  resumen_general: "Resumen profesional",
  resumen_tech: "Resumen profesional",
  resumen_hr: "Resumen profesional",
  resumen_fan: "Resumen",
  certs: "Certificaciones",
  idiomas: "Idiomas",
  motivacion: "Motivación y objetivo profesional",
  objetivo_puesto: "Qué busca",
  condiciones: "Disponibilidad",
  extras_articulos: "Publicaciones",
  extras_otros: "Más sobre David",
  skill_lenguajes: "Lenguajes",
  skill_datos: "Datos & IA",
  skill_web: "Desarrollo web",
  skill_herramientas: "Herramientas",
  skill_blandas: "Competencias transversales",
};

export function displayTitle(b: CvBlock): string {
  if (TITLE_OVERRIDES[b.id]) return TITLE_OVERRIDES[b.id];
  if (b.title) return b.title;
  for (const key of ["- Puesto", "- Titulación exacta", "- Titulación", "- Nombre / título", "- Nombre"]) {
    const hit = b.lines.find((l) => l.trim().startsWith(key));
    if (hit && hit.includes(":")) return hit.slice(hit.indexOf(":") + 1).trim();
  }
  return b.id;
}

/* Selección curada de bloques por vista del portfolio.
   Edítala a tu gusto: es contenido, no lógica. */
export const CV_PRESETS: Record<PersonaId, string[]> = {
  tech: [
    "resumen_tech",
    "proj_olist", "proj_edafatalforce", "proj_rondaguide", "proj_portfolio",
    "skill_lenguajes", "skill_datos", "skill_web", "skill_herramientas",
    "edu_master_datascience", "edu_daw",
    "exp_c3i_pm_tier2", "exp_c3i_sme_supervisor",
    "certs", "idiomas",
  ],
  hr: [
    "resumen_hr",
    "exp_c3i_pm_tier2", "exp_c3i_sme_supervisor", "exp_c3i_teamlead",
    "exp_c3i_pfizer_senior", "exp_c3i_pfizer", "exp_c3i_medidata",
    "edu_master_datascience", "edu_daw", "edu_master_profesorado", "edu_grado_traduccion",
    "skill_blandas", "idiomas", "certs", "condiciones",
  ],
  dev: [
    "resumen_tech",
    "proj_olist", "proj_edafatalforce", "proj_rondaguide", "proj_portfolio",
    "skill_lenguajes", "skill_datos", "skill_web", "skill_herramientas",
    "extras_articulos",
  ],
  fan: [
    "resumen_fan",
    "proj_portfolio", "proj_rondaguide",
    "idiomas", "extras_articulos", "extras_otros",
  ],
};

export function selectBlocks(ids: string[]): CvBlock[] {
  const all = parseCvBlocks();
  const byId = new Map(all.map((b) => [b.id, b]));
  const seen = new Set<string>();
  const out: CvBlock[] = [];
  for (const rawId of ids) {
    const id = rawId.trim().toLowerCase();
    if (seen.has(id)) continue;
    const b = byId.get(id);
    if (b) {
      out.push(b);
      seen.add(id);
    }
  }
  return out;
}

/* Contexto del CV para el system prompt de la IA: bloques de la vista
   actual + básicos comunes. El texto llega ya limpio de datos privados. */

export function allCvIds(): string[] {
  return parseCvBlocks().map((b) => b.id);
}

/* ════════════════════════════════════════════════════════════════
   PRIORIZACIÓN POR LÍNEA (para el PDF compacto)
   ----------------------------------------------------------------
   Cada línea del CV puede llevar etiquetas inline al final:
     {p1} {p2} {p3}          → prioridad (1 = va siempre; 3 = relleno)
     {data} {tech} {web} {dev} {hr} {clinical} → afinidad de perfil
   Ejemplo:  - Redujo el backlog un 30% {p1 data}
   Si una línea no lleva etiqueta, se aplica una heurística según el
   bloque y el campo (reglas AUTO de abajo). Las etiquetas manuales
   SIEMPRE ganan a la heurística.
   ════════════════════════════════════════════════════════════════ */

export type CvAffinity = "data" | "tech" | "web" | "dev" | "hr" | "clinical";

export interface CvLine {
  text: string;
  priority: 1 | 2 | 3;
  affinity: CvAffinity[];
  /** papel en el render compacto */
  role: "item" | "prose";
}

export interface CvEntry {
  blockId: string;
  /** encabezado compacto (p. ej. "Puesto — Empresa" / "Titulación — Centro") */
  heading?: string;
  /** dato a la derecha del encabezado (fechas) */
  aside?: string;
  /** línea descriptiva bajo el encabezado (proyectos) */
  sub?: string;
  lines: CvLine[];
}

const AFFINITIES: readonly CvAffinity[] = ["data", "tech", "web", "dev", "hr", "clinical"];

/** Afinidades activas según la vista del visitante */
export const PERSONA_AFFINITY: Record<PersonaId, CvAffinity[]> = {
  tech: ["tech", "data", "web", "dev"],
  hr: ["hr", "clinical"],
  dev: ["dev", "tech", "web"],
  fan: [],
};

function extractInlineTags(raw: string): { text: string; prio?: 1 | 2 | 3; aff: CvAffinity[] } {
  let text = raw;
  let prio: 1 | 2 | 3 | undefined;
  const aff: CvAffinity[] = [];
  const tagRe = /\{([a-z0-9 ,]+)\}\s*/gi;
  text = text.replace(tagRe, (_, inner: string) => {
    for (const tok of inner.toLowerCase().split(/[ ,]+/)) {
      if (tok === "p1") prio = 1;
      else if (tok === "p2") prio = 2;
      else if (tok === "p3") prio = 3;
      else if ((AFFINITIES as readonly string[]).includes(tok)) aff.push(tok as CvAffinity);
    }
    return "";
  });
  return { text: text.trimEnd(), prio, aff };
}

/* Heurística por campo: [prefijo de id de bloque, prefijo de campo] →
   prioridad, afinidades y papel. "header/aside/sub" se extraen al
   encabezado compacto; "drop" desaparece del PDF. */
type FieldRole = "header1" | "header2" | "aside" | "sub" | "item" | "prose" | "drop";
interface AutoRule { field: string; prio?: 1 | 2 | 3; aff?: CvAffinity[]; role: FieldRole }

const AUTO_RULES: Array<{ block: string; rules: AutoRule[] }> = [
  {
    block: "exp_",
    rules: [
      { field: "- puesto", role: "header1" },
      { field: "- empresa", role: "header2" },
      { field: "- fechas", role: "aside" },
      { field: "- sector", role: "drop" },
      { field: "- modalidad", role: "drop" },
      { field: "- descripción en 1 frase", prio: 2, role: "sub" },
      { field: "- stack", prio: 2, aff: ["tech", "dev"], role: "item" },
      { field: "- relevancia", prio: 3, aff: ["hr"], role: "item" },
      { field: "- organizaciones", role: "header2" },
      { field: "- responsabilidades", role: "drop" },
    ],
  },
  {
    block: "edu_",
    rules: [
      { field: "- titulación", role: "header1" },
      { field: "- centro", role: "header2" },
      { field: "- fechas", role: "aside" },
      { field: "- estado", prio: 2, role: "item" },
      { field: "- contenido clave", prio: 3, role: "item" },
      { field: "- proyecto", prio: 2, role: "item" },
      { field: "- relevancia", prio: 3, aff: ["hr"], role: "item" },
      { field: "- nota", prio: 3, role: "item" },
    ],
  },
  {
    block: "proj_",
    rules: [
      { field: "- nombre", role: "header1" },
      { field: "- una frase", prio: 1, role: "sub" },
      { field: "- tu rol", prio: 2, role: "item" },
      { field: "- problema", prio: 3, role: "item" },
      { field: "- qué construiste", prio: 1, role: "item" },
      { field: "- qué hiciste", prio: 1, role: "item" },
      { field: "- qué lo hace especial", prio: 1, role: "item" },
      { field: "- reto técnico", prio: 2, aff: ["tech", "dev"], role: "item" },
      { field: "- resultado", prio: 1, role: "item" },
      { field: "- stack", prio: 1, aff: ["tech", "dev"], role: "item" },
      { field: "- enlace", prio: 2, aff: ["tech", "dev"], role: "item" },
      { field: "- ¿defendido", prio: 3, aff: ["hr"], role: "item" },
      { field: "- artículo relacionado", prio: 3, role: "item" },
    ],
  },
  { block: "resumen_", rules: [{ field: "", prio: 1, role: "prose" }] },
  { block: "skill_", rules: [{ field: "", prio: 1, role: "item" }] },
  { block: "idiomas", rules: [{ field: "", prio: 1, role: "item" }] },
  { block: "certs", rules: [{ field: "", prio: 1, role: "item" }] },
  { block: "condiciones", rules: [{ field: "", prio: 2, aff: ["hr"], role: "item" }] },
  { block: "motivacion", rules: [{ field: "", prio: 3, aff: ["hr"], role: "prose" }] },
  { block: "objetivo_puesto", rules: [{ field: "", prio: 3, role: "item" }] },
  { block: "extras_", rules: [{ field: "", prio: 3, role: "item" }] },
  { block: "meta_identidad", rules: [{ field: "", prio: 1, role: "drop" }] },
];

function ruleFor(blockId: string, line: string): AutoRule {
  const l = line.trim().toLowerCase();
  const group = AUTO_RULES.find((g) => blockId.startsWith(g.block));
  if (group) {
    for (const r of group.rules) {
      if (r.field === "" || l.startsWith(r.field)) return r;
    }
  }
  return { field: "", prio: 2, role: "item" };
}

function fieldValue(line: string): string {
  const idx = line.indexOf(":");
  return idx === -1 ? line.replace(/^-\s*/, "").trim() : line.slice(idx + 1).trim();
}

/** Convierte un bloque en una entrada compacta con líneas priorizadas. */
export function toCvEntry(b: CvBlock): CvEntry {
  const entry: CvEntry = { blockId: b.id, lines: [] };
  let header1: string | undefined;
  let header2: string | undefined;

  for (const raw of b.lines) {
    if (raw.trim().length === 0) continue;
    const { text, prio: tagPrio, aff: tagAff } = extractInlineTags(raw);
    if (text.trim().length === 0) continue;

    const isSubBullet = /^\s{2,}-\s/.test(text);
    const rule = isSubBullet
      ? ({ field: "", prio: 2, role: "item" } as AutoRule)
      : ruleFor(b.id, text);

    const prio = tagPrio ?? rule.prio ?? 2;
    const aff = tagAff.length > 0 ? tagAff : (rule.aff ?? []);
    const value = isSubBullet ? text.trim().replace(/^-\s*/, "") : fieldValue(text);

    switch (rule.role) {
      case "header1": header1 = value; break;
      case "header2": header2 = value; break;
      case "aside": entry.aside = value; break;
      case "sub": if (!entry.sub) entry.sub = value; else entry.lines.push({ text: value, priority: prio, affinity: aff, role: "item" }); break;
      case "drop": break;
      case "prose": entry.lines.push({ text: text.trim(), priority: prio, affinity: aff, role: "prose" }); break;
      default: {
        // Los items de campo conservan una etiqueta corta en negrita: "Stack: …"
        const label = !isSubBullet && text.trim().startsWith("- ") && text.includes(":")
          ? text.trim().slice(2, text.trim().indexOf(":") + 1)
          : "";
        entry.lines.push({ text: label ? `${label} ${value}` : value, priority: prio, affinity: aff, role: "item" });
      }
    }
  }

  if (header1 || header2) entry.heading = [header1, header2].filter(Boolean).join(" — ");
  else entry.heading = TITLE_OVERRIDES[b.id] ?? displayTitle(b);
  return entry;
}

/** Sección estándar (ATS) a la que pertenece cada bloque. */
export function atsSection(blockId: string): string {
  if (blockId.startsWith("resumen")) return "Perfil";
  if (blockId.startsWith("exp_")) return "Experiencia profesional";
  if (blockId.startsWith("proj_")) return "Proyectos";
  if (blockId.startsWith("skill_")) return "Competencias";
  if (blockId.startsWith("edu_")) return "Formación";
  if (blockId === "certs") return "Certificaciones";
  if (blockId === "idiomas") return "Idiomas";
  if (blockId === "condiciones") return "Disponibilidad";
  if (blockId === "motivacion" || blockId === "objetivo_puesto") return "Objetivo profesional";
  return "Información adicional";
}

/* ════════════════════════════════════════════════════════════════
   VISTA COMPRIMIDA PARA EL CHAT
   ----------------------------------------------------------------
   Deriva del MISMO markdown una versión en texto plano y compacta
   para el contexto de la IA cuando responde preguntas: sin etiquetas
   {p1}/{tech}, sin marcadores ⟨⟩, sin nombres de campo redundantes,
   sin comentarios. Incluye TODO el contenido (para poder responder
   cualquier pregunta) salvo las variantes de resumen que no tocan a
   esta vista. Una sola fuente → cero riesgo de desincronización.
   ════════════════════════════════════════════════════════════════ */
export function cvForChat(persona: PersonaId): string {
  const resumenId =
    persona === "hr" ? "resumen_hr" : persona === "fan" ? "resumen_fan" : "resumen_tech";
  const blocks = parseCvBlocks().filter((b) => {
    if (b.id === "meta_identidad") return false; // el contacto no ayuda a responder
    if (b.id.startsWith("resumen_")) return b.id === resumenId; // solo la variante pertinente
    return true;
  });

  const out: string[] = [];
  for (const b of blocks) {
    const e = toCvEntry(b);
    const parts: string[] = [];
    const head = e.heading ? e.heading + (e.aside ? ` (${e.aside})` : "") : "";
    if (head) parts.push(head);
    if (e.sub) parts.push(e.sub);
    for (const l of e.lines) parts.push(l.text);
    const line = parts.filter((p) => p.trim().length > 0).join(". ");
    if (line) out.push(line);
  }
  return out.join("\n");
}

/* ════════════════════════════════════════════════════════════════
   GARANTÍA DE COMPLETITUD
   ----------------------------------------------------------------
   Un CV puede PRIORIZAR según el puesto, pero nunca puede parecer
   incompleto: un candidato con 5 años en IT global y 4 proyectos no
   puede aparecer con una sola experiencia y un solo proyecto. Eso
   destruye el storytelling y levanta sospechas en el recruiter.

   CV_CORE_IDS es el esqueleto mínimo que SIEMPRE se incluye, sea
   cual sea la selección de la IA. La relevancia decide el ORDEN y el
   nivel de DETALLE (el motor del PDF condensa lo menos pertinente),
   nunca la presencia.
   ════════════════════════════════════════════════════════════════ */
export const CV_CORE_IDS: string[] = [
  // Proyectos: los 4 demuestran amplitud (SQL/ETL, Python/EDA, full-stack, producto).
  "proj_olist",
  "proj_edafatalforce",
  "proj_rondaguide",
  "proj_portfolio",
  // Trayectoria completa: la PROGRESIÓN es la historia (agente → PM en 5 años).
  "exp_c3i_pm_tier2",
  "exp_c3i_sme_supervisor",
  "exp_c3i_teamlead",
  "exp_c3i_pfizer_senior",
  "exp_c3i_pfizer",
  "exp_c3i_medidata",
  // Competencias y formación: un CV técnico sin stack completo no pasa el filtro.
  "skill_lenguajes",
  "skill_datos",
  "skill_web",
  "skill_herramientas",
  "edu_master_datascience",
  "edu_daw",
  "idiomas",
];

/**
 * Combina la selección de la IA (orden = relevancia para el puesto) con
 * el núcleo obligatorio. Devuelve ids sin duplicados: primero el resumen
 * adecuado, luego lo que la IA priorizó, y después el resto del núcleo.
 */
export function ensureCompleteSelection(ids: string[], persona: PersonaId): string[] {
  const valid = new Set(allCvIds());
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const id = raw.trim().toLowerCase();
    if (!valid.has(id) || seen.has(id) || id === "meta_identidad") return;
    out.push(id);
    seen.add(id);
  };

  const defaultResumen =
    persona === "hr" ? "resumen_hr" : persona === "fan" ? "resumen_fan" : "resumen_tech";
  push(ids.find((i) => i.trim().toLowerCase().startsWith("resumen_")) ?? defaultResumen);
  ids.forEach(push);
  CV_CORE_IDS.forEach(push);
  return out;
}