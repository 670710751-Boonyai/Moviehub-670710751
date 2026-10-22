# Week 12 — ด่านที่ 6: React ↔ MovieHub Go (CORS)

This project already reads `REACT_APP_API_URL` in `src/api/backend.js` and already displays nested Go errors through `data.error?.message`. Stage 6 does **not** require rewriting that code. The regression test in `backend.test.js` verifies the Go error shape.

## 1. Start Go with a restricted origin allowlist

On the **Go Codespace** (`670710751-Boonyai/week6-lab-fork`), switch to branch `port/week12-jwt-tests`, pull, and restart Go with:

```bash
cd /workspaces/week6-lab-fork/moviehub
export DATABASE_URL='postgres://postgres:secret@127.0.0.1:5432/moviehub'
export JWT_SECRET="$(cat .jwt_secret)"
export ALLOWED_ORIGINS=http://localhost:3000
go run .
```

The value above is for the teacher's `localhost:3000` preflight demo. For a browser running at a GitHub Codespaces forwarded URL or Vercel, set `ALLOWED_ORIGINS` to **that actual page origin**, not `localhost:3000`. To allow more than one exact origin, separate them with commas.

## 2. Test CORS first (separate shell on the Go Codespace)

```bash
curl -s -i -X OPTIONS localhost:8080/api/reviews/999 \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: DELETE' \
  -H 'Access-Control-Request-Headers: authorization'

curl -s -i -X OPTIONS localhost:8080/api/reviews/999 \
  -H 'Origin: http://localhost:3001' \
  -H 'Access-Control-Request-Method: DELETE' \
  -H 'Access-Control-Request-Headers: authorization'
```

Both must return HTTP 204. Only the first may include `Access-Control-Allow-Origin: http://localhost:3000`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Max-Age: 600` and `Vary: Origin`.

## 3. Configure React

In the React project's root, create **`.env.local`** (it is ignored by git):

```dotenv
REACT_APP_API_URL=http://localhost:8080
```

The example above works only when the **browser can actually reach Go at localhost:8080**. A browser accessing a remote GitHub Codespace often cannot use that address; open Codespaces' **Ports** tab and copy the externally reachable forwarded port 8080 URL instead. If your frontend is also on Codespaces/Vercel, allow its exact origin on Go and make sure the API's forwarded/deployed URL is reachable by the browser (private forwarded ports can redirect requests to sign-in).

Restart React with `npm start` after editing the env file. The current CRA proxy can hide CORS if you leave `REACT_APP_API_URL` blank; for this exercise explicitly set the Go API origin.

## 4. Check the web page

Open the React app in your browser, log in as your own test account, then try authenticated requests. On successful login, the React app already keeps the JWT under `localStorage['moviehub.token']`.

In DevTools Console (on the React page), replace `GO_API_URL` with the actual reachable Go API origin:

```js
const token = localStorage.getItem('moviehub.token');
fetch('GO_API_URL/api/me', { headers: { Authorization: 'Bearer ' + token } })
  .then(r => r.json()).then(console.log).catch(console.error);
```

On a cross-origin request, check the Go server logs for `OPTIONS /api/me 204` followed by `GET /api/me 200`. Login with a deliberately incorrect password: the page should show `อีเมลหรือรหัสผ่านไม่ถูกต้อง` instead of `[object Object]`.

Do not publish real JWT values or paste `JWT_SECRET` into a public site. The optional voting routes are outside the required Stage 6 CORS work and may still return 404.
