# Travel Planner – Entwicklungsroadmap (Vue · React · Nuxt · Next.js)

2026-09-18

## Überblick & Ziel

Vier vollständig eigenständige Referenzprojekte in einem Nx-Workspace: `travel-planner-vue`, `travel-planner-react`, `travel-planner-nuxt`, `travel-planner-next`. Fachlich und optisch nahezu identisch, technisch bewusst framework-spezifisch — jedes Projekt trägt eigene Typen, Zod-Schemas, Konstanten, Hilfsfunktionen, Demodaten und eine eigene Backend-Anbindung.

Es gibt weder eine `libs/shared`-Library noch ein zentrales `travel-planner-api`-Projekt (Ausnahme: `travel-planner-next`, siehe Phase 3). Jedes Projekt soll sich ohne versteckte Workspace-Abhängigkeit herauslösen lassen, weil daraus später ein eigenständiges Schulungsprojekt entsteht.

Der Nx-Workspace ist ausschließlich für Manuels eigene Entwicklung der vier Referenzprojekte gedacht — hauptsächlich aus GitHub-Organisationsgründen (ein Repository statt vier), nicht als fachliche Notwendigkeit. Workshop-Teilnehmer bekommen kein Nx-Setup zu Gesicht: Jeder Kurs erhält ein eigenständiges, aus dem jeweiligen Referenzprojekt abgeleitetes Projekt (siehe Phase 15).

### Commit-Konvention

Conventional Commits: `type(scope): message`

| Typ | Verwendung |
| --- | --- |
| `feat` | Neue Funktion |
| `fix` | Fehlerbehebung |
| `refactor` | Umstrukturierung ohne fachliche Änderung |
| `style` | Styling und rein visuelle Änderungen |
| `test` | Tests |
| `docs` | Dokumentation |
| `chore` | Tooling, Abhängigkeiten und Konfiguration |
| `ci` | CI/CD-Konfiguration |

Scopes: `workspace, vue, react, nuxt, next, e2e, ci, docs, design, models, api, tooling, nx, workshops`

Jeder Roadmap-Punkt sollte einen eigenständig lauffähigen Commit ergeben; reine Folgekorrekturen können in den zugehörigen Commit aufgenommen werden, solange er noch nicht veröffentlicht wurde.

## Setup-Befehle (pnpm)

Reihenfolge wie unten, alles bezogen auf `pnpm` als Paketmanager. Diese Befehle sind der konkrete Unterbau zu Phase 0 und Phase 1.

**1. Nx-Workspace anlegen**

```bash
npx create-nx-workspace@latest travel-planner --packageManager pnpm

√ Where would you like to create your workspace? · travel-planner
√ Which starter do you want to use? · custom
√ Speed up GitHub Actions, GitLab CI, and more with Nx Cloud? · skip
√ Help improve Nx by sharing your usage data? · No
```

**2. Pakete installieren**

```bash
pnpm exec nx add @nx/next
pnpm exec nx add @nx/nuxt
pnpm exec nx add @nx/react
pnpm exec nx add @nx/vue
```

Bestätigt: `@nx/nuxt` ist ein offizielles Nx-Plugin (unterstützt Nuxt `^3.0.0 || ^4.0.0`) — die Nuxt-App wird also genauso wie die anderen drei über einen offiziellen Generator angelegt, keine manuelle Registrierung nötig.

**3. Apps generieren**

```bash
pnpm exec nx g @nx/react:application apps/travel-planner-react
pnpm exec nx g @nx/vue:application apps/travel-planner-vue
pnpm exec nx g @nx/next:application apps/travel-planner-next
pnpm exec nx g @nx/nuxt:app apps/travel-planner-nuxt
```

**4. TailwindCSS (workspace-weit, alle vier Apps)**

```bash
pnpm add -Dw tailwindcss @tailwindcss/vite @tailwindcss/postcss postcss
```

**5. Validierung & Formulare**

```bash
pnpm add -w zod
pnpm add -w react-hook-form @hookform/resolvers   # React & Next.js
pnpm add -w @vuehookform/core                      # Vue & Nuxt
```

**5b. State-Management**

```bash
pnpm add -w pinia @pinia/colada        # Vue – Colada erst ab Vue Advanced tatsächlich genutzt
pnpm add -w @pinia/nuxt                # Nuxt
pnpm add -w @reduxjs/toolkit react-redux   # React – in Next.js nur bei konkretem Client-State-Bedarf
```

**6. Mock-Backend für Vue & React**

```bash
pnpm add -Dw json-server@0.17.4 json-server-auth@2.1.0
```

Nur für travel-planner-vue und travel-planner-react als Dev-Dependency – Nuxt und Next.js nutzen stattdessen die gemeinsame echte Datenbank (siehe Punkt 6 und Phase 3).

**7. Datenbank & ORM für Nuxt und Next.js (gemeinsame DB)**

*Next.js – Prisma oder Drizzle (beide als gleichwertige Kursoption):*

```bash
# Prisma
pnpm add -w @prisma/client @prisma/adapter-neon @neondatabase/serverless
pnpm add -Dw prisma
pnpm exec prisma init

# Drizzle
pnpm add -w drizzle-orm drizzle-zod @neondatabase/serverless
pnpm add -Dw drizzle-kit
pnpm add -w pg && pnpm add -Dw @types/pg   # für lokale Docker-Postgres
```

*Nuxt – Drizzle (festgelegt, damit die Schema-Objekte zu denen von Next.js passen):*

