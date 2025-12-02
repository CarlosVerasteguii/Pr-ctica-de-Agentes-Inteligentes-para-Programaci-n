# Tech-Spec: Sistema de Citas (Astro Edition)

**Created:** 2025-12-01
**Status:** Ready for Development
**Deployment:** Vercel

## Overview

### Problem Statement
Se requiere una aplicación web eficiente y rápida para agendar citas médicas. Las soluciones tradicionales suelen ser lentas. Se busca aprovechar la arquitectura de "Islas" de Astro para ofrecer contenido estático rápido con interactividad puntual.

### Solution
Desarrollar una aplicación web utilizando **Astro** (SSR mode) como framework principal, integrando **React** para componentes interactivos (calendario) y **Supabase** como backend. El despliegue se realizará en **Vercel** aprovechando su Edge Network.

### Scope (In/Out)
**In:**
*   Página pública de listado de doctores.
*   Página de disponibilidad por doctor (SSR + Client Fetching).
*   Componente de Calendario interactivo (React).
*   Formulario de reserva de citas (Astro Actions).
*   Manejo de zonas horarias (UTC en DB).
*   Prevención básica de conflictos de citas (Race conditions).
*   Despliegue automatizado en Vercel.

**Out:**
*   Pasarela de pagos.
*   Historial médico complejo.
*   Autenticación de pacientes (MVP abierto con validación de email).

## Context for Development

### Key Architectural Decisions (ADR Synthesis)
1.  **Astro Hybrid Rendering:** Se usará modo `output: 'server'` (SSR) para permitir rutas dinámicas y Actions, pero se cachearán las páginas de listado de doctores.
2.  **State Management:** Se evitará el estado global complejo. La comunicación entre Islas (si es necesaria) se hará vía `nanostores`, pero se priorizará pasar props desde el servidor.
3.  **Timezone Strategy:** Todas las fechas se guardan en UTC en Supabase. El cliente (React) las convierte a la hora local del navegador usando `date-fns-tz`.
4.  **Race Condition Handling:** Para evitar doble reserva, se aplicará una restricción `UNIQUE(doctor_id, start_time)` en la base de datos y validación transaccional en el Action.

### Files to Reference
*   `astro.config.mjs`: Configuración del adaptador de Vercel.
*   `src/pages/disponibilidad/[providerId].astro`: Página dinámica.
*   `src/components/CalendarView.tsx`: Isla React (`client:load`).
*   `src/actions/index.ts`: Lógica de backend segura.
*   `src/lib/supabase.ts`: Cliente singleton.

## Implementation Plan

### Tasks

#### Phase 1: Setup & Infrastructure
- [ ] **Project Init:** `npm create astro@latest` + `npx astro add react tailwind vercel`.
- [ ] **Supabase Setup:** Crear proyecto y tablas (`doctors`, `appointments`).
- [ ] **DB Constraints:** Aplicar índice único para evitar solapamientos de citas.
- [ ] **Env Vars:** Configurar `.env` y variables en Vercel (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

#### Phase 2: Core UI & Logic
- [ ] **Layouts:** Crear `MainLayout.astro` con Header/Footer responsive.
- [ ] **Doctor List:** Fetch SSR de doctores en `index.astro`.
- [ ] **Availability Page:** Ruta dinámica que pre-carga datos básicos del doctor.
- [ ] **Calendar Component:** Implementar `react-big-calendar`.
    - [ ] *Logic:* Fetch de citas ocupadas al montar.
    - [ ] *UX:* Feedback visual inmediato al seleccionar slot.

#### Phase 3: Booking Flow (The Critical Path)
- [ ] **Booking Action:** Crear Astro Action `bookAppointment`.
    - [ ] *Security:* Validar inputs (Zod).
    - [ ] *Logic:* Intentar insertar en DB. Capturar error de restricción única (doble reserva).
- [ ] **Booking Form:** UI limpia en React o Astro (dentro de la isla o modal).
- [ ] **Feedback:** Mostrar tostadas/alertas de éxito o error ("Alguien tomó este horario justo antes").

#### Phase 4: Deployment
- [ ] **Vercel Config:** Verificar `astro.config.mjs`.
- [ ] **Deploy:** Conectar repo a Vercel y verificar build.

### Acceptance Criteria
- [ ] **Performance:** LCP < 2.5s en móvil.
- [ ] **Integridad:** No es posible reservar dos citas a la misma hora para el mismo doctor (probado con requests simultáneos).
- [ ] **Usabilidad:** El usuario recibe confirmación visual clara tras reservar.
- [ ] **Despliegue:** La URL de Vercel es accesible y funcional.

## Risk Mitigation (Red Team Analysis)
*   **Spam de Reservas:** Implementar Rate Limiting básico o Captcha invisible si es posible (MVP: monitoreo).
*   **Inyección SQL:** Mitigado nativamente por el cliente de Supabase (usa parámetros).
*   **Caída de DB:** Manejo de errores gracioso en el UI ("Servicio no disponible, intente más tarde").

## Testing Strategy
*   **Unit:** Validar lógica de fechas (UTC conversion).
*   **Integration:** Testear el flujo de Action -> DB -> Response.
*   **Manual:** Intentar reservar el mismo hueco desde dos pestañas al mismo tiempo.
