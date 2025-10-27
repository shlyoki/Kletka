# MMA Friends League – Admin Guide

This prototype demonstrates the mobile-first product surface for organizing friendly combat-sport events. The data is static but the UI models the end-to-end flow for organizers, fighters, judges, and spectators.

## Getting started

```bash
npm install
npm run dev
```

The app is a Next.js PWA with Tailwind for styling. All pages are optimized for mobile width first but scale to desktop.

## Key workflows

- **Create Event:** `/create-event` walks admins through details, rules, and publishing with toggles for Stripe ticketing and digital waivers.
- **Matchmaking:** `/matchmaking` filters fighters by weight, experience, and ruleset, surfacing suggested bouts and eligible fighters.
- **Event management:** `/events/[id]` shows the card, waiver status, checklists, and recent score submissions.
- **Bout management:** `/bouts/[id]` provides judge scorecards, waiver state, and coordination chat.
- **Messaging:** `/messages` includes event-wide and bout-specific threads with profanity filter copy.
- **Leaderboards:** `/leaderboards` highlights friendly ELO rankings by ruleset.
- **Member management:** `/organizer/members` lets the owner promote guests and create new fighter, judge, or organizer accounts.
- **Dashboard:** `/dashboard` summarizes approvals, incidents, exports, and payouts.

## Safety & compliance touchpoints

- Digital waiver gating appears on event and bout pages via the `WaiverStatus` component.
- Equipment and sobriety requirements live in the `Checklist` component.
- Organizer incident reports and audit notes display on the dashboard and event detail views.
- Medical notes and emergency contacts remain private within the profile UI.

## Extending the prototype

- Replace the static data in `lib/data.ts` with API calls or database queries.
- Wire the chat threads to your real-time messaging service (e.g., Firebase, Ably, or Socket.IO).
- Connect the waiver flow to an e-signature provider for signature capture and storage.
- Integrate Stripe for paid ticketing and payouts, and SendGrid/FCM for notifications.
- Expand leaderboards by calculating ELO ratings per result submission in the bout scoring logic.

## Accessibility & offline notes

- The layout uses large tap targets, high-contrast dark theme, and focusable controls.
- For offline readiness, scope service worker caching for the check-in QR and score entry pages.

## Testing checklist

- Verify all interactive controls are keyboard accessible.
- Confirm score submission updates leaderboards and fighter records when backend logic is connected.
- Ensure medical notes remain hidden from public views except organizer dashboards.