```bash
pnpm add -w drizzle-orm drizzle-zod @neondatabase/serverless
pnpm add -Dw drizzle-kit
pnpm add -w pg && pnpm add -Dw @types/pg
```

Beide Projekte zeigen auf dieselbe `DATABASE_URL` (Neon oder lokale Docker-Postgres); die Tabellendefinitionen werden pro Projekt dupliziert statt geteilt (siehe Phase 3, Nuxt-Sonderweg).

**7b. Alternative zu Neon: lokale PostgreSQL via Docker**

```yaml
# docker-compose.yml – z.B. im Next.js-App-Ordner, von Nuxt über dieselbe DATABASE_URL mitgenutzt
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: travel_planner
      POSTGRES_PASSWORD: travel_planner
      POSTGRES_DB: travel_planner
    ports:
      - "5432:5432"
    volumes:
      - travel_planner_pgdata:/var/lib/postgresql/data

volumes:
  travel_planner_pgdata:
```

```bash
docker compose up -d
```

`DATABASE_URL` lokal: `postgresql://travel_planner:travel_planner@localhost:5432/travel_planner`.

*Treiber-Weiche (beide ORMs, je nach Neon oder lokal):* Neon nutzt den HTTP/WebSocket-Treiber (`@neondatabase/serverless`), die lokale Docker-Postgres die normale TCP-Verbindung (`pg`) – pro ORM eine kleine Weiche bei der DB-Client-Instanziierung nötig, in beiden Projekten (Nuxt und Next.js) identisch umzusetzen; Details dazu gehören in die Dokumentation aus Phase 3.

*Cold-Start-Hinweis:* Neon fährt Compute nach einigen Minuten Inaktivität herunter – die erste Anfrage danach kann spürbar langsam sein. `connect_timeout`/`pool_timeout` im Connection-String hochsetzen, sonst wirkt die App im Live-Coding kaputt. Entfällt beim Docker-Pfad.

## Phase 0 – Workspace neu aufsetzen (Green Field)

Ziel: Der Workspace wird von Grund auf neu angelegt, alle vier Apps sind registriert und der Workspace lässt sich reproduzierbar installieren.

- [ ] Nx-Workspace neu anlegen (Custom-Preset, ohne Nx Cloud, ohne Teilen von Nutzungsdaten – siehe Setup-Befehle, Schritt 1) — `chore(workspace): initialize nx workspace`
- [ ] Alle vier Nx-Plugins installieren (`@nx/next`, `@nx/nuxt`, `@nx/react`, `@nx/vue` – siehe Setup-Befehle, Schritt 2) — `chore(workspace): add framework plugins`
- [ ] Die vier Apps generieren (siehe Setup-Befehle, Schritt 3) — `feat(workspace): scaffold four framework applications`
- [ ] Nx-, Node- und pnpm-Versionen dokumentieren — `docs(workspace): document required tool versions`
- [ ] Einheitliche Projektbezeichnungen und Verzeichnisstruktur herstellen — `refactor(workspace): align application names and locations`
- [ ] Generierten Nx-Beispielcode aus allen vier Apps entfernen — `chore(workspace): remove generated application examples`
- [ ] Root-Skripte zum Starten der einzelnen Apps inkl. Mock-API/DB ergänzen — `chore(workspace): add development scripts for all applications`
- [ ] Gemeinsamen Parallelstart über Nx ergänzen — `chore(workspace): add command to run all development services`
- [ ] `.editorconfig`, Formatierung und gemeinsame ESLint-Regeln einrichten — `chore(workspace): align formatting and linting rules`
- [ ] Basis-README mit Architektur und Startbefehlen anlegen — `docs(workspace): add workspace setup and usage guide`

**Meilenstein:** Alle vier Anwendungen starten und zeigen jeweils eine reduzierte Startseite.

## Phase 1 – Abhängigkeiten und eigenständige Projektfundamente

Ziel: Framework-spezifische Pakete sind korrekt zugeordnet, jedes Projekt besitzt eine vollständige, später übertragbare Grundstruktur.

**Abhängigkeiten**

- [ ] `zod` in Vue, React und Nuxt installieren — `chore(workspace): add Zod to all travel planner applications` (Next.js: Zod bleibt Teil des DB-/Server-Actions-Stacks, siehe Next.js-Sonderweg unten)
- [ ] `@vuehookform/core` in Vue und Nuxt installieren — `chore(vue): add Vue Hook Form dependencies`
- [ ] `react-hook-form` in React und Next.js installieren — `chore(react): add React Hook Form dependencies`
- [ ] `pinia` für Vue und `@pinia/nuxt` für Nuxt ergänzen — `chore(vue): add Pinia state management`
- [ ] `@pinia/colada` in Vue installieren (Vue Advanced) — `chore(vue): add Pinia Colada data fetching`
- [ ] Redux Toolkit und React Redux für React ergänzen — `chore(react): add Redux Toolkit state management`
- [ ] Redux nur bei konkretem Client-State-Bedarf in Next.js ergänzen — `chore(next): add Redux Toolkit for client state`
- [ ] `json-server@0.17.4` und `json-server-auth@2.1.0` als Dev Dependencies in Vue und React installieren — `chore(<projekt>): add JSON Server development dependencies`

