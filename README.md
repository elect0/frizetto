# OraFixa 🗓️

<p align="center">
  O platformă minimalistă pentru managementul programărilor, construită pentru eficiență și fiabilitate.
</p>

<p align="center">
  <a href="[LINKUL-TAU-VERCEL-AICI]" target="_blank"><img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Deployment"></a>
  <img src="https://img.shields.io/badge/Status-In_Development-blue?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-777.svg?style=flat-square" alt="License">
</p>

<br>

<p align="center">
  <img src="https://link-catre-o-imagine-curata-sau-gif.png" alt="OraFixa Demo" width="90%">
</p>

## Despre Proiect

În lumea serviciilor personale, de la frizerii la cabinete private, "no-show"-urile și managementul ineficient al timpului reprezintă o pierdere semnificativă de venit și o sursă de frustrare.

**OraFixa** abordează această problemă frontal, oferind o interfață curată, intuitivă și extrem de rapidă care face procesul de programare o plăcere, nu o corvoadă. Scopul este de a oferi predictibilitate profesioniștilor și simplitate clienților lor, eliminând complet haosul din calendar.

## Funcționalități Principale

-   **Proces de Booking Simplificat:** Un flux de programare redus la pașii esențiali.
-   **Notificări Automate:** Confirmări și remindere prin SMS/Email pentru a reduce rata de neprezentare.
-   **Panou de Admin Intuitiv:** O interfață curată pentru ca profesionistul să-și vadă și să-și gestioneze programul dintr-o singură privire.
-   **Managementul Disponibilității:** Control total asupra programului de lucru, zilelor libere și pauzelor.

## Stiva Tehnologică

Arhitectura a fost aleasă pentru performanță, o experiență de dezvoltare modernă și scalabilitate.

-   **SvelteKit** <img src="https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white" alt="SvelteKit"> — Framework-ul principal, pentru o interfață reactivă și performanță la nivel de server.

-   **Supabase** <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"> — Suita de backend ce oferă bază de date Postgres, autentificare și API-uri automate.

-   **Tailwind CSS** <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"> — O abordare utility-first pentru un design consistent și customizabil.

-   **shadcn-svelte** <img src="https://img.shields.io/badge/shadcn/svelte-000000?style=flat-square" alt="shadcn-svelte"> — Componente UI accesibile, nelegate de un stil anume, pentru o estetică unică.

-   **Vercel** <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"> — Platforma de hosting pentru performanță globală și deploy continuu prin Edge Network.

## Statusul Proiectului

Momentan, proiectul se află în faza inițială de dezvoltare, concentrat pe implementarea fluxului de bază pentru programări și a structurii de securitate în Supabase.

## Rulează Proiectul Local

<details>
<summary>Vezi instrucțiunile de instalare</summary>

<br>

1.  **Clonează repository-ul:**
    ```bash
    git clone [https://github.com/numele-tau/orafixa.git](https://github.com/numele-tau/orafixa.git)
    cd orafixa
    ```
2.  **Instalează dependențele:**
    ```bash
    npm install
    ```
3.  **Configurează mediul:**
    Creează un fișier `.env` pornind de la `.env.example` și adaugă cheile tale de la Supabase.
    ```env
    PUBLIC_SUPABASE_URL="url-ul-tau-supabase"
    PUBLIC_SUPABASE_ANON_KEY="cheia-ta-anon-supabase"
    ```
4.  **Pornește serverul:**
    ```bash
    npm run dev
    ```

</details>

---

<p align="center">
  <small>Dezvoltat în România. 🇷🇴</small>
</p>
