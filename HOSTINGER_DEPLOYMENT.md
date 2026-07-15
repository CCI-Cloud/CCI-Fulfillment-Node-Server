# Hostinger deployment

This application has two independent projects. Deploy them as two Hostinger web apps:

- `cci-fulfillment`: React frontend at `https://app.example.com`
- `cci-node-server`: Express API at `https://api.example.com`

Replace `example.com` with the real domain everywhere below. Using separate subdomains keeps the React build and the persistent Express process easy to deploy and troubleshoot.

## Prerequisites

- A Hostinger Business Web Hosting or Cloud plan with Node.js Web Apps support
- Two subdomains (recommended: `app` and `api`) with SSL enabled
- The two projects in separate GitHub repositories, or two ZIP archives that contain each project's files at the archive root
- The production NetSuite OAuth integration updated to allow `https://api.example.com/callback`

Never commit either real `.env` file or upload `node_modules`. Enter secrets in hPanel's Environment Variables screen.

## 1. Deploy the API

In hPanel, select **Websites → Add Website → Deploy Web App** and choose the API subdomain. Import the `cci-node-server` GitHub repository (recommended), or upload a ZIP.

Use these settings if Hostinger does not detect them:

| Setting | Value |
| --- | --- |
| Framework | Express.js |
| Node.js | 20.x or 22.x |
| Install command | `npm ci` |
| Build command | None |
| Start command | `npm start` |
| Entry file | `main.js` |

In **Environment Variables**, copy every variable from `.env.example`, replacing placeholders with production values. Important URL values are:

```dotenv
NODE_ENV=production
SERVER_HOST=0.0.0.0
CCI_APP_HOME=https://app.example.com
PROVIDER_DOMAIN=.example.com
REDIRECT_URI=https://api.example.com/callback
```

Do not manually set `PORT` in hPanel. Hostinger supplies it to the running process. `SERVER_PORT` is only a local fallback.

Deploy, then verify:

```text
https://api.example.com/healthz
```

It should return `{"status":"ok"}`. The repository's old `.htaccess` describes the previous two-port server layout; Hostinger's managed Node.js deployment creates its own proxy `.htaccess`, so do not copy the old file into `public_html` manually.

## 2. Deploy the React frontend

Add another Web App for the frontend subdomain and select the `cci-fulfillment` repository or ZIP.

| Setting | Value |
| --- | --- |
| Framework | React |
| Node.js | 20.x or 22.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `build` |

Add the four variables from the frontend `.env.example` to hPanel before building. At minimum, set:

```dotenv
REACT_APP_EXPRESS_SERVER_ROOT_URI=https://api.example.com
```

React embeds `REACT_APP_*` values during the build. After changing one, trigger a full redeploy; restarting is not enough.

## 3. Complete NetSuite and DNS configuration

In the NetSuite OAuth 2.0 integration record, make the callback URL exactly match:

```text
https://api.example.com/callback
```

Confirm both subdomains have valid HTTPS certificates before testing login. Then open the frontend, choose login, complete NetSuite authentication, and confirm the browser returns to:

```text
https://app.example.com/dashboard
```

## Troubleshooting

- **API shows 503:** Open the API deployment log. The most common cause is a missing required environment variable; startup reports its name as a config validation error.
- **`/healthz` works but login fails with state mismatch:** Confirm HTTPS is active and `PROVIDER_DOMAIN` is the shared parent domain with a leading dot, such as `.example.com`.
- **CORS error in the browser:** `CCI_APP_HOME` must exactly match the frontend origin, including `https://` and with no trailing slash.
- **React calls an old API URL:** Correct `REACT_APP_EXPRESS_SERVER_ROOT_URI` and rebuild/redeploy the frontend.
- **React route returns 404:** Redeploy the React app so Hostinger regenerates its routing configuration.
- **Uploads fail:** Recheck the IDrive endpoint, region, bucket, credentials, ACL, and public endpoint values in the API environment settings.