**Next.js-Sonderweg (abweichend von Vue/React/Nuxt):** Statt json-server bekommt `travel-planner-next` seinen echten DB-Stack: Neon (serverless Postgres) plus wahlweise Prisma (`@prisma/adapter-neon`) oder Drizzle (inkl. `drizzle-zod`), außerdem eine lokale PostgreSQL-Alternative über Docker Compose für Teilnehmer ohne Cloud-Zugang — `chore(next): add database and ORM dependencies`

**Nuxt-Sonderweg: echte Datenbank, geteilt mit Next.js** — travel-planner-nuxt schließt an dieselbe Neon-Postgres-Datenbank wie travel-planner-next an. ORM: Drizzle (wie Next.js) — die Tabellen-Definitionen existieren als eigene, duplizierte Dateien in beiden Projekten, kein gemeinsames Package — `chore(nuxt): add database and ORM dependencies`

**Eigenständige Projektstruktur**

- [ ] Vue-Struktur für `types`, `schemas`, `data`, `utils`, `services`, `features` anlegen — `chore(vue): add self-contained project structure`
- [ ] React-Struktur für `types`, `schemas`, `data`, `utils`, `services`, `features` anlegen — `chore(react): add self-contained project structure`
- [ ] Nuxt-Struktur für `types`, `schemas`, `data`, `utils`, `composables`, `server` anlegen — `chore(nuxt): add self-contained project structure`
- [ ] Next.js-Struktur für `types`, `schemas`, `data`, `utils`, `actions`, `services` anlegen — `chore(next): add self-contained project structure`
- [ ] Nx-Modulgrenzen so konfigurieren, dass kein Projekt ein anderes Frontend importiert — `chore(workspace): enforce application independence`
- [ ] Eigenständigkeit jedes Projekts in der Architektur-Dokumentation festhalten — `docs(workspace): document intentional project duplication`

**Meilenstein:** Jedes Projekt besitzt alle vorgesehenen Ablageorte und importiert keinen Anwendungscode aus einem anderen Projekt.

## Phase 2 – Fachliches Datenmodell je Projekt definieren

Ziel: Reiseziel, Wunschlisteneintrag, Benutzer und geplante Reise sind in jedem Projekt sauber getrennt. Die Modelle bleiben fachlich gleich, werden aber bewusst viermal gepflegt.

- [ ] `Destination`-Modell in allen vier Projekten definieren (`id`, `title`, `description`, `country`, `season`, `tags`, `price`, `duration`, `imageUrl`) — `feat(<projekt>): define destination domain model`
- [ ] `User`-Modell für die Authentifizierung in allen vier Projekten definieren — `feat(<projekt>): define user domain model`
- [ ] `WishlistEntry` benutzerspezifisch modellieren (`id`, `userId`, Zuordnung zum Reiseziel) — `feat(<projekt>): define user-specific wishlist model`
- [ ] Zod-Schemas zu allen schreibbaren Modellen ergänzen — `feat(<projekt>): add domain validation schemas`
- [ ] Seasons, Sortierfelder und Sortierrichtungen typisieren — `feat(<projekt>): add destination filter constants`
- [ ] Formatierungsfunktionen für Preis und Dauer ergänzen — `feat(<projekt>): add travel data formatters`
- [ ] Identische Destination-Demodaten ablegen — `feat(<projekt>): add destination fixture data`
- [ ] Checkliste `docs/checklists/domain-parity.md` zum manuellen Abgleich der vier Datenmodelle ergänzen (Dateipfad, Schema-Name, Abweichungsbegründung je Prüfkriterium) — `docs(models): add domain parity checklist`

| Prüfkriterium | Vue | React | Nuxt | Next.js |
| --- | --- | --- | --- | --- |
| `Destination.id`: `number`, Pflichtfeld | ☐ | ☐ | ☐ | ☐ |
| `Destination.title`: getrimmter Pflichttext | ☐ | ☐ | ☐ | ☐ |
| `Destination.tags`: `string[]` | ☐ | ☐ | ☐ | ☐ |
| Zod-Schema entspricht dem TypeScript-Typ | ☐ | ☐ | ☐ | ☐ |
| Demodaten bestehen die Schema-Validierung | ☐ | ☐ | ☐ | ☐ |

**Meilenstein:** Jedes Projekt besitzt ein vollständiges Fachmodell und kann ohne Workspace-Library kopiert werden.

## Phase 3 – Projekteigene Entwicklungs-APIs

Ziel: Jede Anwendung besitzt ein eigenes Entwicklungs-Backend mit denselben Daten und Authentifizierungsregeln, damit jedes spätere Schulungsprojekt vollständig bleibt.

**Vue, React (json-server Mock-API)**

- [ ] Ordner `mock-api` mit `data.json`, `routes.json`, `server.cjs` anlegen — `feat(<projekt>): scaffold local development API`
- [ ] `data.json` mit `users`, `destinations`, `wishlist` (optional `trips`) befüllen — `feat(<projekt>): add initial travel planner database`
- [ ] Öffentlichen Lesezugriff auf `/destinations` konfigurieren — `feat(<projekt>): expose public destination endpoints`
- [ ] Schreibenden Zugriff auf Wishlist und Trips schützen — `feat(<projekt>): protect personal data endpoints`
- [ ] Benutzerbezogene Wishlist-Daten sicherstellen — `feat(<projekt>): scope wishlist entries to authenticated users`
- [ ] Lokales API-Startskript ergänzen — `chore(<projekt>): add local API development script`
- [ ] Unterschiedliche Standardports für den parallelen Workspace-Betrieb festlegen — `chore(<projekt>): configure local development ports`
- [ ] Beispielanfragen dokumentieren — `docs(<projekt>): document development API endpoints`

