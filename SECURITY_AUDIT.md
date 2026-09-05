# Jijau Computers Security Audit

**Target Application:** Jijau Computers (Full-Stack E-Commerce & Computer Services Platform)  
**Repository:** `https://github.com/anantwagh24/jijaucomputers`  
**Target Domain:** `jijaucomputers.in`  
**Audit Type:** Independent Adversarial Application Security Review, Threat Model & Next.js/Prisma Security Architecture Audit  
**Date:** September 5, 2026  
**Auditor Classification:** Senior Application Security Engineer & Penetration Tester  

---

## Executive Summary

An exhaustive, adversarial source-code security audit of the **Jijau Computers** repository was conducted. The application is built using Next.js 16 (App Router), React 19, Prisma ORM 5.22, and Tailwind CSS, deployed to Vercel and accompanied by a standalone Hostinger PHP package.

The audit revealed **critical architectural vulnerabilities** across authentication, authorization, access control, customer privacy, business logic, file uploads, and credential management. In its current state, the application **CANNOT BE DEPLOYED TO PRODUCTION** on `jijaucomputers.in`.

### Key Systemic Vulnerabilities Discovered:
1. **Complete Authentication Bypass & Forgery:** Admin authentication relies entirely on an unsigned, plaintext, non-HttpOnly client cookie (`jijau_admin_auth=true`) checked in middleware. An attacker can set this cookie in any browser or HTTP client to gain immediate access to all administrative capabilities.
2. **Instant Account Takeover (Fake Google OAuth):** The Google Sign-In endpoint (`/api/auth/google`) accepts arbitrary JSON payloads (`{"email": "victim@example.com"}`) with zero OAuth/OIDC token or cryptographic signature verification. Supplying any customer or administrator email returns their full profile and logs the attacker in as that user.
3. **Public Exposure of Entire Customer Database & Order History:** `/api/orders`, `/api/auth/me`, `/api/service-requests`, `/api/custom-pc`, `/api/quotations`, and `/api/enquiries` have zero authentication or ownership checks. Furthermore, `/api/track` performs unrestricted substring matching (`contains`), allowing anonymous attackers to dump all customer PII, phone numbers, addresses, and order histories by querying single letters.
4. **Client-Side Price & Total Tampering:** The checkout endpoint (`/api/orders`) directly persists client-supplied `subtotal`, `total`, and item `price` without recalculating them from the database. A customer can purchase a ₹1,50,000 gaming desktop for ₹1.
5. **Backdoors & Plaintext Admin Password Storage:** The admin password change endpoint (`/api/admin/change-password`) stores updated passwords in plaintext without bcrypt hashing. Furthermore, hardcoded fallback checks (`"adminpassword123"`) allow resetting or changing passwords even after an administrator modifies their credentials.
6. **Unauthenticated Public Write on Sensitive Routes:** Every mutation endpoint outside `/api/admin/*` (`/api/products`, `/api/products/[id]`, `/api/settings`, `/api/banners`, `/api/offers`, `/api/categories`, `/api/brands`) is unauthenticated because Next.js middleware is configured only for `/admin/:path*` and `/api/admin/:path*`. An anonymous attacker can modify store bank/UPI details, change product pricing, or delete the entire product catalog.
7. **Stored XSS via File Upload:** The `/api/upload` endpoint accepts `.svg` files with MIME type `image/svg+xml` without authentication or sanitization, enabling stored Cross-Site Scripting (XSS).
8. **Live SQLite Database Committed in Git:** `prisma/dev.db` and `php-jijaucomputers/database/jijau.db` containing real customer records, contact information, and plaintext admin credentials are tracked and committed directly into the Git repository history.

---

## Overall Risk Rating

| Metric | Rating |
| :--- | :--- |
| **Overall Risk Score** | **CRITICAL (9.8 / 10.0)** |
| **Authentication Architecture** | **CRITICAL** |
| **Authorization & Access Control (BOLA/IDOR)** | **CRITICAL** |
| **Data Protection & PII Privacy** | **CRITICAL** |
| **Business Logic Integrity** | **HIGH** |
| **Infrastructure & Serverless Compatibility** | **HIGH** |
| **Production Readiness** | **NOT SAFE TO DEPLOY** |

---

## Application Architecture & Trust Boundaries

