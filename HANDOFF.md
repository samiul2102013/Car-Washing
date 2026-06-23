# HANDOFF — Car Wash Admin: API Integration (remaining work)

> **Context for the next AI (DeepSeek v4 / any agent):**
> This is a Next.js 16 App-Router admin dashboard for a car-wash booking platform.
> The backend is a Django REST API (OpenAPI spec at `~/Downloads/CarWash API.openapi.json`,
> base URL `http://72.62.248.97:85`, all admin endpoints under `/api/admin/*`, SimpleJWT Bearer auth).
> The previous session built the API foundation and wired 4 of 8 screens. This file tells you
> **exactly** what is done, what is left, and how to do it consistently.

---

## 0. READ THIS FIRST (project rules)

1. **`AGENTS.md`** says: *"This is NOT the Next.js you know"*. Next.js version is **16.2.6**.
   If unsure about an API/convention, read `node_modules/next/dist/docs/01-app/` before writing code.
   Heed deprecation notices.
2. **Match existing style.** Pages are `'use client'`, use Tailwind with custom tokens
   (`text-main-font`, `bg-dark-50`, `text-orange-300`, etc.), `@iconify/react` for icons,
   and the shared `<Table>` component from `src/components/ui/table`.
3. **Do NOT change service signatures** unless noted — pages depend on them.
4. **Do NOT touch** these screens (owner will handle later): Dashboard (`/`), Earnings (`/earnings`),
   Car Types (`/car-types`), Settings (`/settings`). They stay mock/localStorage.

---

## 1. What is ALREADY DONE ✅ (do not redo)

### Foundation
- **`src/services/api.ts`** — typed `fetch` client. Exports `api` (`get/post/patch/put/delete`),
  `tokenStorage`, `setAuthFailureHandler`, `ApiError`. Auto-attaches `Authorization: Bearer`,
  auto-refreshes once on 401, normalizes errors, handles DRF pagination shapes
  (`results` / `data` / `items`).
- **`src/services/mappers.ts`** — `camelKeys()` + `mapUser/mapBooking/mapPayout/mapService`
  convert snake_case API payloads → the existing camelCase domain types in `src/types/index.ts`.
  Includes defensive enum normalization (e.g. `blocked/banned → suspended`, `canceled → cancelled`).
- **`src/constants/config.ts`** — `API_BASE_URL` + `AUTH_ENDPOINTS` (`LOGIN`, `REFRESH`, `LOGOUT`).
- **`src/services/index.ts`** — fully rewritten. Each service object (`bookingService`,
  `userService`, `serviceConfigService`, `payoutService`, `earningService`, `carTypeService`,
  `notificationService`) now either calls the real API or is marked `// [MOCK]` with the reason.

### Screens wired to real API
- **Auth / Login** (`src/app/auth/login/page.tsx` + `src/providers/AuthProvider.tsx`)
  - Real login via `POST /api/auth/login/` (expects `{access, refresh}` + optional `user`).
  - Token stored in `localStorage` (`carwash_access_token` / `carwash_refresh_token`).
  - Auto-restore session, auto-logout on 401-after-refresh.
  - **Deleted:** `auth/forgot-password`, `auth/verify-otp`, `auth/reset-password` (owner: "admin will have just login screen").
- **Users** (`src/app/(dashboard)/users/page.tsx`)
  - `getUsers()` → `GET /api/admin/users/`.
  - **Block/Unblock** in the drawer works: `updateUserStatus(id,'suspended')` → `POST .../block/`,
    `updateUserStatus(id,'active')` → `POST .../unblock/`. Button shows loading + error feedback.
  - Removed the mock `defaultUsers` fallback so the API is the single source of truth.
- (Bookings / Services / Payouts / Notifications services are written in `index.ts`
  but the **page files still need their fetch handlers updated** — see §2.)