**Next.js-Sonderweg: echte Datenbank statt Mock-API** (Entscheidung vom 18.09.2026 — Next.js behält seinen ursprünglich geplanten DB-Stack, um die Kurstiefe zu Datenmodellierung und Migrationen abzudecken)

- [ ] Neon-Projekt (serverless Postgres) anlegen, plus Docker-Compose-Alternative für lokales Postgres — `chore(next): configure database connection options`
- [ ] Schema für `users`, `destinations`, `wishlist`, optional `trips` mit Prisma **oder** Drizzle definieren und erste Migration erzeugen — `feat(next): define database schema and initial migration`
- [ ] Destinationen als Seed-Daten (Äquivalent zu `data.json`) einspielen — `feat(next): seed initial travel planner database`
- [ ] Datenzugriffsschicht für Server Components/Server Actions aufbauen (bei Drizzle inkl. `drizzle-zod` für generierte Zod-Schemas) — `feat(next): add database access layer`
- [ ] Verbindungs- und Migrationsbefehle dokumentieren — `docs(next): document database setup and migrations`
- [ ] Identische Beispieldaten und Zugriffsregeln über alle vier Projekte hinweg mit einer manuellen Paritätsprüfung abgleichen — `docs(api): add mock API parity checklist`

**Nuxt-Sonderweg: echte Datenbank, geteilt mit Next.js** (Entscheidung vom 18.09.2026) — travel-planner-nuxt und travel-planner-next nutzen dieselbe Neon-Postgres-Datenbank; die Drizzle-Schema-Objekte existieren dennoch als eigene, duplizierte Dateien in beiden Projekten (keine gemeinsame Library).

- [ ] Nuxt an dieselbe Neon-Datenbankverbindung wie travel-planner-next anschließen (gleiche Connection-URL, eigene Umgebungsvariable) — `chore(nuxt): configure shared database connection`
- [ ] Eigene Drizzle-Tabellendefinitionen für `users`, `destinations`, `wishlist`, optional `trips` in travel-planner-nuxt anlegen (identisch zu travel-planner-next, dupliziert statt importiert) — `feat(nuxt): define database schema matching shared tables`
- [ ] Datenzugriffsschicht für Nuxt-Server-Routen (`server/api`) mit Drizzle aufbauen; die `useFetch`/`useAsyncData`-Aufrufe aus Phase 5 ändern sich dadurch nicht, sie lesen weiterhin von Nuxts eigener Server-Route — `feat(nuxt): add database access layer`
- [ ] Migrationshoheit festlegen — Annahme: travel-planner-next besitzt die Migrationen (passend zu seinem Kursziel „Datenmodellierung und Migrationen“), travel-planner-nuxt bildet die Tabellen nur ab und führt keine eigenen Migrationen aus — **bestätigt am 20.09.2026**
- [ ] Verbindungs- und Schema-Abgleich zwischen beiden Projekten dokumentieren — `docs(nuxt): document shared database setup`

**Meilenstein:** Registrierung, Login, Destination-Abruf und geschützte Wishlist funktionieren in jedem Projekt mit seinem eigenen Backend (json-server bei Vue/React, gemeinsame echte DB bei Nuxt und Next.js).

## Phase 4 – Designsystem und gemeinsames Zielbild

Ziel: Die Apps sehen identisch aus, ohne eine frameworksübergreifende UI-Komponentenbibliothek einzuführen.

- [ ] Tailwind CSS 4 in allen vier Apps konfigurieren — `chore(<projekt>): configure Tailwind CSS`
- [ ] Identische Design-Tokens für Farben, Abstände und Typografie festlegen — `style(<projekt>): define travel planner design tokens`
- [ ] Globale Basisstile angleichen — `style(<projekt>): add global application styles`
- [ ] Responsive Seitenstruktur in `docs/design/responsive-layout.md` referenzieren (Breakpoints, max. Inhaltsbreite, Grid, Verhalten von Header/Filter/Karten; Referenz-Screenshots unter `docs/design/reference/`) — `docs(design): add responsive layout specification`
- [ ] App-Header und Hauptnavigation umsetzen — `feat(<projekt>): add application shell`
- [ ] Lade-, Fehler- und Leerzustände visuell umsetzen — `style(<projekt>): add state presentation patterns`
- [ ] Barrierefreie Fokuszustände und Tastaturbedienung prüfen — `fix(<projekt>): improve keyboard accessibility`

**Meilenstein:** Vier leere Anwendungshüllen sind visuell identisch und responsiv.

## Phase 5 – Destination-Liste als erster vertikaler Funktionsschnitt

Ziel: Alle Frameworks zeigen dieselben Reisezieldaten, verwenden aber ihre jeweils passende Datenladetechnik.

- [ ] API-Client-Vertrag und Fehlerformat je App definieren — `feat(<projekt>): define destination API contract`
- [ ] Endpunktkonstanten bzw. Query-Keys ergänzen — `feat(<projekt>): add API endpoint constants`

**Vue**

- [ ] Destination-Service mit Axios — `feat(vue): add destination API service`
- [ ] `DestinationCard` — `feat(vue): add destination card component`
- [ ] `DestinationList` mit Lade-, Fehler-, Leerzustand — `feat(vue): add destination list`
- [ ] Destinations-Seite anbinden — `feat(vue): display destinations from API`
- [ ] (Vue Advanced) Destinations- und Wishlist-Abruf zusätzlich über Pinia Colada `useQuery` kapseln — `feat(vue): add Pinia Colada queries for destinations and wishlist`

