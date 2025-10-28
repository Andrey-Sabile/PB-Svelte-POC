Page Cheatsheet

Route Placement

Public/marketing/auth routes → src/routes/ (top level).
Authenticated LMS views → grouped under src/routes/(app)/ with nested subfolders per feature (classrooms/, events/, announcements/, exams/, lessons/, quizzes/, grades/).
Rendering Flags

Public pages: add +page.ts (or +layout.ts) with export const prerender = true and export const ssr=true; to bake static HTML.
App shell: in src/routes/(app)/+layout.ts, set export const ssr = false; and export const csr = true; to rely on client-only rendering.
Feature pages needing SEO or stable content can opt back into prerendering individually (+page.ts with both prerender = true; ssr = true;)—omit for highly dynamic views.
Shared Layouts

src/routes/+layout.ts: fetch lightweight global config (branding, feature flags) via PocketBase REST during load.
src/routes/(app)/+layout.ts: guard auth (redirect if no session), fetch user profile/role, expose locals.pb SDK instance.
Role-specific layouts (e.g. src/routes/(app)/teacher/+layout.ts) load common data for that role (class rosters, upcoming assignments) and provide contexts via load return value.
Data Fetching Pattern

Use PocketBase JS SDK (from pb helper) inside load for initial data; expose via returned props.
On client, keep state with Svelte 5 runes (let records = $state([]);).
Subscribe to real-time updates in onMount using pb.collection('...').subscribe(...) and update state.
Feature Modules

Classroom Management: +page.ts load fetches classes (pb.collection('classrooms').getList(...)). Table component displays; allow role-gated actions.
Events/Calendar: fetch events, cache in $state; integrate client-only calendar lib inside if (browser) guard.
Notifications/Announcements: load latest items, use real-time subscriptions for pushes.
Exam Builder/Question Bank: separate routes for bank (question-bank/+page.svelte) and builder (exam-builder/+page.svelte). Client-only editors; persist via SDK mutations.
Content & Lesson Planner: +page.ts load pulls lessons; use derived filters per class/subject.
Quiz Taker: render CSR-only route; on mount fetch quiz, start timer, submit answers via SDK.
Grade Views: server load fetches grade summaries; allow Excel/PDF export via client actions calling PocketBase endpoints/hooks.
Deployment Loop

npm run build → copies pb-sv/build/ into PocketBase pb_public/.
Ensure env uses relative asset paths since static hosting sits under PocketBase server domain.
Security/Rules Checklist

Define PocketBase collection rules per feature for teacher/student/parent access.
Use PocketBase expand to prefetch related data (e.g., classroom -> teacher).
Prefer calling PocketBase actions via JS SDK; redirect unauthenticated users to /login.
Quality-of-Life Notes

Centralize type defs (PocketBase Typegen) in src/lib/types/pb.ts.
Keep form actions lean: use SvelteKit form actions for server mutations when SSR is enabled; else call SDK and handle errors in client state.
Document route purpose + rendering mode in file header comments for quick reference.
Natural next steps:

Scaffold (app) route group and shared auth layout.
Outline PocketBase schema matching the feature bullets before implementing the pages.
