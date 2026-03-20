# Epics and User Stories

**Project:** Práctica de Agentes Inteligentes para Programación
**Date:** 2025-12-02
**Status:** In Progress

---

## Context Validation

- **PRD:** Loaded from `docsBMad/sprint-artifacts/tech-spec-citas-astro.md`
- **Architecture:** Loaded from `docsBMad/sprint-artifacts/tech-spec-citas-astro.md`
- **UX Design:** Loaded from `docsBMad/ux-design-specification.md`

## Functional Requirements Inventory

| ID | Requirement | Description | Source |
|---|---|---|---|
| **FR1** | Doctor Listing | Public page displaying a list of available doctors. | Tech-Spec |
| **FR2** | Availability View | Page showing availability for a specific doctor (SSR + Client Fetching). | Tech-Spec |
| **FR3** | Interactive Calendar | React component to view and select appointment slots. | Tech-Spec |
| **FR4** | Appointment Booking | Form to book an appointment using Astro Actions. | Tech-Spec |
| **FR5** | Timezone Handling | System must handle dates in UTC and convert to local time. | Tech-Spec |
| **FR6** | Conflict Prevention | Mechanism to prevent double bookings (Race conditions). | Tech-Spec |
| **FR7** | Automated Deployment | CI/CD pipeline for Vercel deployment. | Tech-Spec |