**React**

- [ ] Destination-Service — `feat(react): add destination API service`
- [ ] `DestinationCard` — `feat(react): add destination card component`
- [ ] `DestinationList` mit Lade-, Fehler-, Leerzustand — `feat(react): add destination list`
- [ ] Destinations-Seite anbinden — `feat(react): display destinations from API`

**Nuxt**

- [ ] Runtime-Konfiguration für API-Basis-URL — `chore(nuxt): configure development API URL`
- [ ] Destination-Daten mit `useFetch`/`useAsyncData` laden — `feat(nuxt): load destinations with Nuxt data fetching`
- [ ] `DestinationCard` und Listenansicht — `feat(nuxt): add destination overview`
- [ ] SSR-Verhalten und Hydration prüfen — bei Korrekturen: `fix(nuxt): correct destination hydration behavior`

**Next.js**

- [ ] Server-seitigen Destination-Service implementieren (fragt jetzt die eigene DB statt einer Mock-API ab) — `feat(next): add server-side destination service`
- [ ] Reisezieldaten in einer Server Component laden — `feat(next): render destination overview on server`
- [ ] `DestinationCard` und Listenansicht — `feat(next): add destination overview components`
- [ ] Fehler- und Ladegrenzen ergänzen — `feat(next): add destination loading and error states`

**Meilenstein:** Alle vier Apps zeigen dieselben Destinationen im gleichen Layout.

## Phase 6 – Filter, Suche und Sortierung je Projekt

Ziel: Jedes Projekt besitzt eine eigene Filteroberfläche, wiederverwendbar zwischen Destination- und Wishlist-Seite. Verhalten und Gestaltung bleiben fachlich identisch.

- [ ] Fachlich identisches Filtermodell definieren (Suchtext, Saison, Tags, Sortierfeld, Sortierrichtung) — `feat(<projekt>): define destination filter model`
- [ ] Pure Filter- und Sortierfunktionen implementieren — `feat(<projekt>): add destination filtering utilities`
- [ ] Suchfeld (Titel, Land, Beschreibung) — `feat(<projekt>): add destination text search`
- [ ] Saisonfilter — `feat(<projekt>): add destination season filter`
- [ ] Tag-Filter — `feat(<projekt>): add destination tag filter`
- [ ] Sortierung nach Name und Preis — `feat(<projekt>): add destination sorting`
- [ ] Umschaltung der Sortierrichtung — `feat(<projekt>): add sort direction control`
- [ ] Filter-zurücksetzen-Funktion — `feat(<projekt>): add filter reset action`
- [ ] Filter als wiederverwendbare Framework-Komponente auslagern — `refactor(<projekt>): extract reusable destination filters`
- [ ] Filterzustand optional mit URL-Parametern synchronisieren — Nuxt: `feat(nuxt): synchronize filters with route query`; Next.js: `feat(next): synchronize filters with search params`

**Meilenstein:** Destination- und spätere Wishlist-Ansicht können dieselbe Filterlogik nutzen.

## Phase 7 – Routing und Destination-Detailseite

Ziel: Jede Destination besitzt eine direkt aufrufbare Detailseite.

- [ ] Identische Slug-Regeln definieren und Demodaten erweitern — `feat(<projekt>): add destination slugs`
- [ ] Vue Router: Detailroute — `feat(vue): add destination detail route`
- [ ] React Router: Detailroute — `feat(react): add destination detail route`
- [ ] Nuxt-Dateiroute `destinations/[slug].vue` — `feat(nuxt): add destination detail page`
- [ ] Dynamische Next.js-Route `destinations/[slug]` — `feat(next): add destination detail page`
- [ ] Nicht-gefundene Destinationen behandeln — `feat(<projekt>): add destination not-found state`
- [ ] Seitentitel/SEO-Metadaten in Nuxt — `feat(nuxt): add destination SEO metadata`
- [ ] `generateMetadata` in Next.js — `feat(next): add destination metadata generation`

**Meilenstein:** Jede App bietet dieselben Übersicht- und Detailseiten.

## Phase 8 – Registrierung, Login und Sitzung

Ziel: Benutzer können sich anmelden; Token und Benutzerinformationen werden kontrolliert verwaltet.

- [ ] Login- und Registrierungsschemas je Projekt — `feat(<projekt>): add authentication schemas`
- [ ] Auth-API-Vertrag und Token-Modell je Projekt — `feat(<projekt>): define authentication contract`
- [ ] Login-Seite in allen Apps — `feat(vue|react|nuxt|next): add login page`
- [ ] Registrierung in allen Apps — `feat(vue|react|nuxt|next): add registration page`
- [ ] Auth-State in Vue mit Pinia — `feat(vue): add Pinia authentication store`
- [ ] (Vue Advanced) Login und Registrierung zusätzlich über Pinia Colada `useMutation` kapseln — `feat(vue): add Pinia Colada auth mutations`
- [ ] Auth-State in React mit Redux Toolkit — `feat(react): add Redux authentication slice`
- [ ] Nuxt-Authentifizierung SSR-sicher über Composable/Middleware — `feat(nuxt): add SSR-safe authentication state`
- [ ] Abmelden und Benutzermenü — `feat(<projekt>): add user menu and logout`
- [ ] Geschützte Routen implementieren — `feat(<projekt>): protect authenticated routes`

