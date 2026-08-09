# The Real Room — Backend

Flask + MySQL backend for The Real Room. Powers login/register/guest auth,
interview setup, the live AI-interviewer conversation (via the Gemini API),
and dashboard analytics.

## 1. Setup

```bash
cd realroom-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env with real values
```

You need a running MySQL server. Either let the app create tables automatically
(it calls `db.create_all()` on startup), or run `schema.sql` yourself:

```bash
mysql -u root -p < schema.sql
```

Fill in `.env`:
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` (or a single `DATABASE_URL`)
- `GEMINI_API_KEY` — required for the AI interviewer to respond
- `CORS_ORIGINS` — your frontend origin, e.g. `http://localhost:3000`

## 2. Run

```bash
python app.py
```

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. API Reference

### Auth (`/api/auth`)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/register` | `{name, email, password}` | Returns `{token, user}` |
| POST | `/login` | `{email, password}` | Returns `{token, user}` |
| POST | `/guest` | — | "Continue as Guest" button |
| POST | `/google` | `{email, name}` | Stub — swap in real Google token verification |
| GET | `/me` | — (JWT required) | Returns current user |

### Interview (`/api/interview`) — all except `/options` require JWT
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/options` | — | Valid companies / types / moods for the setup page |
| POST | `/start` | `{company, type, mood}` | Creates interview, returns opening AI question |
| POST | `/<id>/message` | `{content}` | Send candidate's answer, get next AI question |
| POST | `/<id>/end` | — | Ends interview, triggers AI scoring |
| GET | `/<id>` | — | Full interview + transcript |
| GET | `/history` | — | List of past interviews for dashboard |

### Dashboard (`/api/dashboard`) — requires JWT
| Method | Path | Notes |
|---|---|---|
| GET | `/analytics` | Interviews completed, average score, streak, DSA solved, insight flags |

## 4. Company / Type / Mood values

- **company**: `Google, Microsoft, Amazon, NVIDIA, Apple, Meta, Atlassian, Uber`
- **type**: `HR, Technical, DSA`
- **mood**: `Friendly, Professional, Strict, Aggressive`

These drive the AI interviewer's system prompt in `services/ai_interviewer.py` —
edit `COMPANY_PROFILES`, `TYPE_FOCUS`, `MOOD_STYLE` to tune behavior.

## 5. Auth model

JWT bearer tokens (`Authorization: Bearer <token>`), 7-day expiry. Guest users
get a real (temporary) DB row and a normal JWT — "Guest Mode" just means the
frontend doesn't treat them as a persistent account, matching your "Guest Mode
— your progress won't be saved" banner (you can also choose not to persist
guest interviews client-side, or delete guest users on a cron job).

See `FRONTEND_INTEGRATION.md` for exactly what to change in your Next.js app.
