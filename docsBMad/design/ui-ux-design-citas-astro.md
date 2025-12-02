# Informe de Diseño UX/UI: Citas Astro

**Fecha:** 2025-12-01
**Proyecto:** Citas Astro
**Estado:** Propuesta Inicial

## 1. Filosofía de Diseño
El objetivo es crear una interfaz que transmita **confianza, modernidad y eficiencia**. Nos alejamos del diseño médico estéril tradicional para acercarnos a una estética "SaaS Premium" (Software as a Service), utilizando sombras suaves, bordes redondeados y una tipografía limpia.

## 2. Paleta de Colores
Se ha seleccionado una paleta basada en colores fríos para la confianza, con acentos vibrantes para la interacción.

| Función | Color | Hex | Tailwind Class | Significado |
| :--- | :--- | :--- | :--- | :--- |
| **Primario** | Deep Slate | `#0F172A` | `bg-slate-900` | Autoridad, profesionalismo, base sólida. |
| **Secundario** | Electric Blue | `#3B82F6` | `bg-blue-500` | Acción principal, tecnología, claridad médica. |
| **Acento/Éxito** | Soft Emerald | `#10B981` | `bg-emerald-500` | Disponibilidad, confirmación, salud positiva. |
| **Fondo** | Ice White | `#F8FAFC` | `bg-slate-50` | Limpieza, espacio, respiración visual. |
| **Superficie** | Pure White | `#FFFFFF` | `bg-white` | Contenedores, tarjetas. |
| **Texto Principal** | Dark Grey | `#1E293B` | `text-slate-800` | Legibilidad máxima. |
| **Texto Secundario** | Cool Grey | `#64748B` | `text-slate-500` | Metadatos, etiquetas. |

### Uso Sugerido
- **Fondos:** Usar `bg-slate-50` para el cuerpo de la página.
- **Tarjetas:** `bg-white` con `shadow-lg` y `rounded-2xl`.
- **Botones Primarios:** `bg-slate-900` con texto blanco (elegante) o `bg-blue-500` (llamativo).
- **Estados:** Verde para "Disponible", Gris para "Ocupado".

## 3. Tipografía
Recomendamos **Inter** o **Plus Jakarta Sans** (Google Fonts).
- **H1/Titulares:** Bold, Tracking tight (letras juntas).
- **Cuerpo:** Regular, Leading relaxed (interlineado cómodo).

## 4. Elementos UI Clave
- **Glassmorphism:** Usar fondos semitransparentes (`bg-white/80 backdrop-blur-md`) en cabeceras flotantes o modales.
- **Micro-interacciones:** Efectos `hover:scale-105` suaves en las tarjetas de doctores.
- **Sombras:** Sombras difusas y coloreadas (`shadow-blue-500/20`) para dar profundidad sin ensuciar.

---