**Next.js-Sonderweg:** Sitzung serverseitig und cookie-basiert integrieren, mit handgeschriebenem Passwort-Hashing gegen die eigene DB (nicht json-server-auth) — `feat(next): add server-side authentication session`

**Nuxt-Sonderweg:** Session ebenfalls serverseitig (Nuxt-Server-Route, httpOnly-Cookie) gegen dieselbe `users`-Tabelle wie Next.js, nicht gegen json-server-auth — ein per Nuxt registrierter Account ist damit auch bei Next.js gültig — `feat(nuxt): add server-side authentication session`

**Meilenstein:** Anmeldung bleibt nach einem Reload erhalten und geschützte Seiten sind ohne Sitzung nicht erreichbar.

## Phase 9 – Persönliche Wishlist

Ziel: Angemeldete Benutzer verwalten ausschließlich ihre eigene Wishlist.

- [ ] Wishlist-Servicevertrag und Mutationsantworten je Projekt definieren — `feat(<projekt>): define wishlist API contract`
- [ ] Destination zur Wishlist hinzufügen — `feat(vue|react|nuxt|next): add destination to wishlist`
- [ ] Persönliche Wishlist laden und anzeigen — `feat(vue|react|nuxt|next): add personal wishlist page`
- [ ] Filterkomponente auf der Wishlist-Seite wiederverwenden — `feat(<projekt>): enable filtering on wishlist page`
- [ ] Destination aus Wishlist entfernen — `feat(<projekt>): remove destination from wishlist`
- [ ] Doppelte Wishlist-Einträge verhindern — `fix(<projekt>): prevent duplicate wishlist entries`
- [ ] Optimistische UI dort ergänzen, wo didaktisch sinnvoll (Vue, React) — `feat(vue|react): add optimistic wishlist updates`
- [ ] (Vue Advanced) Wishlist-Mutationen (Hinzufügen, Entfernen, Update) über Pinia Colada `useMutation` kapseln — `feat(vue): add Pinia Colada wishlist mutations`
- [ ] Nicht angemeldete Benutzer zum Login weiterleiten — `fix(<projekt>): redirect guests from wishlist actions`

**Meilenstein:** Zwei unterschiedliche Benutzer sehen und bearbeiten getrennte Wunschlisten.

## Phase 10 – Formulare zum Anlegen und Bearbeiten

Ziel: Formulare demonstrieren die jeweils typische Formularbibliothek und Zod-Validierung.

- [ ] Rollen-/Berechtigungskonzept für Destination-Änderungen je Projekt festlegen — `docs(<projekt>): define destination write permissions`
- [ ] Destination-Formularschema vervollständigen — `feat(<projekt>): complete destination form schema`
- [ ] Wiederverwendbare Formularfelder und Fehlermeldungen bauen — `feat(vue|react|nuxt|next): add destination form fields`
- [ ] Destination anlegen — `feat(vue|react|nuxt): add destination creation form` / `feat(next): add destination creation action`
- [ ] Destination bearbeiten — `feat(vue|react|nuxt): add destination editing` / `feat(next): add destination editing action`
- [ ] Löschdialog und Destination-Löschung — `feat(<projekt>): add destination deletion flow`
- [ ] (Vue Advanced) Anlegen, Bearbeiten und Löschen zusätzlich über Pinia Colada `useMutation` kapseln — `feat(vue): add Pinia Colada destination mutations`
- [ ] Server-seitige Validierung in Nuxt und Next.js demonstrieren (Next.js: Validierung direkt gegen die eigene DB in Server Actions) — `feat(nuxt): validate destination mutations on server`, `feat(next): validate destination server actions`

**Meilenstein:** CRUD funktioniert in allen Varianten mit identischen Validierungsregeln.

## Phase 11 – Reiseplanung als erweiterte Ausbaustufe

Ziel: Der Unterschied zwischen einem Reiseziel und einer konkreten geplanten Reise wird sichtbar.

- [ ] `Trip`-Modell in allen vier Projekten definieren (referenziert ein Reiseziel, ergänzt `startDate`, `endDate`, `notes`, `userId`; erst hier eingeführt, da Destinationen/Wishlist vorher ohne Reiseplanung funktionieren) — `feat(<projekt>): define planned trip domain model`
- [ ] `Trip`-Endpunkte in Vue und React (lokale Mock-API) ergänzen und schützen — `feat(<projekt>): add authenticated trip endpoints`
- [ ] `Trip`-Migration und geschützte Server Actions in Next.js ergänzen (eigene DB statt Mock-API) — `feat(next): add authenticated trip data layer`
- [ ] `Trip`-Datenzugriff für Nuxt über dieselbe DB (Drizzle) ergänzen und schützen — `feat(nuxt): add authenticated trip data access`
- [ ] Reise aus einer Wishlist-Destination anlegen — `feat(<projekt>): create trip from wishlist destination`
- [ ] Start- und Enddatum validieren — `feat(<projekt>): add trip date validation`
- [ ] Reisen chronologisch darstellen — `feat(<projekt>): add planned trips overview`
- [ ] Reisen bearbeiten und löschen — `feat(<projekt>): add trip management`
- [ ] Abgelaufene und kommende Reisen kennzeichnen — `feat(<projekt>): add trip status indicators`

