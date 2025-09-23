# Frizetto 🗓️

<p align="center">
  A minimalist platform for appointment management, built for efficiency and reliability.
</p>

<p align="center">
  <a href="[YOUR-VERCEL-DEPLOYMENT-LINK-HERE]" target="_blank"><img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Deployment"></a>
  <img src="https://img.shields.io/badge/Status-In_Development-blue?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-777.svg?style=flat-square" alt="License">
</p>

<br>

<p align="center">
  <img src="https://i.imgur.com/SF70NDA.png" alt="OraFixa Demo" width="90%">
</p>

## About The Project

In the world of personal services, from barbershops to private practices, no-shows and inefficient time management represent a significant loss of revenue and a source of frustration.

**OraFixa** tackles this problem head-on by providing a clean, intuitive, and extremely fast interface that makes the booking process a pleasure, not a chore. The goal is to provide predictability for professionals and simplicity for their clients, completely eliminating calendar chaos.

## Core Features

-   **Simplified Booking Process:** A booking flow reduced to the essential steps.
-   **Automated Notifications:** Confirmation and reminder SMS/Email to reduce the no-show rate.
-   **Intuitive Admin Panel:** A clean interface for the professional to view and manage their schedule at a glance.
-   **Availability Management:** Full control over working hours, days off, and breaks.

## Tech Stack

The architecture was chosen for performance, a modern developer experience, and scalability.

-   **SvelteKit** <img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white" alt="SvelteKit"> — The core framework, for a reactive UI and server-side performance.

-   **Supabase** <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"> — The backend suite, providing a Postgres database, authentication, and auto-generated APIs.

-   **Tailwind CSS** <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"> — A utility-first approach for a consistent and customizable design.

-   **shadcn-svelte** <img src="https://img.shields.io/badge/shadcn/svelte-000000?style=flat-square" alt="shadcn-svelte"> — Accessible, unstyled UI components for a unique aesthetic.

-   **Vercel** <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"> — The hosting platform for global performance and continuous deployment via Edge Network.

## Project Status

Currently, the project is in the initial development phase, focusing on implementing the core booking functionality and the security structure in Supabase.

## Running Locally

<details>
<summary>Click here for installation instructions</summary>

<br>

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/orafixa.git](https://github.com/your-username/orafixa.git)
    cd orafixa
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure the environment:**
    Create a `.env` file from the `env.example` template and add your Supabase keys.
    ```env
    PUBLIC_SUPABASE_URL="your-supabase-url"
    PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
The application will be available at `http://localhost:5173`.

</details>

---

<p align="center">
  <small>Developed in Romania. 🇷🇴</small>
</p>
