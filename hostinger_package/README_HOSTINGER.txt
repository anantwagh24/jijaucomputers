=======================================================
JIJAU COMPUTERS - HOSTINGER SHARED HOSTING DEPLOYMENT
=======================================================

This package contains the pre-compiled, standalone production build of Jijau Computers with 100% of all features, routes, pages, database, and assets.

-------------------------------------------------------
HOW TO DEPLOY ON HOSTINGER SHARED HOSTING (hPanel):
-------------------------------------------------------

STEP 1: UPLOAD THE FILES
1. Log in to Hostinger hPanel.
2. Go to Websites -> Manage -> File Manager.
3. Open `public_html` (or your domain root folder).
4. Upload `hostinger_deploy.zip` and EXTRACT all files directly inside `public_html`.

STEP 2: CONFIGURE NODE.JS IN hPanel
1. In hPanel, navigate to: Advanced -> Node.js (or Application Manager).
2. Set Node.js Version: 20.x (or 18.x).
3. Set Application Root: /home/u.../public_html
4. Set Application Startup File: server.js
5. Set Environment: Production
6. Click "Save" and click "Run NPM Install" (or click "Start App").

STEP 3: RUNNING VIA TERMINAL / SSH (IF APPLICABLE)
If you have SSH / Terminal access in hPanel:
Run:
    node server.js
Or with PM2 (if available):
    pm2 start server.js --name "jijaucomputers"

-------------------------------------------------------
DOMAIN & SSL:
-------------------------------------------------------
- Point your GoDaddy domain (jijaucomputers.in) to Hostinger's nameservers:
    ns1.dns-parking.com
    ns2.dns-parking.com
- In hPanel, go to Security -> SSL and click "Install Free SSL".
=======================================================