**Meilenstein:** Wishlist und konkrete Reiseplanung sind fachlich sauber getrennt.

## Phase 12 – Tests

Ziel: Fachlogik, zentrale Komponenten und kritische Benutzerabläufe sind abgesichert (volle QA des Referenz-Workspace; die curriculum-spezifische Reduktion je Workshop erfolgt erst in Phase 15).

**Unit Tests**

- [ ] Filter- und Sortierfunktionen — `test(<projekt>): cover destination filtering utilities`
- [ ] Zod-Schemas — `test(<projekt>): cover domain validation schemas`
- [ ] Auth-Stores/Slices — `test(<projekt>): cover authentication state`
- [ ] Formularvalidierung je Framework — `test(<projekt>): cover destination forms`

**Komponenten- und Integrationstests**

- [ ] Destination Card und Liste — `test(<projekt>): cover destination presentation`
- [ ] Suche, Filter und Sortierung — `test(<projekt>): cover destination filters`
- [ ] Wishlist-Mutationen — `test(<projekt>): cover wishlist interactions`

**Cypress E2E**

- [ ] Gleichartige Cypress-Kommandos und Fixtures je E2E-Projekt — `test(<projekt>): add Cypress commands and fixtures`
- [ ] Öffentliche Destination-Ansicht — `test(e2e): cover public destination browsing`
- [ ] Registrierung und Login — `test(e2e): cover authentication workflow`
- [ ] Wishlist-Ablauf — `test(e2e): cover personal wishlist workflow`
- [ ] Destination-CRUD — `test(e2e): cover destination management workflow`
- [ ] Gleiche Kern-Spezifikation gegen alle vier Apps ausführen — `test(e2e): align critical flows across applications`

**Meilenstein:** Die wichtigsten fachlichen Abläufe laufen automatisiert gegen alle Frontends.

## Phase 13 – Qualität, Performance und Barrierefreiheit

Ziel: Die Referenzimplementierungen sind stabil genug, um daraus Schulungsprojekte abzuleiten.

- [ ] Linting, Typecheck und Tests als gemeinsame Nx-Targets — `chore(tooling): add unified quality checks`
- [ ] Nx-Affected-Workflow prüfen — `chore(nx): optimize affected project checks`
- [ ] Bilder und responsive Bildgrößen optimieren — `perf(<projekt>): optimize destination images`
- [ ] Nuxt- und Next.js-Renderingstrategie dokumentieren — `docs(rendering): compare Nuxt and Next.js strategies`
- [ ] Lighthouse-Prüfung durchführen und Hauptprobleme beheben — `perf(<projekt>): improve Lighthouse results`
- [ ] Formulare und Dialoge auf Barrierefreiheit prüfen — `fix(<projekt>): improve form and dialog accessibility`
- [ ] Fehlerbehandlung und Benachrichtigungen vereinheitlichen — `refactor(<projekt>): align application error feedback`

**Meilenstein:** Alle Apps bestehen Linting, Typecheck und Tests und erreichen ein vergleichbares Qualitätsniveau.

## Phase 14 – CI und Dokumentation

Ziel: Jeder Branch und Pull Request wird reproduzierbar geprüft.

- [ ] CI für Installation, Linting und Typecheck — `ci(quality): add lint and typecheck pipeline`
- [ ] Unit- und Integrationstests in CI — `ci(test): add automated test pipeline`
- [ ] Cypress-Tests für die vier Apps in CI — `ci(e2e): run application end-to-end tests`
- [ ] Nx-Caching in CI konfigurieren — `ci(nx): enable Nx task caching`
- [ ] Architekturentscheidungen als ADRs dokumentieren — `docs(architecture): add architecture decision records`
- [ ] Framework-Vergleich dokumentieren — `docs(frameworks): compare framework implementations`
- [ ] Setup-, lokale API- und Testdokumentation je Projekt vervollständigen — `docs(<projekt>): complete project documentation`

**Meilenstein:** Ein frischer Checkout lässt sich installieren, starten, testen und nachvollziehen.

## Phase 15 – Workshop-Projekte ableiten

Ziel: Der Referenzworkspace bleibt vollständig; die Workshops erhalten reduzierte, didaktisch passende Ausgangsstände. Jede App wird dabei in ein eigenes, datiertes Schulungsprojekt überführt (z. B. travel-planner-vue → 2026-11-15-vue-basic-workshop).

- [ ] Funktionsumfang für Vue-Grundlagen festlegen — `docs(workshops): define Vue fundamentals scope`
- [ ] Funktionsumfang für Vue-Fortgeschrittene festlegen — `docs(workshops): define advanced Vue scope`
- [ ] Funktionsumfang für React-Grundlagen festlegen — `docs(workshops): define React fundamentals scope`
- [ ] Funktionsumfang für React-Fortgeschrittene festlegen — `docs(workshops): define advanced React scope`
- [ ] Funktionsumfang für Nuxt festlegen (ein einzelner Kurs-Scope, kein Basic/Advanced-Split — analog zum Next.js-Kurs) — `docs(workshops): define Nuxt workshop scope`
- [ ] Funktionsumfang für Next.js Fullstack festlegen — `docs(workshops): define Next.js fullstack scope`
- [ ] Cypress-Kernabläufe als eigenständige Schulungsaufgaben auswählen — `docs(workshops): define Cypress workshop scenarios`
- [ ] Start-, Zwischen- und Lösungsstände versionieren — `chore(workshops): add workshop checkpoints`
- [ ] Aufgabenstellungen und Akzeptanzkriterien formulieren — `docs(workshops): add exercises and acceptance criteria`
- [ ] Für abgeleitete Nuxt- und Next.js-Workshop-Repos je eine eigene, unabhängige Datenbank-Instanz aus dem gemeinsamen Schema bereitstellen (verhindert Dateninterferenz zwischen parallel laufenden Kursen) — `chore(workshops): provision separate database instances for Nuxt and Next.js workshops`