```
[ Unauthenticated Internet Attacker / Customer Browser ]
                         │
         ┌───────────────┴───────────────┐
         │ Public Network / HTTPS Target │
         └───────────────┬───────────────┘
                         ▼
             [ Next.js Middleware ]
             (Only checks `jijau_admin_auth=true` for `/admin/*` & `/api/admin/*`)
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
[ /api/admin/* ]   [ /api/auth/* ]   [ /api/* (Public & Sensitive) ]
 (Bypassed by       (Fake Google      (Bypasses Middleware completely!
  Cookie Forgery)    OAuth Takeover)   /api/products, /api/settings,
                                       /api/orders, /api/banners, etc.)
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
             [ Route Handlers / APIs ]
             - Missing ownership checks
             - Missing price recalculations
             - No schema validation (Zod)
                         │
                         ▼
             [ Prisma Client / ORM ]
                         │
                         ▼
          [ SQLite Database: dev.db ]
          (Committed to Git; Non-persistent on Vercel)
```

---

## Threat Model & Attacker Scenarios

1. **Anonymous Remote Attacker:**
   - Forges `jijau_admin_auth=true` cookie to access `/admin` dashboard.
   - Sends `POST /api/settings` to hijack the store's UPI ID (`upiId`) and bank account details, diverting customer payments.
   - Queries `GET /api/track?query=a` and `GET /api/orders` to exfiltrate customer names, phone numbers, email addresses, and home delivery addresses.
   - Sends `DELETE /api/products/[id]` to wipe out the product catalog.

2. **Malicious Customer:**
   - Intercepts checkout payload (`POST /api/orders`) and overrides `total: 1` and `item.price: 1`.
   - Sends `POST /api/auth/google` with `{"email": "admin@jijaucomputers.in"}` or any victim's email to instantly log in as that person.
   - Enters another customer's ID into `/api/auth/me?userId=<id>` to view their full order and address history.

3. **Disgruntled Insider / Repository Viewer:**
   - Clones Git repository and extracts `prisma/dev.db` containing customer phone numbers, names, and plaintext admin credentials.

---

## Detailed Vulnerabilities

---

### [CRITICAL] 1. Authentication Bypass via Forged Client-Controlled Admin Cookie

**Status:** Verified  
**CWE:** CWE-287 (Improper Authentication), CWE-565 (Reliance on Cookies without Validation)  
**OWASP Category:** A07:2021 – Identification and Authentication Failures  
**Affected File:** [`src/middleware.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/middleware.ts#L6-L16), [`src/app/api/admin/login/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/admin/login/route.ts#L95-L101)  
**Affected Function/Route:** `middleware()`, `POST /api/admin/login`

#### Evidence:
```typescript
// src/middleware.ts:6-8
const authCookie = request.cookies.get("jijau_admin_auth");
const isAuthenticated = authCookie && authCookie.value === "true";

if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```
And in `src/app/api/admin/login/route.ts`:
```typescript
response.cookies.set("jijau_admin_auth", "true", {
  path: "/",
  httpOnly: false, // Accessible to client JavaScript!
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === "production",
});
```

#### Why it is exploitable:
The application does not issue a signed cryptographic session token (such as an encrypted JWT or a server-stored session ID). It checks if the cookie named `jijau_admin_auth` equals the static string `"true"`. Furthermore, the cookie is set with `httpOnly: false`.

#### Exploitation Path:
An attacker executes `document.cookie = "jijau_admin_auth=true; path=/"` in their browser console or passes `-H "Cookie: jijau_admin_auth=true"` in `curl`. The middleware accepts the request as fully authenticated, granting complete access to `/admin` pages and `/api/admin/*` routes.

#### Impact:
Complete administrative takeover.

#### Recommended Fix:
1. Implement cryptographically signed, secure server-side session management (e.g. Iron Session, NextAuth, or an `AdminSession` table in Prisma with cryptographically secure random session tokens).
2. Set session cookies with `httpOnly: true`, `secure: true`, `sameSite: "lax"`, and use the `__Host-` prefix in production.

---

### [CRITICAL] 2. Full Account Takeover via Unverified Google Authentication

**Status:** Verified  
**CWE:** CWE-287 (Improper Authentication), CWE-306 (Missing Authentication for Critical Function)  
**OWASP Category:** A07:2021 – Identification and Authentication Failures  
**Affected File:** [`src/app/api/auth/google/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/auth/google/route.ts#L7-L35)  
**Affected Function/Route:** `POST /api/auth/google`

#### Evidence:
```typescript
// src/app/api/auth/google/route.ts:7-20
const { name, email, avatarUrl } = await req.json();

if (!email) {
  return NextResponse.json({ error: "Email is required for Google Sign In." }, { status: 400 });
}

const cleanEmail = email.trim().toLowerCase();

let user = await prisma.user.findUnique({
  where: { email: cleanEmail },
});
```

#### Why it is exploitable:
The endpoint trusts the raw `email` passed in the JSON body from the client without requiring a Google OAuth Authorization Code exchange or validating a Google ID Token (JWT) signature against Google's public keys (`https://www.googleapis.com/oauth2/v3/certs`).

#### Exploitation Path:
An attacker sends:
```bash
curl -X POST https://jijaucomputers.in/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"email":"target_customer@gmail.com"}'
```
The server immediately responds with the victim's account details (`id`, `name`, `phone`, `address`), allowing the attacker to impersonate them, view orders, and make purchases.

#### Impact:
100% Account Takeover of any registered customer or admin email.

#### Recommended Fix:
Integrate genuine Google OAuth 2.0 / OpenID Connect with `@react-oauth/google` or NextAuth / standard authorization code exchange, verifying ID token signatures with `google-auth-library`.

---

### [CRITICAL] 3. Unauthenticated Global PII Data Exfiltration & IDOR

**Status:** Verified  
**CWE:** CWE-200 (Exposure of Sensitive Information), CWE-639 (Authorization Bypass Through User-Controlled Key)  
**OWASP Category:** A01:2021 – Broken Access Control  
**Affected Files:**
- [`src/app/api/auth/me/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/auth/me/route.ts#L7-L49)
- [`src/app/api/orders/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/orders/route.ts#L6-L19)
- [`src/app/api/track/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/track/route.ts#L34-L89)
- [`src/app/api/invoices/[id]/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/invoices/%5Bid%5D/route.ts#L5-L75)

#### Evidence:
1. `GET /api/orders`:
   ```typescript
   export async function GET() {
     const orders = await prisma.order.findMany({
       orderBy: { createdAt: "desc" },
       include: { items: true },
     });
     return NextResponse.json(orders);
   }
   ```
2. `GET /api/auth/me`:
   ```typescript
   const userId = searchParams.get("userId");
   const email = searchParams.get("email");
   const phone = searchParams.get("phone");
   const user = await prisma.user.findFirst({
     where: { OR: [ ...(userId ? [{ id: userId }] : []), ... ] },
     include: { orders: { include: { items: true } } }
   });
   ```
3. `GET /api/track`:
   ```typescript
   prisma.order.findMany({
     where: {
       OR: [
         { customerName: { contains: query } },
         { phone: { contains: cleanPhone } },
         { email: { contains: cleanEmail } }
       ]
     }
   });
   ```

#### Why it is exploitable:
None of these endpoints require authentication or check whether the requester owns the requested data. `GET /api/orders` dumps the entire database table. `GET /api/track?query=a` performs a substring search across all customer orders, services, quotes, and custom PC builds.

#### Impact:
Mass harvesting of customer PII (full names, phone numbers, home/work addresses, email addresses, order items, serial numbers, expenditure).

#### Recommended Fix:
- Require server-verified user sessions.
- In `GET /api/orders`, only return orders where `userId === session.userId` (unless caller is an authenticated admin).
- Remove `/api/auth/me` query parameter lookups; resolve `userId` exclusively from the authenticated server session.
- Restrict tracking lookups to exact matching of tracking IDs + phone verification.

---

### [CRITICAL] 4. Client-Controlled Price, Discount, and Order Total Tampering

**Status:** Verified  
**CWE:** CWE-472 (Improper Processing of Client-Provided Pricing), CWE-20 (Improper Input Validation)  
**OWASP Category:** A04:2021 – Insecure Design  
**Affected File:** [`src/app/api/orders/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/orders/route.ts#L78-L107)  
**Affected Function/Route:** `POST /api/orders`

#### Evidence:
```typescript
const order = await prisma.order.create({
  data: {
    orderNumber,
    userId: effectiveUserId,
    customerName: data.customerName,
    phone: data.phone,
    subtotal: parseFloat(data.subtotal), // Trusted from client!
    discount: data.discount ? parseFloat(data.discount) : 0, // Trusted from client!
    tax: data.tax ? parseFloat(data.tax) : 0,
    total: parseFloat(data.total), // Trusted from client!
    paymentMode: data.paymentMode || "CASH_ON_DELIVERY",
    status: "PENDING",
    items: {
      create: data.items.map((item: any) => ({
        productId: item.productId || item.product?.id,
        name: item.name || item.product?.name,
        price: parseFloat(item.price), // Trusted from client!
        quantity: parseInt(item.quantity) || 1,
      })),
    },
  },
});
```

#### Why it is exploitable:
The server never queries the `Product` table in Prisma to verify the actual unit price of each item or compute the true subtotal and total.

#### Exploitation Path:
An attacker adds a ₹1,20,000 RTX 4090 GPU to the cart and sends `POST /api/orders` with:
```json
{
  "customerName": "Attacker",
  "phone": "9876543210",
  "subtotal": 1,
  "discount": 0,
  "total": 1,
  "paymentMode": "CASH_ON_DELIVERY",
  "items": [{ "productId": "gpu-id", "name": "RTX 4090", "price": 1, "quantity": 1 }]
}
```
The order is successfully placed and marked pending fulfillment for ₹1.

#### Impact:
Financial loss and fraudulent order placement.

#### Recommended Fix:
Lookup every product from the database via `prisma.product.findMany({ where: { id: { in: itemIds } } })`. Compute unit prices, subtotals, tax, valid coupon discounts, and grand totals strictly on the server.

---

### [CRITICAL] 5. Unauthenticated Website Hijacking & Payment Redirection (Settings Tampering)

**Status:** Verified  
**CWE:** CWE-306 (Missing Authentication for Critical Function), CWE-284 (Improper Access Control)  
**OWASP Category:** A01:2021 – Broken Access Control  
**Affected File:** [`src/app/api/settings/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/settings/route.ts#L23-L69)  
**Affected Function/Route:** `POST /api/settings`

#### Evidence:
```typescript
// src/app/api/settings/route.ts:23-64
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const updated = await prisma.websiteSetting.upsert({
      where: { id: "default" },
      update: {
        storeName: data.storeName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        upiId: data.upiId, // Allows hijacking store UPI!
        invoiceBankDetails: data.invoiceBankDetails, // Allows hijacking bank details!
        // ...
      },
      create: { id: "default", ...data }
    });
    return NextResponse.json(updated);
  }
}
```

#### Why it is exploitable:
`/api/settings` is outside the `/api/admin` namespace. The Next.js middleware configuration (`matcher: ["/admin/:path*", "/api/admin/:path*"]`) does NOT execute on `/api/settings`. The endpoint contains no server-side authentication check.

#### Exploitation Path:
An attacker sends:
```bash
curl -X POST https://jijaucomputers.in/api/settings \
  -H "Content-Type: application/json" \
  -d '{"upiId":"attacker@oksbi","upiName":"Attacker Name","invoiceBankDetails":"A/C: 9999999999 IFSC: ATTK0001"}'
```
All subsequent customer UPI QR codes and printed GST invoices will display the attacker's payment details.

#### Impact:
Direct theft of customer payments and total website defacement.

#### Recommended Fix:
Move settings management under `/api/admin/settings` or add rigorous session verification inside `POST /api/settings`.

---

### [CRITICAL] 6. Missing Authentication on Core Catalog Mutations

**Status:** Verified  
**CWE:** CWE-284 (Improper Access Control)  
**OWASP Category:** A01:2021 – Broken Access Control  
**Affected Files:**
- [`src/app/api/products/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/products/route.ts#L95-L156) (`POST`)
- [`src/app/api/products/[id]/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/products/%5Bid%5D/route.ts#L35-L119) (`PUT`, `DELETE`)
- [`src/app/api/banners/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/banners/route.ts#L16-L76) (`POST`, `PUT`, `DELETE`)
- [`src/app/api/offers/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/offers/route.ts#L16-L77) (`POST`, `PUT`, `DELETE`)
- [`src/app/api/categories/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/categories/route.ts#L22-L90) (`POST`, `PUT`, `DELETE`)
- [`src/app/api/brands/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/brands/route.ts#L22-L84) (`POST`, `PUT`, `DELETE`)
- [`src/app/api/service-requests/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/service-requests/route.ts#L97-L116) (`PUT`)
- [`src/app/api/orders/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/orders/route.ts#L116-L133) (`PUT`)

#### Evidence:
None of these endpoints reside in `/api/admin/*`, and none verify user authentication before performing database writes or deletes.

#### Impact:
Any anonymous user on the internet can create, update, or permanently delete products, orders, banners, offers, and categories.

#### Recommended Fix:
Enforce admin session verification on all mutating HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`).

---

### [CRITICAL] 7. Plaintext Admin Password Storage & Reset Backdoors

**Status:** Verified  
**CWE:** CWE-256 (Unprotected Storage of Credentials), CWE-798 (Use of Hard-coded Credentials)  
**OWASP Category:** A02:2021 – Cryptographic Failures  
**Affected Files:**
- [`src/app/api/admin/change-password/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/admin/change-password/route.ts#L41-L75)
- [`src/app/api/admin/login/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/admin/login/route.ts#L28-L81)
- [`php-jijaucomputers/admin/login.php`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/php-jijaucomputers/admin/login.php#L17-L20)

#### Evidence:
1. In `src/app/api/admin/change-password/route.ts`:
   ```typescript
   // Line 41-45: Backdoor allows "adminpassword123" regardless of real password
   const isCurrentValid =
     admin.password === currentPassword ||
     verifyPassword(currentPassword, admin.password) ||
     currentPassword === "adminpassword123";

   // Line 71-74: Saves plaintext password directly!
   await prisma.adminUser.update({
     where: { id: admin.id },
     data: { password: newPassword }, // NOT HASHED WITH BCRYPT!
   });
   ```
2. In `src/app/api/admin/login/route.ts`:
   ```typescript
   const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminpassword123";
   const isMasterReset =
     (username.trim().toLowerCase() === "admin" || username.trim().toLowerCase() === "admin@jijaucomputers.in") &&
     password === defaultAdminPassword;

   if (isMasterReset && admin.password !== defaultAdminPassword) {
     await prisma.adminUser.update({
       where: { id: admin.id },
       data: { password: defaultAdminPassword }, // Overrides admin's password!
     });
   }
   ```

#### Why it is exploitable:
- New admin passwords are saved as plaintext strings in the database.
- Even after an admin changes their password, logging in with `"admin"` and `"adminpassword123"` resets the password in the database back to `"adminpassword123"`.
- In `change-password`, supplying `currentPassword: "adminpassword123"` succeeds regardless of what the admin's actual password is.

#### Impact:
Permanent administrator account takeover and exposure of plaintext passwords.

#### Recommended Fix:
- Always hash passwords with `bcryptjs` using 12 salt rounds before persisting.
- Remove all fallback master password logic and hardcoded reset conditions.

---

### [HIGH] 8. Stored XSS via Arbitrary SVG File Upload

**Status:** Verified  
**CWE:** CWE-434 (Unrestricted Upload of File with Dangerous Type), CWE-79 (Cross-site Scripting)  
**OWASP Category:** A03:2021 – Injection  
**Affected File:** [`src/app/api/upload/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/upload/route.ts#L7-L22)  
**Affected Function/Route:** `POST /api/upload`

#### Evidence:
```typescript
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml", // DANGEROUS!
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg", // DANGEROUS!
]);
```

#### Why it is exploitable:
SVG files are XML documents that can contain active JavaScript payloads (e.g. `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(document.cookie)</script></svg>`). Because uploaded files are served from the same domain under `/uploads/products/...`, opening the SVG executes script in the origin's context. Furthermore, `/api/upload` is unauthenticated and performs no file signature / magic-byte inspection.

#### Impact:
Stored Cross-Site Scripting (XSS), session hijacking, and CSRF execution.

#### Recommended Fix:
1. Disallow `.svg` and `image/svg+xml` from user-uploaded product images.
2. Restrict upload formats to standard raster images (`image/jpeg`, `image/png`, `image/webp`).
3. Validate magic bytes / file signatures before accepting files.
4. Require admin authentication for `/api/upload`.

---

### [HIGH] 9. Live Database Committed in Git Repository

**Status:** Verified  
**CWE:** CWE-312 (Cleartext Storage of Sensitive Information), CWE-200 (Exposure of Sensitive Information)  
**OWASP Category:** A02:2021 – Cryptographic Failures  
**Affected Files:** `prisma/dev.db`, `php-jijaucomputers/database/jijau.db`

#### Evidence:
Executing `git ls-files` reveals that `prisma/dev.db` and `php-jijaucomputers/database/jijau.db` are actively tracked in Git.
Inspecting the database reveals active customer records (`Anant Wagh`, `Gamer Pro`, phone numbers, email addresses) and plaintext admin credentials.

#### Why it is exploitable:
Anyone with repository access (or if the repository is public) can inspect past commits, extract the SQLite database file, and obtain customer PII and admin credentials.

#### Recommended Fix:
1. Add `*.db`, `*.sqlite`, `*.sqlite3`, and `dev.db` to `.gitignore`.
2. Remove database files from Git tracking: `git rm --cached prisma/dev.db php-jijaucomputers/database/jijau.db`.
3. Rotate all administrator and customer credentials.

---

### [HIGH] 10. Serverless Incompatibility & Ephemeral File Loss on Vercel

**Status:** Verified  
**CWE:** CWE-668 (Exposure of Resource to Wrong Sphere)  
**OWASP Category:** A05:2021 – Security Misconfiguration / Insecure Architecture  
**Affected Files:**
- [`src/app/api/upload/route.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/app/api/upload/route.ts#L56-L98)
- [`prisma/schema.prisma`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/prisma/schema.prisma#L1-L4)
- [`src/lib/rateLimit.ts`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/src/lib/rateLimit.ts#L11)

#### Evidence:
- `src/app/api/upload/route.ts` writes files to `process.cwd() + "/public/uploads/products"`. On Vercel, the filesystem is read-only or ephemeral lambda scratch space. Any uploaded file is erased upon container recycling.
- `prisma/schema.prisma` uses SQLite (`url = "file:./dev.db"`). On Vercel serverless, SQLite database state is lost and out-of-sync across lambdas.
- `src/lib/rateLimit.ts` uses an in-memory `Map`. Each serverless lambda instance has its own memory space, rendering rate limiting ineffective against distributed attacks.

#### Impact:
Data corruption, lost uploads, broken product images, and ineffective rate limiting in production.

#### Recommended Fix:
- Use external object storage (AWS S3, Cloudflare R2, or Supabase Storage) for image uploads.
- Migrate from SQLite to a managed PostgreSQL database (e.g. Supabase, Neon, or Railway).
- Use Upstash Redis or Vercel KV for distributed rate limiting.

---

### [MEDIUM] 11. Overly Broad Remote Image Patterns & Missing Content Security Policy

**Status:** Verified  
**CWE:** CWE-918 (Server-Side Request Forgery), CWE-1021 (Improper Restriction of Rendered UI Layers)  
**OWASP Category:** A05:2021 – Security Misconfiguration  
**Affected File:** [`next.config.mjs`](file:///Users/anantwagh/Antigravity%20Projects/jijaucomputers/next.config.mjs#L41-L46)

#### Evidence:
```javascript
// next.config.mjs:41-46
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**", // Allows SSRF via next/image proxy
    },
  ],
}
```
`next.config.mjs` also lacks a `Content-Security-Policy` (CSP) header.

#### Impact:
1. `hostname: "**"` allows attackers to abuse the Next.js image optimization endpoint (`/_next/image?url=...`) to proxy external images, flood bandwidth, or probe internal networks.
2. Lack of CSP increases the impact of any XSS vulnerability.

#### Recommended Fix:
Restrict `remotePatterns` strictly to trusted domains (`images.unsplash.com`, `api.dicebear.com`, Cloudflare R2/S3). Add a robust CSP header.

---

## Previously Suspected Findings — Verification Matrix

| # | Suspected Finding | Status | Technical Evidence & Verification Note |
| :-: | :--- | :---: | :--- |
| **1** | Admin authentication relies on client-controlled cookie (`jijau_admin_auth=true`) | **VERIFIED** | `src/middleware.ts` lines 6-8 checks static string `"true"`. |
| **2** | Admin login sets `httpOnly: false` | **VERIFIED** | `src/app/api/admin/login/route.ts` line 97 explicitly sets `httpOnly: false`. |
| **3** | Admin login has hardcoded fallback password (`adminpassword123`) | **VERIFIED** | `src/app/api/admin/login/route.ts` line 28 & `php-jijaucomputers/admin/login.php` line 17. |
| **4** | Admin seed/default data contains known default password | **VERIFIED** | `.env` line 3, `prisma/dev.db`, and `change-password/route.ts` line 33. |
| **5** | Admin password change stores plaintext instead of bcrypt hash | **VERIFIED** | `src/app/api/admin/change-password/route.ts` line 73 saves `data: { password: newPassword }` unhashed. |
| **6** | Google auth accepts browser-supplied email without OAuth validation | **VERIFIED** | `src/app/api/auth/google/route.ts` line 7 directly logs in whatever email is posted. |
| **7** | Customer authentication stores state in localStorage | **VERIFIED** | `src/context/AuthContext.tsx` line 60 & 92 loads/persists user object in `localStorage`. |
| **8** | `/api/auth/me` accepts `?userId=<ID>` without proving ownership | **VERIFIED** | `src/app/api/auth/me/route.ts` lines 7-29 fetches any user and their orders by query param. |
| **9** | `/api/orders` allows unauthenticated GET access to all orders | **VERIFIED** | `src/app/api/orders/route.ts` lines 6-14 returns all orders to anyone. |
| **10** | `/api/orders` PUT operations lack authorization | **VERIFIED** | `src/app/api/orders/route.ts` lines 116-133 updates order status without auth. |
| **11** | `/api/settings` allows unauthenticated modification | **VERIFIED** | `src/app/api/settings/route.ts` lines 23-68 upserts settings without auth. |
| **12** | `/api/products` POST lacks admin authorization | **VERIFIED** | `src/app/api/products/route.ts` lines 95-156 creates products without auth. |
| **13** | `/api/products/[id]` PUT/DELETE lack authorization | **VERIFIED** | `src/app/api/products/[id]/route.ts` lines 35-119 updates/deletes without auth. |
| **14** | `/api/invoices/[id]` exposes private invoice data without auth | **VERIFIED** | `src/app/api/invoices/[id]/route.ts` lines 5-75 returns full customer order/service data. |
| **15** | `/api/track` allows customer/order enumeration via substring search | **VERIFIED** | `src/app/api/track/route.ts` lines 34-89 performs `contains` search on all orders/services. |
| **16** | `/api/upload` allows unauthenticated uploads | **VERIFIED** | `src/app/api/upload/route.ts` lines 26-110 processes uploads without checking identity. |
| **17** | `/api/upload` allows SVG files | **VERIFIED** | `src/app/api/upload/route.ts` lines 12 & 21 explicitly includes `image/svg+xml` and `.svg`. |
| **18** | Upload validation relies on extension/MIME rather than content | **VERIFIED** | `src/app/api/upload/route.ts` lines 71-85 performs no magic-byte signature check. |
| **19** | Rate limiting uses in-memory Map (fails on serverless/Vercel) | **VERIFIED** | `src/lib/rateLimit.ts` line 11 uses local process `new Map()`. |
| **20** | Security headers lack CSP | **VERIFIED** | `next.config.mjs` lines 2-31 has no `Content-Security-Policy`. |
| **21** | `next/image` remotePatterns contains overly broad `"**"` | **VERIFIED** | `next.config.mjs` line 44 configures `hostname: "**"`. |
| **22** | `next.config` contains `typescript.ignoreBuildErrors = true` | **VERIFIED** | `next.config.mjs` line 38 explicitly ignores TypeScript errors during build. |
| **23** | Production database files exist inside Git | **VERIFIED** | `prisma/dev.db` and `php-jijaucomputers/database/jijau.db` are tracked in Git. |
| **24** | Sensitive data exposed through API responses | **VERIFIED** | PII and full order histories are leaked across multiple public endpoints. |
| **25** | State-changing cookie-authenticated endpoints lack CSRF protection | **VERIFIED** | Zero CSRF token validation or custom header verification on mutating routes. |
| **26** | Sensitive API routes do not use explicit server-side input validation | **VERIFIED** | No Zod or schema validation; direct `req.json()` casting across all routes. |
| **27** | Prisma mutations vulnerable to mass assignment / price tampering | **VERIFIED** | `POST /api/orders` trusts client `subtotal`, `total`, and `item.price`. |
| **28** | Local filesystem uploads not persistent on Vercel | **VERIFIED** | Serverless functions cannot persist files to `public/uploads/` long-term. |

---

## Top 10 Vulnerabilities Ranked by Actual Risk

| Rank | Vulnerability | Severity | Impact |
| :---: | :--- | :---: | :--- |
| **1** | **Full Account Takeover via Unverified Google Auth** | **CRITICAL** | Any attacker can log in as any customer or admin by supplying their email in `/api/auth/google`. |
| **2** | **Admin Authentication Bypass via Forged Cookie** | **CRITICAL** | Anyone can set `jijau_admin_auth=true` to gain total admin panel access. |
| **3** | **Unauthenticated Global PII Data Exfiltration** | **CRITICAL** | `/api/orders`, `/api/auth/me`, and `/api/track` allow complete exfiltration of all customer data. |
| **4** | **Unauthenticated Website Hijacking & UPI Payment Theft** | **CRITICAL** | `/api/settings` allows changing store UPI ID and bank accounts to attacker-controlled accounts. |
| **5** | **Client-Controlled Price & Total Tampering** | **CRITICAL** | Customers can manipulate product prices and checkout totals to ₹1. |
| **6** | **Unauthenticated Catalog & Order Modifications** | **CRITICAL** | Products, banners, offers, and categories can be edited or deleted by anyone on the internet. |
| **7** | **Plaintext Admin Password Storage & Reset Backdoors** | **CRITICAL** | Admin passwords stored unhashed; master reset logic allows overriding changed passwords. |
| **8** | **Stored XSS via SVG File Upload** | **HIGH** | Unauthenticated `.svg` upload allows persistent script execution in victim browsers. |
| **9** | **Live Database Committed in Git Repository** | **HIGH** | `prisma/dev.db` leaks customer records and admin credentials in Git history. |
| **10** | **Serverless Filesystem Incompatibility & Data Loss** | **HIGH** | SQLite and local disk uploads fail on Vercel, leading to broken images and state loss. |

---

## Prioritized Remediation Plan

### Phase 0 — Emergency (Immediate Production Blockers)
1. **Remove Database from Git:** Untrack `prisma/dev.db` and `php-jijaucomputers/database/jijau.db`, add to `.gitignore`, and rotate all admin passwords.
2. **Close the Settings Hijack:** Require strict admin session validation for `POST /api/settings`.
3. **Disable Fake Google Auth Takeover:** Require genuine ID token verification or temporarily disable the unverified endpoint.
4. **Fix Admin Password Hashing & Remove Backdoors:** Hash admin passwords with bcrypt; remove all `"adminpassword123"` fallback comparisons.

### Phase 1 — Critical Security (Authentication & Authorization)
1. **Implement Secure Cryptographic Sessions:**
   - Create an `AdminSession` / `CustomerSession` mechanism or use signed HTTP-only cookies with cryptographic tokens.
   - Enforce server-side session checks in Next.js route handlers.
2. **Secure `/api/orders` & Server-Side Price Calculation:**
   - Fetch actual product prices from database in `POST /api/orders`.
   - Protect `GET /api/orders` and `PUT /api/orders` so only authorized admins or order owners can access them.
3. **Secure `/api/auth/me` and `/api/track`:**
   - Resolve `userId` only from authenticated session.
   - Restrict tracking lookups to exact tracking numbers with phone verification.

### Phase 2 — High Security (Uploads, Validation & Headers)
1. **Secure File Uploads:**
   - Disallow `.svg` files.
   - Require admin authentication for upload endpoints.
   - Integrate Cloudflare R2 / AWS S3 or Supabase Storage for persistent cloud uploads.
2. **Add Schema Validation:** Use Zod schemas on all API route request bodies.
3. **Configure Security Headers:** Add Content Security Policy (CSP) and restrict `next/image` remote hostnames.

### Phase 3 — Database & Operational Production Readiness
1. **Migrate to Managed PostgreSQL:** Replace SQLite with Supabase/Neon/Railway PostgreSQL for multi-instance Vercel serverless compatibility.
2. **Distributed Rate Limiting:** Connect Upstash Redis for global rate limiting across serverless lambdas.

---

## Production Security Checklist

- [ ] Real cryptographic server-side sessions implemented (HttpOnly, Secure, SameSite).
- [ ] Forged `jijau_admin_auth=true` cookie exploit eliminated.
- [ ] Real Google OAuth with token verification implemented.
- [ ] Server-side price calculation enforced on all checkout operations.
- [ ] All customer PII endpoints protected with object-ownership authorization.
- [ ] Catalog mutation routes (`/api/products`, `/api/categories`, etc.) protected with admin role checks.
- [ ] Settings API secured against unauthorized UPI/bank detail modification.
- [ ] SVG uploads disabled; image magic-byte validation active.
- [ ] Database files removed from Git and git history cleaned.
- [ ] Production database migrated from SQLite to PostgreSQL.
- [ ] Content-Security-Policy configured in `next.config.mjs`.

---

## Final Verdict

### ⛔ **NOT SAFE TO DEPLOY**

The application contains multiple trivially exploitable **CRITICAL** vulnerabilities that allow total admin panel takeover, complete account takeover of any customer, unauthorized payment redirection, arbitrary database modification, client-side price manipulation, and mass exfiltration of customer personally identifiable information.

**Deployment to `jijaucomputers.in` must be halted until Phase 0 and Phase 1 remediations are fully implemented.**
