# HI357 — Leadership Demonstration (hosting preview)

This is a **separate deployment copy** made from the HI357 source you uploaded.
It does NOT replace the working local exam. It is NOT an official West Point service.

## What is in this copy

- Existing HI357 examiner rules, live audio, transcription, rubric, instructor review, and Excel functionality.
- One Node/Express service serves both the Vite-built exam and instructor dashboard over the **same HTTPS website**.
- Participant invitation code and **separate** instructor code, enforced by the server for API routes.
- Suggested grading now happens server-side **after audio upload**. Participant API responses do not include grades.
- Exam ownership checks restrict participants from overwriting other submissions; instructor APIs require instructor login.
- A ping during an active exam helps prevent the free host sleeping while Realtime voice runs.
- Simple in-memory rate limits cap Realtime token issuance and grading requests per server lifetime. Configure OpenAI spending limits too.

## Important limits — read before sharing

**Do not use this build with real cadets, actual grades, DoD IDs, sensitive material, or officially graded exams.**
Use practice IDs, consensual adult leadership volunteers, and only institutional-authorized, nonsensitive content.

The demo uses shared codes, **not** Microsoft/Army SSO. Treat codes like passwords and share the instructor code only privately.

**Render Free services lose local files whenever they restart, redeploy, or spin down.**
They sleep after approximately 15 minutes without incoming traffic. On this tier, recordings and transcripts are **TEMPORARY** and may be irretrievably lost. The app says so on its receipt. Export transcripts, audio, and Excel promptly after demonstrations. Even with an active exam heartbeat, unplanned downtime or other failure can lose work. Do not represent the gradebook as permanent storage. Paid persistent storage or a managed database/object store is needed for durable records.

A free service can wake slowly. The OpenAI API is billed separately to your account. Rendering cost controls are not an absolute usage guarantee; also use platform API spending controls. Login codes are a pilot access gate, not institution-approved identity management.

Before making a remotely accessible site on institutional devices or inviting other people to record speech, obtain whatever network/IT, institutional and participant permissions apply.

## Deploy to Render (after appropriate authorization)

1. Create a **private GitHub repository**. Put the **contents of this folder** at its root, including the `src` and `public` folders, `server.mjs`, `package.json`, `package-lock.json`, `index.html`, `instructor.html`, `vite.config.ts`, and `render.yaml`. Do NOT upload `.env`, real student records, `node_modules`, `hi357_local_data`, or API keys. `.env.example` contains placeholders only.
2. Sign in to https://dashboard.render.com/ and link the private GitHub repository.
3. Choose **New > Web Service**, Node runtime, **Free** instance. (Alternatively use the included `render.yaml` Blueprint.)
4. Set the build command to `npm ci --include=dev && npm run build` and start command to `node server.mjs`.
5. In Render **Environment**, add the secrets **in the dashboard**, not to your source code:
   - `OPENAI_API_KEY` — your existing API key (do not send it to ChatGPT or put it in GitHub)
   - `HI357_DEMO_ACCESS_CODE` — a strong random invitation code, 14+ characters
   - `HI357_INSTRUCTOR_ACCESS_CODE` — a DIFFERENT strong random code, 14+ characters, for you alone
   - `NODE_ENV` — `production`
   - Optionally `HI357_MAX_TOKENS=35` and `HI357_MAX_GRADES=45` (per running process; reset after sleep/restart).
6. Deploy. Render supplies the HTTPS `onrender.com` address. This package creates **no actual hosted URL** until you perform these steps.
7. First open the site using an **incognito/private browser window**, enter the demo code, and complete a fictional short examination. The **instructor URL is `<your-domain>/instructor`**. Open it in a separate private/incognito window and enter your instructor code. Ensure grades/audio/Excel appear there, and verify a participant cannot access `/api/exams` or `/grade`.
8. Take a backup of demo results promptly. Be prepared for sleep/restart to erase them. Share the participant link and invitation code privately only after a real remote test.

### Files to keep OUT of GitHub

`.env`, `.env.*` (except placeholder `.env.example`), `hi357_local_data/`, `node_modules/`, `dist/`, and any records, recordings, private keys or passwords.

### Local test of this SEPARATE copy (optional)

1. Copy `.env.example` to `.env` and replace the placeholders with development-only values and an API key; **never upload `.env`**.
2. Open CMD in this new demo folder and run `npm ci --include=dev`, then `npm run build`.
3. Run `node server.mjs` in that folder, then visit `http://localhost:3000/` (one CMD window is enough because Express serves the built website).
4. Participant login goes to `/`; instructor login is `/instructor`. The original two-window local project is unchanged.

### Known limitations

- No Microsoft Entra SSO, separate per-user invitations, audit-grade access logging, durable queue/storage, resumable examinations, automated retention/deletion policy or official approvals.
- The server's passcode sessions and rate limits are held in memory and reset with service restarts.
- Browsers can fail to transcribe speech accurately; verify suggested grades against recordings. The instructor determines any official grade.
- Deploy and complete an end-to-end browser test before a demonstration. The coding environment used to prepare this package could perform JavaScript/TypeScript **syntax checks**, but could not install dependencies and complete the full live build/API test because package download was unavailable.

## Help after upload

Share the **build log errors only** (not environment variables, codes, or tokens) if deployment fails. Keep the original, fully working local application as your backup.