**Meilenstein:** Aus der Referenzanwendung können eigenständige Workshop-Repositories erstellt werden, ohne den Nx-Workspace zum Schulungsgegenstand zu machen.

## Release-Meilensteine und Definition of Done

| Version | Inhalt |
| --- | --- |
| `v0.1.0` | Workspace, vier eigenständige Apps und jeweils eigenes Backend |
| `v0.2.0` | Destination-Übersicht, Suche, Filter und Sortierung |
| `v0.3.0` | Routing und Destination-Detailseiten |
| `v0.4.0` | Registrierung, Login und persönliche Wishlist |
| `v0.5.0` | Destination-CRUD und Formularvalidierung |
| `v0.6.0` | Reiseplanung |
| `v0.9.0` | Tests, Accessibility, Performance und CI |
| `v1.0.0` | Vollständige Referenzimplementierung und Workshop-Grundlage |

**Definition of Done je Entwicklungsschritt** — ein Roadmap-Punkt gilt als abgeschlossen, wenn: die Änderung lokal funktioniert; TypeScript keine neuen Fehler meldet; Linting für betroffene Projekte erfolgreich ist; bestehende Tests weiterhin laufen; neue Fachlogik angemessen getestet ist; die Oberfläche responsiv und per Tastatur bedienbar bleibt; die Commit-Message den tatsächlichen Inhalt beschreibt; und keine fremden oder unfertigen Änderungen im Commit enthalten sind.

## Empfohlene Arbeitsweise

Für neue fachliche Funktionen ist ein vertikales Vorgehen sinnvoll:

1. Fachliches Modell und Schema anpassen.
2. Modell, Schema, lokale Mock-API bzw. DB-Migration und Demodaten in jedem Projekt erweitern.
3. Vue-Implementierung erstellen.
4. Nuxt-Implementierung mit Nuxt-typischen Mitteln erstellen.
5. React-Implementierung erstellen.
6. Next.js-Implementierung mit Next.js-typischen Mitteln erstellen.
7. Frameworksübergreifende E2E-Akzeptanztests ergänzen.
8. Unterschiede und Erkenntnisse für die Workshops dokumentieren.

Die vier Anwendungen sollen fachlich denselben Zustand erreichen. Gemeinsamer Anwendungscode ist ausdrücklich nicht das Ziel: Typen, Schemas, Demodaten, Backend, Komponenten, Routing, Formulare, State Management und Datenladen bleiben innerhalb des jeweiligen Projekts. Der fachliche Gleichstand wird über Checklisten und E2E-Akzeptanzkriterien kontrolliert, nicht über geteilte Imports.

## Offene Punkte und Entscheidungen

- [x] **Next.js-Backend:** Next.js erhält eine echte Datenbank (Neon/Postgres, Prisma und Drizzle parallel zum Vergleich (ausgeführt wird Drizzle), Migrationen, Server Actions, handgeschriebene Session-Auth) statt der json-server-Mock-API von Vue/React/Nuxt — Entscheidung vom 18.09.2026, um die Kurstiefe (Datenmodellierung, Migrationen) abzudecken. Betrifft Phase 1, 3, 8, 10 und 11.
- [x] **Nuxt-Scope:** Nuxt bleibt ein einzelner Kurs-Scope ohne Basic/Advanced-Split, analog zu Next.js — Entscheidung vom 18.09.2026.
- [x] **Pinia Colada:** War für Vue Advanced als Data-Fetching/Caching-Layer (`useQuery`/`useMutation`) vorgesehen, taucht in dieser Roadmap-Fassung nicht auf — noch zu bestätigen, ob es weiterhin Teil des Vue-Advanced-Kurses sein soll.

  **Bestätigt am 18.09.2026:** ja — `useQuery` für Destinations- und Wishlist-Abruf, `useMutation` für Login, Registrierung, AddDestinationToWishlist, Delete und Update. Betrifft Phase 1, 5, 8, 9 und 10.
- [x] **Nuxt-Datenbank:** Nuxt teilt sich ab sofort dieselbe Neon-Postgres-Datenbank mit Next.js; ORM: Drizzle. Die Drizzle-Objekte existieren dupliziert in beiden Projekten (kein gemeinsames Package) — Entscheidung vom 18.09.2026. Betrifft Phase 1, 3, 8, 11, 15. Bestätigt am 20.09.2026: travel-planner-next besitzt die Migrationen, travel-planner-nuxt bildet die Tabellen nur ab (gilt für den Referenz-Workspace; abgeleitete Workshop-Repos erhalten ohnehin je eine eigene DB-Instanz, siehe Phase 15). Next.js' Prisma-Alternative bleibt zusätzlich zum gemeinsamen Drizzle-Pfad bestehen: sowohl travel-planner-next als auch travel-planner-nuxt pflegen Prisma- und Drizzle-Objekte parallel als Vergleichsbeispiel, ausgeführt wird in beiden Projekten aber nur der Drizzle-Pfad.
