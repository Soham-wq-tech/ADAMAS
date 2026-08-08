# Connecting your frontend to this backend

Your frontend (`localhost:3000`) is currently rendering `/login`, `/dashboard`,
`/interview`, and `/interview/room` with mock/static data. Below is exactly
what to add/change, page by page.

## 0. One-time setup

**Add an API client** — create `lib/api.js` (or `.ts`) in your frontend project:

```js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
```

**Add an env file** at the frontend root: `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Enable CORS on the backend** — already handled by `CORS_ORIGINS` in `.env`
(set it to `http://localhost:3000`).

---

## 1. `/login` page (Image 5)

Wire up the three actions:

```js
import { apiFetch } from "@/lib/api";

// Sign In button
async function handleSignIn(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  router.push("/dashboard");
}

// Continue as Guest button
async function handleGuest() {
  const data = await apiFetch("/api/auth/guest", { method: "POST" });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("isGuest", "true");
  router.push("/dashboard");
}

// Continue with Google button — after you get an id token/email from
// Google Identity Services on the client:
async function handleGoogle(profile) {
  const data = await apiFetch("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ email: profile.email, name: profile.name }),
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  router.push("/dashboard");
}
```

"Sign up" link → same `/api/auth/register` call with `{name, email, password}`.

---

## 2. `/dashboard` page (Images 1 & 3)

Replace the static "—" placeholders and "No insights yet" block:

```js
useEffect(() => {
  apiFetch("/api/dashboard/analytics").then(setAnalytics).catch(console.error);
}, []);
```

Map fields to the UI:
- `interviews_completed` → "Interviews Completed"
- `average_score` → "Average Score"
- `current_streak` → "Current Streak"
- `dsa_solved` → "DSA Solved"
- `insights_unlocked` (bool) → toggles the "No insights yet" panel vs a real insights panel
- `insight_categories` → the four checklist items (Communication, Technical Skills, Confidence, AI Insights)

Also show the "Guest Mode — your progress won't be saved" banner only when
`localStorage.getItem("isGuest") === "true"`, and the "Sign In →" link should
route to `/login`.

**Start Interview** button → route to `/interview` (setup page), no API call needed here.

---

## 3. `/interview` setup page (Image 4)

On mount, populate the Company / Interview Type / Mood grids dynamically
(or keep them hardcoded client-side — they already match `/api/interview/options`):

```js
useEffect(() => {
  apiFetch("/api/interview/options").then(setOptions);
}, []);
```

**Start Interview** button:

```js
async function handleStart() {
  const data = await apiFetch("/api/interview/start", {
    method: "POST",
    body: JSON.stringify({ company, type: interviewType, mood }),
  });
  // data.interview.id, data.message (first AI question)
  router.push(
    `/interview/room?interviewId=${data.interview.id}&company=${company}&type=${interviewType}&mood=${mood}`
  );
}
```

Note: keep your existing query params (`company`, `type`, `mood`) for display,
but also pass `interviewId` — the room page needs it for every subsequent call.

---

## 4. `/interview/room` page (Image 2)

This is the biggest change — replace mocked "Listening..." / static welcome
message with real calls:

```js
const { interviewId } = router.query;
const [messages, setMessages] = useState([]); // load from data.message on start,
                                                 // or GET /api/interview/{id} on refresh

// After the user finishes speaking (speech-to-text → text, or typed input):
async function sendAnswer(transcribedText) {
  setMessages((prev) => [...prev, { sender: "user", content: transcribedText }]);
  const data = await apiFetch(`/api/interview/${interviewId}/message`, {
    method: "POST",
    body: JSON.stringify({ content: transcribedText }),
  });
  setMessages((prev) => [...prev, data.message]); // AI's next question
  // feed data.message.content into your text-to-speech player here
}

// "End Interview" button:
async function endInterview() {
  const data = await apiFetch(`/api/interview/${interviewId}/end`, { method: "POST" });
  // data.interview.score / communication_score / confidence_score /
  // technical_score / feedback_summary — show a results screen, then
  // route back to /dashboard (its analytics will now reflect this interview)
  router.push("/dashboard");
}
```

Where things map on screen:
- **"Current Question"** panel → most recent AI message (`sender === "ai"`)
- **"Conversation"** panel → render the full `messages` array
- **"Press the microphone and start speaking..."** textarea → your speech-to-text
  output goes into `sendAnswer()` above before being sent
- **Interview Timer** stays purely client-side; on hitting `0:00`, call `endInterview()`
- **Notes panel** is local-only (not in this backend) — persist it yourself if
  needed later, e.g. `localStorage` or a new `/api/interview/<id>/notes` route

Voice/audio (mic listening indicator, TTS playback) is not part of this
backend — it's a browser Web Speech API / third-party TTS concern on the
frontend. This backend only handles the text conversation + AI logic.

---

## 5. Auth guard

Wrap `/dashboard`, `/interview`, and `/interview/room` in a check that
redirects to `/login` if there's no token:

```js
useEffect(() => {
  if (!localStorage.getItem("token")) router.push("/login");
}, []);
```

---

## Summary of files to touch in the frontend repo

| File | Change |
|---|---|
| `lib/api.js` (new) | fetch wrapper with JWT header |
| `.env.local` (new) | `NEXT_PUBLIC_API_URL` |
| `pages/login.js` | wire Sign In / Guest / Google / Sign up to `/api/auth/*` |
| `pages/dashboard.js` | fetch `/api/dashboard/analytics`, guest banner logic |
| `pages/interview.js` (setup) | fetch `/api/interview/options`, call `/api/interview/start` |
| `pages/interview/room.js` | call `/api/interview/{id}/message` and `/api/interview/{id}/end` |
| any auth-guarded page | redirect-if-no-token check |
