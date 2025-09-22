
# Render Node Mini Apps (Starter)

This repo serves a catalog of mini games/apps from `/public` using Express.
Perfect for Render's **Web Service**.

## Deploy on Render (Web Service)
1. Push this folder to a **GitHub** repository (e.g., `render-node-mini-apps`).
2. On Render: **New → Web Service → Connect Git provider → pick your repo**.
3. Render detects Node. Use:
   - Build Command: *(leave empty; Render installs dependencies automatically)*
   - Start Command: `npm start`  (uses `PORT` env provided by Render)
4. After deploy, open the URL Render gives you.

**Your catalog lives in `/public`** – it already contains a starter structure.
Update the catalog by editing files in `/public` and pushing to Git.