### Endpoints available (from the OpenAPI spec)
```
GET    /api/admin/dashboard/
GET    /api/admin/users/                          ?role=&status=&search=
GET    /api/admin/users/{id}/
POST   /api/admin/users/{id}/block/
POST   /api/admin/users/{id}/unblock/
GET    /api/admin/providers/{id}/documents/
PATCH  /api/admin/documents/{id}/review/          {status: approved|rejected, admin_note}
POST   /api/admin/providers/{id}/approve/
POST   /api/admin/providers/{id}/reject/
GET    /api/admin/bookings/                       ?status=&search=
GET    /api/admin/bookings/{id}/
POST   /api/admin/bookings/{id}/cancel/           {cancel_reason}   ← NOT NEEDED (owner said no cancel UI)
GET    /api/admin/earnings/
GET    /api/admin/payouts/                        ?status=
POST   /api/admin/payouts/{id}/retry/
GET    /api/admin/services/
POST   /api/admin/services/                       {name, description, base_price, is_active, order}
GET    /api/admin/services/{id}/
PATCH  /api/admin/services/{id}/                  (any subset of create fields)
DELETE /api/admin/services/{id}/
GET    /api/admin/config/                         {platform_fee_fixed, commission_percent, distance_price_per_km}
PATCH  /api/admin/config/
POST   /api/admin/notifications/send/             {target: all|customers|providers, title, body}
```

---

## 2. What is LEFT to implement 🔧 (in this order)

### Task A — Bookings page (`src/app/(dashboard)/bookings/page.tsx`)
**Goal:** use real data; remove dead code. Service layer is already correct.

In `BookingsContent()`:
1. **Delete the `defaultBookings` constant** (lines ~24–145, the big hardcoded array).
2. **Simplify `fetchBookings`** — remove the mock fallback:
   ```ts
   const fetchBookings = async () => {
     try {
       const data = await bookingService.getBookings();
       setBookings(data);
     } catch (err) {
       console.error('Failed to load bookings:', err);
       setBookings([]);
     } finally {
       setLoading(false);
     }
   };
   ```
   (Optionally pass `{ status: statusFilter !== 'all' ? statusFilter : undefined, search: searchQuery }`
   to let the backend filter — but client-side filtering already exists at line ~191, so leaving it
   client-side is fine too. Pick one; don't double-filter.)
3. **Delete `handleUpdateStatus`** (lines ~175–188). It calls `bookingService.updateBookingStatus`
   which **no longer exists** (owner: "no cancel / no status change in UI"). Grep confirms it is
   **never called from any JSX** — safe to delete outright.
4. **Remove the now-unused `BookingStatus` import** from `../../../types` if TS complains.
5. Verify the `MapView` (Leaflet) still works — `mapBooking()` already passes through
   `coordinates`, `providerCoordinates`, `routePath` when the API returns them. If the API does
   **not** return map fields, the map will render at 0,0 — note this for the owner (see §4 open Q#2).

**Verify:** page loads, table renders API rows, map tab doesn't crash.

---

### Task B — Services pages (`src/app/(dashboard)/services/page.tsx` + `services/create/page.tsx`)
**Goal:** list from API; create posts to API; wire edit/delete buttons.

**`services/page.tsx`** currently renders a hardcoded `figmaServices` array and the edit/delete
buttons are `onClick={() => {}}` no-ops. Do this:
1. Replace local `figmaServices` with state + fetch:
   ```ts
   const [services, setServices] = useState<Service[]>([]);
   const [loading, setLoading] = useState(true);
   const loadServices = async () => {
     try { setServices(await serviceConfigService.getServices()); }
     catch (e) { console.error(e); setServices([]); }
     finally { setLoading(false); }
   };
   useEffect(() => { loadServices(); }, []);
   ```
2. **Field mapping note:** the API service object has `name, description, base_price, is_active, order`
   — **no `engineSupported`, no `imageUrl`, no `lastUpdated`**. The current UI filters by
   `engineType: 'Petrol'|'Electric'` and shows an engine icon column. **That concept does not exist
   in the backend.** Two options — pick **option 1** unless owner says otherwise:
   - **(Option 1, recommended)** Remove the Petrol/Electric tabs + engine column entirely; show
     `name | description | base_price | status (is_active) | actions`.
   - (Option 2) Keep the tabs but treat them as a client-side cosmetic filter with no backend meaning.
3. Wire **Delete**: `onClick={() => serviceConfigService.deleteService(s.id).then(loadServices)}`.
   Add a `confirm('Delete this service?')` first.
4. **Edit** — there's no edit page/route yet. For now, wire it to a simple `prompt` or leave the
   button but add a TODO. (Preferred: open a small inline modal later; out of scope for this handoff
   unless owner wants it.)
5. Render a loading skeleton while `loading` is true (there's already a `ServicesLoadingSkeleton`
   at the bottom of the file — reuse it).

**`services/create/page.tsx`** — the form already collects `serviceName, basePrice, description`.
Do this on submit:
```ts
import { serviceConfigService } from '../../../../services';
import { useRouter } from 'next/navigation';

const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const price = parseFloat(basePrice.replace(/[^0-9.]/g, '')) || 0;
  await serviceConfigService.addService({
    name: serviceName,
    description,
    basePrice: price,
    isActive: true,
  });
  router.push('/services');
};
```
Then attach `onSubmit={handleSubmit}` to the form and make the "Create" button `type="submit"`.
Ignore the dirt-level/fee fields in the form for now — no backend endpoint for them (see §3).

**Verify:** list refreshes after create; delete removes the row.

---

### Task C — Payouts page (`src/app/(dashboard)/payouts/page.tsx`)
**Goal:** real list; wire retry button on failed payouts.

1. The page already calls `payoutService.getPayouts()` (line ~24) — good. But it also defines a
   huge `figmaPayouts` fallback (~line 40+). **Decide with owner:** keep `figmaPayouts` as the empty
   state or remove it. Recommendation: remove and show "No payouts yet" empty row like the users
   page does.
2. Field mapping: `mapPayout()` already maps `grossAmount/netPaid/amount → amount`,
   `transactionHash/reference/id → transactionHash`. The UI shows columns `grossAmount`,
   `commission`, `netPaid` — the API only gives one amount. **Ask owner** whether commission
   breakdown comes from the API (it's not in the spec). Until then, show `amount` in one column
   and leave commission/net blank or computed client-side.
3. **Wire retry:** the page has a status tab `Failed`. On failed rows, show a "Retry" button that
   calls `await payoutService.retryPayout(p.id)` then reloads. (Currently there is no retry button
   in the UI — add a small button in the actions column for `status === 'Failed'` rows only.)
4. **`releasePayout` / `updatePayoutStatus` now THROW `ApiNotSupported`** by design — no endpoint.
   If the page calls them, wrap in try/catch and show a toast "Not supported yet". Grep the page
   to see if they're used; if not used, leave as-is.

**Verify:** list loads from API; retry button calls endpoint.

---

### Task D — Notifications page (`src/app/(dashboard)/notifications/page.tsx`)
**Goal:** send via real API; history stays static for now (no list endpoint).

1. The page's `handleSendNotification` (around line ~85) currently just prepends to local
   `notificationLogs`. Change it to also hit the API:
   ```ts
   import { notificationService } from '../../../services';
   const handleSendNotification = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!title || !message) return;
     try {
       setSending(true);
       const audienceMap = { All: 'all', Customer: 'customers', Provider: 'providers' } as const;
       const created = await notificationService.broadcastNotification(
         title, message, audienceMap[activeAudience]
       );
       setNotificationLogs([{
         id: created.id, title, body: message,
         audience: activeAudience,
         dateTime: new Date().toLocaleDateString('en-GB'),
         status: 'Sent',
       }, ...notificationLogs]);
       setSuccessBanner(`Notification "${title}" dispatched to ${activeAudience}.`);
       setTitle(''); setMessage('');
       setTimeout(() => setSuccessBanner(null), 4000);
     } catch (err) {
       console.error(err);
       setSuccessBanner(null); // or an error banner
     } finally { setSending(false); }
   };
   ```
2. Note: `notificationService.broadcastNotification` maps `target` = `all|customers|providers`
   (snake-case plural) which matches the spec's `target` field.
3. The history list (`notificationLogs` / `initialLogs`) stays static — there is **no list endpoint**.
   Leave as-is or clearly label it "Recently sent (this session)".
4. Add a `sending` state to disable the submit button while in flight.

**Verify:** submitting the form hits `POST /api/admin/notifications/send/`; success banner shows.

---

## 3. Known gaps / decisions for the OWNER (flag these, don't guess)

| # | Screen | Question |
|---|--------|----------|
| 1 | Login | Confirm the login endpoint is `POST /api/auth/login/` returning `{access, refresh, user?}`. The spec has NO auth endpoints documented — `AUTH_ENDPOINTS` in `config.ts` is an educated guess (SimpleJWT standard). **If wrong, fix `src/constants/config.ts` + `AuthProvider.tsx`.** |
| 2 | Bookings map | Does `GET /api/admin/bookings/` return `coordinates`, `provider_coordinates`, `route_path`? The Leaflet map needs them. If absent, map shows 0,0. |
| 3 | Services | Backend has no `engine_type` / `category` / `duration_minutes` / `image`. The UI is built around Petrol/Electric. **Should we drop the engine concept (recommended) or keep it cosmetic?** |
| 4 | Services edit | No edit UI exists. Build a modal, or out of scope? |
| 5 | Payouts | API gives one `amount`, UI wants `gross/commission/net` split. Is commission in the response? |
| 6 | Payouts release | No create-payout endpoint. Should the "Release payout" button be removed? |
| 7 | Notifications list | No list endpoint. History stays session-only / static seed? |
| 8 | Field naming | Assumed snake_case from Django (handled by `camelKeys`). Verify a real response once the backend is reachable. |
| 9 | Provider docs | `GET /api/admin/providers/{id}/documents/` + `PATCH /api/admin/documents/{id}/review/` exist, but the Users drawer doc-modal uses a hardcoded `mockDocuments` array. Wiring it = fetch docs on drawer open, map statuses, call `reviewDocument()`. **Listed as a stretch task — not in §2.** |
| 10 | Provider approve/reject | Endpoints exist (`/providers/{id}/approve/` + `/reject/`) and `userService` methods exist (`approveProvider`, `rejectProvider`). The Pending tab's Approve/Reject buttons currently just `alert()`. Wire them: `userService.approveProvider(id)` / `.rejectProvider(id)` then `fetchUsers()`. **Quick win — add to Task A or do separately.** |

---

## 4. How the code fits together (architecture note)

```
Page component
   └── imports { bookingService } from '@/services'      ← src/services/index.ts
            └── calls api.get('/api/admin/bookings/')    ← src/services/api.ts
                     └── returns raw JSON
            └── runs response through mapBooking(camelKeys(raw))   ← src/services/mappers.ts
   └── receives typed Booking[] and renders
```

- **All pages import from `src/services`** (barrel). Never call `api.*` directly from a page.
- **All snake_case → camelCase happens in the service layer**, so pages keep using the
  camelCase types in `src/types/index.ts`.
- Token is in `localStorage` keys `carwash_access_token` / `carwash_refresh_token`.

---

## 5. Final verification checklist (run before declaring done)

```bash
# 1. Type-check / build (Next 16)
npm run build          # or: npx tsc --noEmit
# Expect: no errors. Fix any unused-import or type errors you introduced.
```

- [ ] `npm run build` passes with zero new errors.
- [ ] Login → real `POST /api/auth/login/`; bad creds show error; good creds redirect to `/`.
- [ ] Users page loads from API; Block toggles to "Blocked", Unblock back to "Active".
- [ ] (Task A) Bookings table renders API rows; no `updateBookingStatus` references remain.
- [ ] (Task B) Services list from API; create adds a row; delete removes one.
- [ ] (Task C) Payouts list from API; retry button calls endpoint on Failed rows.
- [ ] (Task D) Notifications form POSTs to `/api/admin/notifications/send/`.
- [ ] No leftover `console.log` beyond existing error logging.
- [ ] Grep for dead refs: `grep -rn "updateBookingStatus\|figmaServices\|defaultBookings" src/`
      should return nothing (or only inside comments).

---

## 6. Files changed in the previous session (for reference / git)

```
M  src/app/(dashboard)/users/page.tsx          (real API + block/unblock + error UI)
M  src/app/auth/login/page.tsx                 (removed forgot-password link + test creds box)
M  src/providers/AuthProvider.tsx              (real login, token storage, auto-logout)
M  src/services/index.ts                       (all services rewritten — real + [MOCK])
M  src/constants/config.ts                     (API_BASE_URL + AUTH_ENDPOINTS)
D  src/app/auth/forgot-password/page.tsx       (deleted)
D  src/app/auth/verify-otp/page.tsx            (deleted)
D  src/app/auth/reset-password/page.tsx        (deleted)
?? src/services/api.ts                         (NEW — API client)
?? src/services/mappers.ts                     (NEW — snake→camel + entity mappers)
```

**Next agent: start at §2 Task A.** Each task is independent and verifiable on its own.
When blocked on an owner decision (§3), stop and ask — do not guess on data-shape questions.
